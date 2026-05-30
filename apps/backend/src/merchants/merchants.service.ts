import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MerchantStatus } from '@prisma/client';
import { generateSecret } from '../common/utils/crypto.util';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWebhookSettingsDto } from './dto/update-webhook-settings.dto';

@Injectable()
export class MerchantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(merchantId: string) {
    return this.getMerchantOrThrow(merchantId);
  }

  async updateWebhookSettings(merchantId: string, dto: UpdateWebhookSettingsDto) {
    const merchant = await this.getMerchantOrThrow(merchantId);

    return this.prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        callback_url: dto.callbackUrl ?? merchant.callback_url,
        secret_key: dto.secretKey ?? merchant.secret_key ?? generateSecret()
      }
    });
  }

  async listMerchants() {
    return this.prisma.merchant.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async suspendMerchant(merchantId: string) {
    return this.prisma.merchant.update({
      where: { id: merchantId },
      data: { status: MerchantStatus.SUSPENDED }
    });
  }

  async activateMerchant(merchantId: string) {
    return this.prisma.merchant.update({
      where: { id: merchantId },
      data: { status: MerchantStatus.ACTIVE }
    });
  }

  async getMerchantApiKey(merchantId: string) {
    const merchant = await this.getMerchantOrThrow(merchantId);
    return { apiKey: merchant.api_key };
  }

  private async getMerchantOrThrow(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    if (merchant.status === MerchantStatus.SUSPENDED) {
      throw new ForbiddenException('Merchant suspended');
    }
    return merchant;
  }
}
