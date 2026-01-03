import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Cancel reason must be at most 500 characters' })
  reason?: string;
}

