import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import { CurrentUser, Public, Roles } from '../common/decorators';
import { PaginationDto } from '../common/dto';
import { Role } from '../common/types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.SELLER)
  @Post()
  async createProduct(
    @CurrentUser('userId') userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(userId, createProductDto);
  }

  @Public()
  @Get()
  async getProducts(@Query() queryDto: QueryProductDto) {
    return this.productsService.getProducts(queryDto);
  }

  @Roles(Role.SELLER)
  @Get('me')
  async getMyProducts(
    @CurrentUser('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productsService.getMyProducts(
      userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Public()
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Roles(Role.SELLER)
  @Put(':id')
  async updateProduct(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(userId, id, updateProductDto);
  }

  @Roles(Role.SELLER)
  @Delete(':id')
  async deleteProduct(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.productsService.deleteProduct(userId, id);
  }
}

