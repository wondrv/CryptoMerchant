import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentMerchant } from '../common/decorators/current-merchant.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MERCHANT')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Public()
  @Get('public/:invoiceNumber')
  publicDetail(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoicesService.getInvoiceByNumber(invoiceNumber);
  }

  @Post()
  create(@CurrentMerchant() merchant: { merchantId: string }, @Body() dto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(merchant.merchantId, dto);
  }

  @Get()
  list(@CurrentMerchant() merchant: { merchantId: string }) {
    return this.invoicesService.listInvoices(merchant.merchantId);
  }

  @Get(':id')
  detail(@CurrentMerchant() merchant: { merchantId: string }, @Param('id') id: string) {
    return this.invoicesService.getInvoiceById(merchant.merchantId, id);
  }

  @Public()
  @Patch(':id/cancel')
  cancel(@CurrentMerchant() merchant: { merchantId: string }, @Param('id') id: string) {
    return this.invoicesService.cancelInvoice(merchant.merchantId, id);
  }
}
