import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Network } from '@prisma/client';
import { MockBlockchainProviderBase } from './mock-provider.base';

@Injectable()
export class TronProvider extends MockBlockchainProviderBase {
  constructor(configService: ConfigService) {
    super(Network.TRON, configService.get<number>('TRON_MOCK_CONFIRMATIONS') ?? 2);
  }
}
