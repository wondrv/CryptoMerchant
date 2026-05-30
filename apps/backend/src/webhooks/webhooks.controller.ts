import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get('settings')
  settings(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.webhooksService.getSettings(merchant.merchantId);
  }

  @Put('settings')
  update(@CurrentMerchant() merchant: { merchantId: string }, @Body() dto: UpdateWebhookDto) {
    return this.webhooksService.updateSettings(merchant.merchantId, dto);
  }

  @Get('logs')
  logs(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.webhooksService.listLogs(merchant.merchantId);
  }
}
