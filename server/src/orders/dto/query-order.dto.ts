import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../common/types';
import { PaginationDto } from '../../common/dto';

export class QueryOrderDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

