import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Network } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty()
  @IsString()
  currency!: string;

  @ApiProperty({ enum: ['TRON', 'ETHEREUM'] })
  @IsEnum(Network)
  network!: Network;

  @ApiPropertyOptional({ default: 30 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  expiredMinutes?: number;
}
