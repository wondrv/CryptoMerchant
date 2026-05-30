import { randomBytes } from 'crypto';

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const entropy = randomBytes(3).toString('hex').toUpperCase();
  return `INV-${timestamp}-${entropy}`;
};

export const generateApiKey = (): string => `ck_${randomBytes(24).toString('hex')}`;

export const generateWalletAddress = (prefix: string): string => {
  const entropy = randomBytes(20).toString('hex');
  return `${prefix}_${entropy}`;
};
