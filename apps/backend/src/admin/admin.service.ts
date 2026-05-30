import { Injectable } from '@nestjs/common';
import { InvoiceStatus, WithdrawalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MerchantsService } from '../merchants/merchants.service';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly merchantsService: MerchantsService,
    private readonly withdrawalsService: WithdrawalsService
  ) {}

  async dashboard() {
    const [totalInvoices, paidInvoices, pendingInvoices, totalWithdrawals, totalVolume] = await Promise.all([
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PENDING } }),
      this.prisma.withdrawal.count(),
      this.prisma.invoice.aggregate({ _sum: { amount: true } })
    ]);

    const dailyTransactions = await this.prisma.$queryRaw<Array<{ day: string; total: number }>>`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS total
      FROM "Transaction"
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 30
    `;

    return {
      totalVolume: Number(totalVolume._sum.amount ?? 0),
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalWithdrawals,
      dailyTransactions
    };
  }

  merchants() {
    return this.merchantsService.listMerchants();
  }

  invoices() {
    return this.prisma.invoice.findMany({ orderBy: { created_at: 'desc' }, include: { merchant: true } });
  }

  transactions() {
    return this.prisma.transaction.findMany({ orderBy: { created_at: 'desc' }, include: { invoice: true } });
  }

  withdrawals() {
    return this.withdrawalsService.listAllWithdrawals();
  }

  suspendMerchant(merchantId: string) {
    return this.merchantsService.suspendMerchant(merchantId);
  }

  approveWithdrawal(withdrawalId: string) {
    return this.withdrawalsService.approveWithdrawal(withdrawalId);
  }

  auditLogs() {
    return this.prisma.auditLog.findMany({ orderBy: { created_at: 'desc' }, take: 200 });
  }
}
