import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, TransactionStatus, InvoiceStatus, Network } from '@prisma/client';
import * as QRCode from 'qrcode';
import { generateInvoiceNumber } from '../common/utils/id.util';
import { RealtimeService } from '../realtime/realtime.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletsService: WalletsService,
    private readonly transactionsService: TransactionsService,
    private readonly realtimeService: RealtimeService,
    private readonly configService: ConfigService
  ) {}

  async createInvoice(merchantId: string, dto: CreateInvoiceDto) {
    const wallet = await this.walletsService.getOrCreatePrimaryWallet(merchantId, dto.network);
    const invoiceNumber = generateInvoiceNumber();
    const expiredMinutes = dto.expiredMinutes ?? 30;
    const invoice = await this.prisma.invoice.create({
      data: {
        merchant_id: merchantId,
        invoice_number: invoiceNumber,
        amount: new Prisma.Decimal(dto.amount),
        currency: dto.currency,
        network: dto.network,
        wallet_address: wallet.address,
        expired_at: new Date(Date.now() + expiredMinutes * 60 * 1000)
      }
    });

    const paymentUrl = `${this.configService.get<string>('APP_URL') ?? 'http://localhost:3000'}/pay/${invoiceNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl);

    this.realtimeService.emitInvoiceCreated(merchantId, {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      status: invoice.status,
      walletAddress: invoice.wallet_address
    });

    return {
      invoice: this.toInvoiceResponse(invoice),
      paymentUrl,
      walletAddress: wallet.address,
      qrCodeDataUrl
    };
  }

  async listInvoices(merchantId?: string) {
    return this.prisma.invoice.findMany({
      where: merchantId ? { merchant_id: merchantId } : undefined,
      orderBy: { created_at: 'desc' }
    });
  }

  async getInvoiceById(merchantId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id: invoiceId, merchant_id: merchantId } });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { invoice_number: invoiceNumber } });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async cancelInvoice(merchantId: string, invoiceId: string) {
    const invoice = await this.getInvoiceById(merchantId, invoiceId);
    return this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: InvoiceStatus.CANCELLED }
    });
  }

  async expireInvoice(invoiceId: string) {
    const invoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.EXPIRED }
    });
    this.realtimeService.emitInvoiceExpired(invoice.merchant_id, {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      status: invoice.status
    });
    return invoice;
  }

  async markInvoicePaid(input: {
    invoiceId: string;
    txHash: string;
    confirmations: number;
    network: Network;
    amount: string;
  }) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: input.invoiceId } });
    if (!invoice || invoice.status === InvoiceStatus.PAID) {
      return invoice;
    }

    await this.transactionsService.upsertTransaction({
      invoiceId: invoice.id,
      txHash: input.txHash,
      amount: input.amount,
      network: input.network,
      confirmations: input.confirmations,
      status: TransactionStatus.CONFIRMED
    });

    return this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: InvoiceStatus.PAID }
    });
  }

  private toInvoiceResponse(invoice: {
    id: string;
    invoice_number: string;
    amount: Prisma.Decimal;
    currency: string;
    network: Network;
    wallet_address: string;
    status: InvoiceStatus;
    expired_at: Date;
    created_at: Date;
  }) {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      network: invoice.network,
      walletAddress: invoice.wallet_address,
      status: invoice.status,
      expiredAt: invoice.expired_at,
      createdAt: invoice.created_at
    };
  }
}
