import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  addressLine?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
