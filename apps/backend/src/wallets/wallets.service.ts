import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Network } from '@prisma/client';
import { generateSecret } from '../common/utils/crypto.util';
import { generateWalletAddress } from '../common/utils/id.util';
import { encryptText } from '../common/utils/encryption.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async createWallet(merchantId: string, network: Network) {
    const secret = this.configService.get<string>('WALLET_ENCRYPTION_KEY') as string;
    const addressPrefix = network === Network.TRON ? 'tron' : 'eth';
    const address = generateWalletAddress(addressPrefix);
    const privateKey = generateSecret();
    const encryptedPrivateKey = encryptText(privateKey, secret);

    return this.prisma.wallet.create({
      data: {
        merchant_id: merchantId,
        address,
        network,
        encrypted_private_key: encryptedPrivateKey
      }
    });
  }

  async getOrCreatePrimaryWallet(merchantId: string, network: Network) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { merchant_id: merchantId, network },
      orderBy: { created_at: 'asc' }
    });

    return wallet ?? this.createWallet(merchantId, network);
  }

  async listWallets(merchantId: string) {
    return this.prisma.wallet.findMany({
      where: { merchant_id: merchantId },
      orderBy: { created_at: 'desc' }
    });
  }
}
