import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MerchantStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { generateApiKey } from '../common/utils/id.util';
import { generateSecret } from '../common/utils/crypto.util';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<{ merchant: Record<string, unknown> } & AuthTokens> {
    const existingMerchant = await this.prisma.merchant.findUnique({ where: { email: dto.email } });
    if (existingMerchant) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const merchant = await this.prisma.merchant.create({
      data: {
        name: dto.name,
        email: dto.email,
        password_hash: passwordHash,
        api_key: generateApiKey(),
        status: MerchantStatus.ACTIVE,
        callback_url: dto.callbackUrl ?? null,
        secret_key: generateSecret()
      }
    });

    const tokens = await this.issueTokens({ merchantId: merchant.id, email: merchant.email, role: 'MERCHANT' });
    await this.persistRefreshToken(merchant.id, tokens.refreshToken);

    return {
      merchant: this.toPublicMerchant(merchant),
      ...tokens
    };
  }

  async login(dto: LoginDto): Promise<{ merchant: Record<string, unknown> } & AuthTokens> {
    const merchant = await this.prisma.merchant.findUnique({ where: { email: dto.email } });
    if (!merchant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(merchant.password_hash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (merchant.status === MerchantStatus.SUSPENDED) {
      throw new ForbiddenException('Merchant suspended');
    }

    const role = merchant.role === 'ADMIN' ? 'ADMIN' : 'MERCHANT';
    const tokens = await this.issueTokens({ merchantId: merchant.id, email: merchant.email, role });
    await this.persistRefreshToken(merchant.id, tokens.refreshToken);

    return {
      merchant: this.toPublicMerchant(merchant),
      ...tokens
    };
  }

  async refresh(dto: RefreshDto): Promise<AuthTokens> {
    let payload: { sub?: string; email?: string; role?: 'ADMIN' | 'MERCHANT' };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const merchant = await this.prisma.merchant.findUnique({ where: { id: payload.sub } });
    if (!merchant?.refresh_token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const validRefreshToken = await argon2.verify(merchant.refresh_token, dto.refreshToken);
    if (!validRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const role = merchant.role === 'ADMIN' ? 'ADMIN' : 'MERCHANT';
    const tokens = await this.issueTokens({ merchantId: merchant.id, email: merchant.email, role });
    await this.persistRefreshToken(merchant.id, tokens.refreshToken);

    return tokens;
  }

  async logout(merchantId: string): Promise<{ message: string }> {
    await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { refresh_token: null }
    });

    return { message: 'Logged out' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ resetToken: string }> {
    const isProduction = (this.configService.get<string>('NODE_ENV') ?? 'development') === 'production';
    const merchant = await this.prisma.merchant.findUnique({ where: { email: dto.email } });
    if (!merchant) {
      return { resetToken: 'not-found' };
    }

    const resetToken = generateSecret();
    const resetTokenHash = await argon2.hash(resetToken);

    await this.prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        password_reset_token_hash: resetTokenHash,
        password_reset_expires_at: new Date(Date.now() + 1000 * 60 * 30)
      }
    });

    if (isProduction) {
      return { resetToken: 'hidden' };
    }

    return { resetToken };
  }

  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const merchants = await this.prisma.merchant.findMany({
      where: {
        password_reset_token_hash: { not: null },
        password_reset_expires_at: { gt: new Date() }
      }
    });

    for (const merchant of merchants) {
      if (!merchant.password_reset_token_hash) {
        continue;
      }

      const matches = await argon2.verify(merchant.password_reset_token_hash, dto.token);
      if (!matches) {
        continue;
      }

      await this.prisma.merchant.update({
        where: { id: merchant.id },
        data: {
          password_hash: await argon2.hash(dto.newPassword),
          password_reset_token_hash: null,
          password_reset_expires_at: null,
          refresh_token: null
        }
      });

      return { message: 'Password changed' };
    }

    throw new NotFoundException('Reset token invalid or expired');
  }

  async me(merchantId: string): Promise<Record<string, unknown> | null> {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    return merchant ? this.toPublicMerchant(merchant) : null;
  }

  private async issueTokens(payload: { merchantId: string; email: string; role: 'ADMIN' | 'MERCHANT' }): Promise<AuthTokens> {
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = await this.jwtService.signAsync(
      { email: payload.email, role: payload.role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        subject: payload.merchantId,
        expiresIn: accessExpiresIn as any
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      { email: payload.email, role: payload.role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        subject: payload.merchantId,
        expiresIn: refreshExpiresIn as any
      }
    );

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(merchantId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.merchant.update({
      where: { id: merchantId },
      data: { refresh_token: hashedRefreshToken }
    });
  }

  private toPublicMerchant(merchant: {
    id: string;
    name: string;
    email: string;
    api_key: string;
    status: MerchantStatus;
    callback_url: string | null;
    role: string;
    created_at: Date;
  }): Record<string, unknown> {
    return {
      id: merchant.id,
      name: merchant.name,
      email: merchant.email,
      apiKey: merchant.api_key,
      status: merchant.status,
      callbackUrl: merchant.callback_url,
      role: merchant.role,
      createdAt: merchant.created_at
    };
  }
}
