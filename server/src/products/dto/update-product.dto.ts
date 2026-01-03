import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { ProductStatus } from '../../common/types';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be ACTIVE or INACTIVE' })
  status?: ProductStatus;
}

