import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get('merchants')
  merchants() {
    return this.adminService.merchants();
  }

  @Get('invoices')
  invoices() {
    return this.adminService.invoices();
  }

  @Get('transactions')
  transactions() {
    return this.adminService.transactions();
  }

  @Get('withdrawals')
  withdrawals() {
    return this.adminService.withdrawals();
  }

  @Patch('merchants/:id/suspend')
  suspendMerchant(@Param('id') id: string) {
    return this.adminService.suspendMerchant(id);
  }

  @Patch('withdrawals/:id/approve')
  approveWithdrawal(@Param('id') id: string) {
    return this.adminService.approveWithdrawal(id);
  }

  @Get('audit-logs')
  auditLogs() {
    return this.adminService.auditLogs();
  }
}
