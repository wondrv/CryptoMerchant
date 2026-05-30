import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLoggingInterceptor } from './audit-logging.interceptor';
import { AuditService } from './audit.service';

@Module({
  providers: [
    AuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggingInterceptor
    }
  ],
  exports: [AuditService]
})
export class AuditModule {}
