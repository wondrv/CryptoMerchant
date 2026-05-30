import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWebhookSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  callbackUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secretKey?: string;
}
