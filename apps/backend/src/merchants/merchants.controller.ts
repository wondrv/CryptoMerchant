import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateWebhookSettingsDto } from './dto/update-webhook-settings.dto';
import { MerchantsService } from './merchants.service';

@ApiTags('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('profile')
  profile(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.merchantsService.getProfile(merchant.merchantId);
  }

  @Get('api-key')
  apiKey(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.merchantsService.getMerchantApiKey(merchant.merchantId);
  }

  @Put('webhook')
  updateWebhook(
    @CurrentMerchant() merchant: { merchantId: string },
    @Body() dto: UpdateWebhookSettingsDto
  ) {
    return this.merchantsService.updateWebhookSettings(merchant.merchantId, dto);
  }
}
