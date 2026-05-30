import { Injectable } from '@nestjs/common';
import { Network, Prisma, TransactionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertTransaction(input: {
    invoiceId: string;
    txHash: string;
    amount: string;
    network: Network;
    confirmations: number;
    status: TransactionStatus;
  }) {
    return this.prisma.transaction.upsert({
      where: { tx_hash: input.txHash },
      create: {
        invoice_id: input.invoiceId,
        tx_hash: input.txHash,
        amount: new Prisma.Decimal(input.amount),
        network: input.network,
        confirmations: input.confirmations,
        status: input.status,
        confirmed_at: input.status === TransactionStatus.CONFIRMED ? new Date() : null
      },
      update: {
        confirmations: input.confirmations,
        status: input.status,
        confirmed_at: input.status === TransactionStatus.CONFIRMED ? new Date() : null
      }
    });
  }

  async listMerchantTransactions(merchantId: string) {
    return this.prisma.transaction.findMany({
      where: { invoice: { merchant_id: merchantId } },
      orderBy: { created_at: 'desc' },
      include: { invoice: true }
    });
  }

  async listAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { created_at: 'desc' },
      include: { invoice: true }
    });
  }
}
