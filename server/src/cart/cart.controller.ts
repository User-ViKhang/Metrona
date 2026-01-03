import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { CurrentUser } from '../common/decorators';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  async addToCart(
    @CurrentUser('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Put('items/:itemId')
  async updateCartItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
  }

  @Delete('items/:itemId')
  async removeCartItem(
    @CurrentUser('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeCartItem(userId, itemId);
  }

  @Delete()
  async clearCart(@CurrentUser('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Get('count')
  async getCartItemCount(@CurrentUser('userId') userId: string) {
    const count = await this.cartService.getCartItemCount(userId);
    return { count };
  }
}

