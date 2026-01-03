import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, QueryOrderDto, CancelOrderDto } from './dto';
import { CurrentUser, Roles } from '../common/decorators';
import { Role } from '../common/types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==================== BUYER ENDPOINTS ====================

  @Post()
  async createOrder(
    @CurrentUser('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get()
  async getMyOrders(
    @CurrentUser('userId') userId: string,
    @Query() queryDto: QueryOrderDto,
  ) {
    return this.ordersService.getMyOrders(userId, queryDto);
  }

  @Get(':id')
  async getOrderById(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrderById(userId, id);
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(userId, id, cancelOrderDto);
  }

  @Patch(':id/received')
  async confirmReceived(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.confirmReceived(userId, id);
  }
}

// ==================== SELLER ENDPOINTS ====================

@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.SELLER)
  @Get()
  async getSellerOrders(
    @CurrentUser('userId') userId: string,
    @Query() queryDto: QueryOrderDto,
  ) {
    return this.ordersService.getSellerOrders(userId, queryDto);
  }

  @Roles(Role.SELLER)
  @Get('stats')
  async getSellerOrderStats(@CurrentUser('userId') userId: string) {
    return this.ordersService.getSellerOrderStats(userId);
  }

  @Roles(Role.SELLER)
  @Get(':id')
  async getSellerOrderById(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.getSellerOrderById(userId, id);
  }

  @Roles(Role.SELLER)
  @Patch(':id/confirm')
  async confirmOrder(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.confirmOrder(userId, id);
  }

  @Roles(Role.SELLER)
  @Patch(':id/ship')
  async shipOrder(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.shipOrder(userId, id);
  }

  @Roles(Role.SELLER)
  @Patch(':id/deliver')
  async deliverOrder(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.deliverOrder(userId, id);
  }

  @Roles(Role.SELLER)
  @Patch(':id/cancel')
  async sellerCancelOrder(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ) {
    return this.ordersService.sellerCancelOrder(userId, id, cancelOrderDto);
  }
}

