import { Injectable, NotFoundException } from '@nestjs/common';
import { Network, Prisma, WithdrawalStatus } from '@prisma/client';
import { RealtimeService } from '../realtime/realtime.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService
  ) {}

  async createWithdrawal(merchantId: string, dto: CreateWithdrawalDto) {
    return this.prisma.withdrawal.create({
      data: {
        merchant_id: merchantId,
        amount: new Prisma.Decimal(dto.amount),
        destination_wallet: dto.destinationWallet,
        network: dto.network,
        status: WithdrawalStatus.PENDING
      }
    });
  }

  async listMerchantWithdrawals(merchantId: string) {
    return this.prisma.withdrawal.findMany({
      where: { merchant_id: merchantId },
      orderBy: { created_at: 'desc' }
    });
  }

  async listAllWithdrawals() {
    return this.prisma.withdrawal.findMany({
      orderBy: { created_at: 'desc' },
      include: { merchant: true }
    });
  }

  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    const completedWithdrawal = await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.COMPLETED }
    });

    this.realtimeService.emitWithdrawalCompleted(completedWithdrawal.merchant_id, {
      withdrawalId: completedWithdrawal.id,
      amount: Number(completedWithdrawal.amount),
      status: completedWithdrawal.status
    });

    return completedWithdrawal;
  }

  async rejectWithdrawal(withdrawalId: string) {
    return this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.REJECTED }
    });
  }
}
