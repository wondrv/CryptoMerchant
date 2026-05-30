import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InvoiceStatus, Network, TransactionStatus } from '@prisma/client';
import { EthereumProvider } from './providers/ethereum.provider';
import { IBlockchainProvider } from './providers/blockchain-provider.interface';
import { TronProvider } from './providers/tron.provider';
import { InvoicesService } from '../invoices/invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WebhooksService } from '../webhooks/webhooks.service';

@Injectable()
export class BlockchainListenerService {
  private readonly logger = new Logger(BlockchainListenerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly invoicesService: InvoicesService,
    private readonly transactionsService: TransactionsService,
    private readonly webhooksService: WebhooksService,
    private readonly realtimeService: RealtimeService,
    private readonly tronProvider: TronProvider,
    private readonly ethereumProvider: EthereumProvider
  ) {}

  @Interval(10000)
  async scanPendingInvoices(): Promise<void> {
    const pendingInvoices = await this.prisma.invoice.findMany({
      where: { status: InvoiceStatus.PENDING },
      orderBy: { created_at: 'asc' }
    });

    for (const invoice of pendingInvoices) {
      if (invoice.expired_at <= new Date()) {
        await this.invoicesService.expireInvoice(invoice.id);
        this.realtimeService.emitInvoiceExpired(invoice.merchant_id, {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          status: 'expired'
        });
        continue;
      }

      const provider = this.resolveProvider(invoice.network);
      await provider.watchAddress(invoice.wallet_address);
      const transaction = await provider.getTransaction(invoice.wallet_address);
      if (!transaction) {
        continue;
      }

      const validation = await provider.validatePayment(invoice, transaction);
      if (!validation) {
        await this.transactionsService.upsertTransaction({
          invoiceId: invoice.id,
          txHash: transaction.txHash,
          amount: transaction.amount,
          network: invoice.network,
          confirmations: transaction.confirmations,
          status: TransactionStatus.CONFIRMING
        });
        continue;
      }

      const paidInvoice = await this.invoicesService.markInvoicePaid({
        invoiceId: invoice.id,
        txHash: transaction.txHash,
        confirmations: transaction.confirmations,
        network: invoice.network,
        amount: transaction.amount
      });

      if (paidInvoice) {
        await this.webhooksService.dispatchInvoicePaid({
          merchantId: paidInvoice.merchant_id,
          invoiceId: paidInvoice.id,
          amount: paidInvoice.amount,
          currency: paidInvoice.currency,
          txHash: transaction.txHash
        });

        this.realtimeService.emitInvoicePaid(paidInvoice.merchant_id, {
          invoiceId: paidInvoice.id,
          invoiceNumber: paidInvoice.invoice_number,
          txHash: transaction.txHash,
          status: 'paid'
        });
      }
    }

    this.logger.debug(`scanned ${pendingInvoices.length} pending invoices`);
  }

  private resolveProvider(network: Network): IBlockchainProvider {
    return network === Network.TRON ? this.tronProvider : this.ethereumProvider;
  }
}
