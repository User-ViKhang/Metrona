import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: Decimal;
    stock: number;
    status: string;
    images: { url: string }[];
    shop: {
      id: string;
      name: string;
    };
  };
}

export interface CartByShop {
  shopId: string;
  shopName: string;
  items: {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    image: string | null;
    subtotal: number;
  }[];
  subtotal: number;
}

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getCart(userId: string) {
    // Ensure cart exists
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Get cart items with product details
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
            shop: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by shop
    const cartByShop = this.groupCartByShop(cartItems);

    // Calculate totals
    const total = cartByShop.reduce((sum, shop) => sum + shop.subtotal, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      shops: cartByShop,
      total,
      itemCount,
    };
  }

  private groupCartByShop(cartItems: CartItemWithProduct[]): CartByShop[] {
    const shopMap = new Map<string, CartByShop>();

    for (const item of cartItems) {
      const shopId = item.product.shop.id;
      const shopName = item.product.shop.name;

      if (!shopMap.has(shopId)) {
        shopMap.set(shopId, {
          shopId,
          shopName,
          items: [],
          subtotal: 0,
        });
      }

      const shop = shopMap.get(shopId)!;
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;

      shop.items.push({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price,
        quantity: item.quantity,
        stock: item.product.stock,
        image: item.product.images[0]?.url || null,
        subtotal,
      });

      shop.subtotal += subtotal;
    }

    return Array.from(shopMap.values());
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== 'ACTIVE') {
      throw new BadRequestException('Product is not available');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Only ${product.stock} items available`);
    }

    // Ensure cart exists
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    // Get cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Get cart item
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(`Only ${cartItem.product.stock} items available`);
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { message: 'Cart is already empty' };
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }

  async getCartItemCount(userId: string): Promise<number> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) return 0;

    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

