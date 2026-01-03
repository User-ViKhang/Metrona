import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^[0-9]{10,11}$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Province is required' })
  province: string;

  @IsString()
  @IsNotEmpty({ message: 'District is required' })
  district: string;

  @IsString()
  @IsNotEmpty({ message: 'Ward is required' })
  ward: string;

  @IsString()
  @IsNotEmpty({ message: 'Address line is required' })
  addressLine: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

