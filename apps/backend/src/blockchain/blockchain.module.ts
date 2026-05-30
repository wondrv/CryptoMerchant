import { Module } from '@nestjs/common';
import { BlockchainListenerService } from './blockchain.listener.service';
import { EthereumProvider } from './providers/ethereum.provider';
import { TronProvider } from './providers/tron.provider';
import { InvoicesModule } from '../invoices/invoices.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [InvoicesModule, TransactionsModule, WebhooksModule, RealtimeModule],
  providers: [BlockchainListenerService, TronProvider, EthereumProvider],
  exports: [BlockchainListenerService]
})
export class BlockchainModule {}
