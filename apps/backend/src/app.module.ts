import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AppConfigValidationSchema } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AuditModule } from './audit/audit.module';
import { HealthModule } from './health/health.module';
import { MerchantsModule } from './merchants/merchants.module';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletsModule } from './wallets/wallets.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: AppConfigValidationSchema
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RealtimeModule,
    HealthModule,
    AuthModule,
    MerchantsModule,
    WalletsModule,
    InvoicesModule,
    DashboardModule,
    AuditModule,
    TransactionsModule,
    WithdrawalsModule,
    WebhooksModule,
    BlockchainModule,
    AdminModule
  ]
})
export class AppModule {}
