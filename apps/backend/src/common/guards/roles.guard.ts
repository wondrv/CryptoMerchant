import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Array<'ADMIN' | 'MERCHANT'>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (requiredRoles === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const role = request.user?.role;
    if (!role) {
      return false;
    }

    return requiredRoles.includes(role as 'ADMIN' | 'MERCHANT');
  }
}
