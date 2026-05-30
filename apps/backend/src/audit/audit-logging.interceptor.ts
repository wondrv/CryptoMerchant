import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      originalUrl: string;
      path: string;
      ip?: string;
      headers?: Record<string, string | string[] | undefined>;
      user?: { merchantId?: string; role?: string };
    }>();
    const method = request.method.toUpperCase();
    const shouldAudit = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          if (!shouldAudit) {
            return;
          }

          const statusCode = context.switchToHttp().getResponse<{ statusCode?: number }>().statusCode ?? 200;
          void this.auditService.log({
            actorId: request.user?.merchantId ?? null,
            actorRole: request.user?.role ?? null,
            action: `${method} ${request.path}`,
            method,
            path: request.originalUrl ?? request.path,
            resource: context.getClass().name,
            resourceId: null,
            statusCode,
            ip: request.ip ?? null,
            userAgent: Array.isArray(request.headers?.['user-agent'])
              ? request.headers?.['user-agent'][0]
              : request.headers?.['user-agent'] ?? null,
            metadata: {
              durationMs: Date.now() - startedAt,
              responseType: response === undefined ? 'void' : typeof response
            } as Prisma.InputJsonValue
          });
        }
      })
    );
  }
}
