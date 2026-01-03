import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty({ message: 'Shop name is required' })
  @MinLength(2, { message: 'Shop name must be at least 2 characters' })
  @MaxLength(100, { message: 'Shop name must be at most 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must be at most 1000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  banner?: string;
}

