import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Network } from '@prisma/client';

export class CreateWalletDto {
  @ApiProperty({ enum: ['TRON', 'ETHEREUM'] })
  @IsEnum(Network)
  network!: Network;
}
