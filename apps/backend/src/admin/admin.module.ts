import { Module } from '@nestjs/common';
import { MerchantsModule } from '../merchants/merchants.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule, MerchantsModule, WithdrawalsModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
