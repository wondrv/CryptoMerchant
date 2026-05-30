import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthService } from '../src/auth/auth.service';

jest.mock('argon2');

describe('AuthService', () => {
  const prisma = {
    merchant: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn()
    }
  } as any;
  const jwtService = { signAsync: jest.fn().mockResolvedValue('signed-token') } as unknown as JwtService;
  const configService = { get: jest.fn((key: string) => (key.includes('SECRET') ? 'super-secret-key-123456' : '15m')) } as unknown as ConfigService;
  const authService = new AuthService(prisma, jwtService, configService);

  beforeEach(() => {
    jest.resetAllMocks();
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');
    (argon2.verify as jest.Mock).mockResolvedValue(true);
  });

  it('registers a merchant and returns auth tokens', async () => {
    prisma.merchant.findUnique.mockResolvedValue(null);
    prisma.merchant.create.mockResolvedValue({
      id: 'merchant-1',
      name: 'Demo Merchant',
      email: 'merchant@example.com',
      api_key: 'api-key',
      status: 'ACTIVE',
      callback_url: null,
      role: 'MERCHANT',
      created_at: new Date()
    });

    const result = await authService.register({
      name: 'Demo Merchant',
      email: 'merchant@example.com',
      password: 'password123'
    });

    expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(result.merchant).toBeDefined();
    expect(prisma.merchant.create).toHaveBeenCalled();
  });
});
