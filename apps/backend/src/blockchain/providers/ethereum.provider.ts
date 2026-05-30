import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Network } from '@prisma/client';
import { MockBlockchainProviderBase } from './mock-provider.base';

@Injectable()
export class EthereumProvider extends MockBlockchainProviderBase {
  constructor(configService: ConfigService) {
    super(Network.ETHEREUM, configService.get<number>('ETHEREUM_MOCK_CONFIRMATIONS') ?? 3);
  }
}
