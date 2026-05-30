import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async merchantDashboard(merchantId: string) {
    const [totalInvoices, paidInvoices, pendingInvoices, totalWithdrawals, volume] = await Promise.all([
      this.prisma.invoice.count({ where: { merchant_id: merchantId } }),
      this.prisma.invoice.count({ where: { merchant_id: merchantId, status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({ where: { merchant_id: merchantId, status: InvoiceStatus.PENDING } }),
      this.prisma.withdrawal.count({ where: { merchant_id: merchantId } }),
      this.prisma.invoice.aggregate({ where: { merchant_id: merchantId, status: InvoiceStatus.PAID }, _sum: { amount: true } })
    ]);

    const dailyTransactions = await this.prisma.$queryRaw<Array<{ day: string; total: number }>>`
      SELECT TO_CHAR(t.created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS total
      FROM "Transaction" t
      INNER JOIN "Invoice" i ON i.id = t.invoice_id
      WHERE i.merchant_id = ${merchantId}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 30
    `;

    return {
      totalVolume: Number(volume._sum.amount ?? 0),
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalWithdrawals,
      dailyTransactions
    };
  }
}
