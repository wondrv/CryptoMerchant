import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';

@Module({
  imports: [RealtimeModule],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
  exports: [WithdrawalsService]
})
export class WithdrawalsModule {}
