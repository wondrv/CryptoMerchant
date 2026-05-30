import { Injectable } from '@nestjs/common';
import { Prisma, WebhookLog } from '@prisma/client';
import { createWebhookSignature } from '../common/utils/crypto.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async updateSettings(merchantId: string, input: { callbackUrl?: string; secretKey?: string }) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) {
      return null;
    }

    return this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        callback_url: input.callbackUrl ?? merchant.callback_url,
        secret_key: input.secretKey ?? merchant.secret_key
      }
    });
  }

  async getSettings(merchantId: string) {
    return this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { callback_url: true, secret_key: true }
    });
  }

  async dispatchInvoicePaid(params: {
    merchantId: string;
    invoiceId: string;
    amount: Prisma.Decimal;
    currency: string;
    txHash: string;
  }): Promise<{ dispatched: boolean }> {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: params.merchantId } });
    if (!merchant?.callback_url || !merchant.secret_key) {
      return { dispatched: false };
    }

    const payload = {
      invoice_id: params.invoiceId,
      status: 'paid',
      amount: Number(params.amount),
      currency: params.currency,
      tx_hash: params.txHash
    };
    const body = JSON.stringify(payload);
    const timestamp = Date.now().toString();
    const signature = createWebhookSignature(`${timestamp}.${body}`, merchant.secret_key);

    let responseCode = 0;
    try {
      const response = await fetch(merchant.callback_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crypto-signature': signature,
          'x-crypto-timestamp': timestamp
        },
        body
      });
      responseCode = response.status;
    } catch {
      responseCode = 500;
    }

    await this.prisma.webhookLog.create({
      data: {
        merchant_id: params.merchantId,
        invoice_id: params.invoiceId,
        payload,
        response_code: responseCode
      }
    });

    return { dispatched: true };
  }

  verifySignature(payload: string, secretKey: string, signature: string, timestamp: string): boolean {
    const expected = createWebhookSignature(`${timestamp}.${payload}`, secretKey);
    return expected === signature;
  }

  async listLogs(merchantId: string): Promise<WebhookLog[]> {
    return this.prisma.webhookLog.findMany({ where: { merchant_id: merchantId }, orderBy: { created_at: 'desc' } });
  }
}
