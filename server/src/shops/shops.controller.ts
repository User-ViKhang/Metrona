import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto';
import { CurrentUser, Public } from '../common/decorators';
import { PaginationDto } from '../common/dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  async createShop(
    @CurrentUser('userId') userId: string,
    @Body() createShopDto: CreateShopDto,
  ) {
    return this.shopsService.createShop(userId, createShopDto);
  }

  @Get('me')
  async getMyShop(@CurrentUser('userId') userId: string) {
    return this.shopsService.getMyShop(userId);
  }

  @Put('me')
  async updateShop(
    @CurrentUser('userId') userId: string,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopsService.updateShop(userId, updateShopDto);
  }

  @Public()
  @Get('search')
  async searchShops(
    @Query('q') query: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.shopsService.searchShops(
      query || '',
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Public()
  @Get(':id')
  async getShopById(@Param('id') id: string) {
    return this.shopsService.getShopById(id);
  }

  @Public()
  @Get(':id/products')
  async getShopProducts(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.shopsService.getShopProducts(
      id,
      paginationDto.page,
      paginationDto.limit,
    );
  }
}

