import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalsService } from './withdrawals.service';

@ApiTags('withdrawals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  create(@CurrentMerchant() merchant: { merchantId: string }, @Body() dto: CreateWithdrawalDto) {
    return this.withdrawalsService.createWithdrawal(merchant.merchantId, dto);
  }

  @Get()
  list(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.withdrawalsService.listMerchantWithdrawals(merchant.merchantId);
  }

  @Roles('ADMIN')
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.withdrawalsService.approveWithdrawal(id);
  }

  @Roles('ADMIN')
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.withdrawalsService.rejectWithdrawal(id);
  }
}
