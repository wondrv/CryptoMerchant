import { ApiProperty } from '@nestjs/swagger';
import { Network } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty()
  @IsString()
  destinationWallet!: string;

  @ApiProperty({ enum: ['TRON', 'ETHEREUM'] })
  @IsEnum(Network)
  network!: Network;
}
