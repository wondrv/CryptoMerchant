import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type AuditLogInput = {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  method: string;
  path: string;
  resource?: string | null;
  resourceId?: string | null;
  statusCode: number;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actor_id: input.actorId ?? null,
          actor_role: input.actorRole ?? null,
          action: input.action,
          method: input.method,
          path: input.path,
          resource: input.resource ?? null,
          resource_id: input.resourceId ?? null,
          status_code: input.statusCode,
          ip: input.ip ?? null,
          user_agent: input.userAgent ?? null,
          metadata: input.metadata ?? Prisma.JsonNull
        }
      });
    } catch (error) {
      this.logger.warn(`Audit log write failed for ${input.method} ${input.path}: ${(error as Error).message}`);
    }
  }
}
