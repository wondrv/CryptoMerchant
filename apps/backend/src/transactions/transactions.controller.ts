import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  list(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.transactionsService.listMerchantTransactions(merchant.merchantId);
  }

  @Roles('ADMIN')
  @Get('global')
  global() {
    return this.transactionsService.listAllTransactions();
  }
}
