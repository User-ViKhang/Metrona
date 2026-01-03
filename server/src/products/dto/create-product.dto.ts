import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MinLength(2, { message: 'Product name must be at least 2 characters' })
  @MaxLength(200, { message: 'Product name must be at most 200 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Description must be at most 5000 characters' })
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Compare price must be a number' })
  @Min(0, { message: 'Compare price must be at least 0' })
  comparePrice?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}

