import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  callbackUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secretKey?: string;
}
