import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  emitInvoiceCreated(merchantId: string, payload: unknown): void {
    this.gateway.emitToMerchant(merchantId, 'invoice_created', payload);
  }

  emitInvoicePaid(merchantId: string, payload: unknown): void {
    this.gateway.emitToMerchant(merchantId, 'invoice_paid', payload);
  }

  emitInvoiceExpired(merchantId: string, payload: unknown): void {
    this.gateway.emitToMerchant(merchantId, 'invoice_expired', payload);
  }

  emitWithdrawalCompleted(merchantId: string, payload: unknown): void {
    this.gateway.emitToMerchant(merchantId, 'withdrawal_completed', payload);
  }
}
