import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../common/decorators/current-merchant.decorator';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'MERCHANT';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      merchantId: payload.sub,
      email: payload.email,
      role: payload.role
    };
  }
}
