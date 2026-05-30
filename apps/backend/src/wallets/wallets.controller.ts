import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'List merchant wallets' })
  list(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.walletsService.listWallets(merchant.merchantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  create(@CurrentMerchant() merchant: { merchantId: string }, @Body() dto: CreateWalletDto) {
    return this.walletsService.createWallet(merchant.merchantId, dto.network);
  }
}
