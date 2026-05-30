import { createHmac, randomBytes } from 'crypto';

export const createWebhookSignature = (payload: string, secret: string): string =>
  createHmac('sha256', secret).update(payload).digest('hex');

export const generateSecret = (): string => randomBytes(32).toString('hex');
