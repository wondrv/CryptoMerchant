import { ConfigService } from '@nestjs/config';
import { InvoicesService } from '../src/invoices/invoices.service';
import { WalletsService } from '../src/wallets/wallets.service';
import { TransactionsService } from '../src/transactions/transactions.service';
import { RealtimeService } from '../src/realtime/realtime.service';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,qr')
}));

describe('InvoicesService', () => {
  const prisma = {
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    }
  } as any;
  const walletsService = {
    getOrCreatePrimaryWallet: jest.fn().mockResolvedValue({ address: 'tron_123' })
  } as unknown as WalletsService;
  const transactionsService = {
    upsertTransaction: jest.fn()
  } as unknown as TransactionsService;
  const realtimeService = {
    emitInvoiceCreated: jest.fn(),
    emitInvoiceExpired: jest.fn(),
    emitInvoicePaid: jest.fn()
  } as unknown as RealtimeService;
  const configService = { get: jest.fn(() => 'http://localhost:3000') } as unknown as ConfigService;
  const service = new InvoicesService(prisma, walletsService, transactionsService, realtimeService, configService);

  it('creates an invoice with a payment url and qr code', async () => {
    prisma.invoice.create.mockResolvedValue({
      id: 'invoice-1',
      invoice_number: 'INV-1',
      amount: { toString: () => '100' },
      currency: 'USDT',
      network: 'TRON',
      wallet_address: 'tron_123',
      status: 'PENDING',
      expired_at: new Date(),
      created_at: new Date()
    });

    const result = await service.createInvoice('merchant-1', {
      amount: 100,
      currency: 'USDT',
      network: 'TRON',
      expiredMinutes: 30
    });

    expect(result.paymentUrl).toContain('/pay/INV-');
    expect(realtimeService.emitInvoiceCreated).toHaveBeenCalled();
  });
});
