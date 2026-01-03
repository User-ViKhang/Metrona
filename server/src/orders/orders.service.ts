import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, QueryOrderDto, CancelOrderDto } from './dto';
import { generateOrderNumber } from '../common/utils';
import { createPaginatedResult } from '../common/dto';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '../common/types';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ==================== BUYER SIDE ====================

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, note, items } = createOrderDto;

    // Validate address
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Get items from cart or from dto
    let orderItems: { productId: string; quantity: number }[];

    if (items && items.length > 0) {
      orderItems = items;
    } else {
      // Get from cart
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      orderItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
    }

    // Validate products and group by shop
    const productIds = orderItems.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'ACTIVE',
      },
      include: {
        shop: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products are not available');
    }

    // Check stock and group by shop
    const shopOrders = new Map<
      string,
      {
        shopId: string;
        items: {
          product: (typeof products)[0];
          quantity: number;
        }[];
      }
    >();

    for (const orderItem of orderItems) {
      const product = products.find((p) => p.id === orderItem.productId);
      if (!product) continue;

      if (product.stock < orderItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      const shopId = product.shopId;
      if (!shopOrders.has(shopId)) {
        shopOrders.set(shopId, { shopId, items: [] });
      }

      shopOrders.get(shopId)!.items.push({
        product,
        quantity: orderItem.quantity,
      });
    }

    // Create orders for each shop in a transaction
    const createdOrders = await this.prisma.$transaction(async (tx) => {
      const orders: any[] = [];

      for (const [shopId, shopOrder] of shopOrders) {
        // Calculate totals
        let subtotal = 0;
        const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];

        for (const item of shopOrder.items) {
          const price = Number(item.product.price);
          const total = price * item.quantity;
          subtotal += total;

          orderItemsData.push({
            product: { connect: { id: item.product.id } },
            name: item.product.name,
            price: price,
            quantity: item.quantity,
            total: total,
          });

          // Update stock
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stock: { decrement: item.quantity },
              sold: { increment: item.quantity },
            },
          });
        }

        const shippingFee = 0; // MVP: free shipping
        const discount = 0;
        const orderTotal = subtotal + shippingFee - discount;

        // Create order
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            buyerId: userId,
            shopId,
            addressId,
            subtotal,
            shippingFee,
            discount,
            total: orderTotal,
            note,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
            shop: {
              select: {
                id: true,
                name: true,
              },
            },
            address: true,
          },
        });

        orders.push(order);
      }

      // Clear cart if order was created from cart
      if (!items || items.length === 0) {
        const cart = await tx.cart.findUnique({
          where: { userId },
        });
        if (cart) {
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }
      }

      return orders;
    });

    return createdOrders;
  }

  async getMyOrders(userId: string, queryDto: QueryOrderDto) {
    const { page = 1, limit = 20, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      buyerId: userId,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
          shop: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return createPaginatedResult(orders, total, page, limit);
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(userId: string, orderId: string, cancelOrderDto: CancelOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow cancellation for PENDING orders
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Cancel order and restore stock
    await this.prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancelReason: cancelOrderDto.reason,
          cancelledAt: new Date(),
        },
      });
    });

    return { message: 'Order cancelled successfully' };
  }

  async confirmReceived(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Order has not been delivered yet');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return { message: 'Order completed successfully' };
  }

  // ==================== SELLER SIDE ====================

  async getSellerOrders(userId: string, queryDto: QueryOrderDto) {
    const { page = 1, limit = 20, status } = queryDto;
    const skip = (page - 1) * limit;

    // Get seller's shop
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const where: Prisma.OrderWhereInput = {
      shopId: shop.id,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return createPaginatedResult(orders, total, page, limit);
  }

  async getSellerOrderById(userId: string, orderId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async confirmOrder(userId: string, orderId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be confirmed');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
    });

    return { message: 'Order confirmed successfully' };
  }

  async shipOrder(userId: string, orderId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order must be confirmed before shipping');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SHIPPING,
        shippedAt: new Date(),
      },
    });

    return { message: 'Order is now shipping' };
  }

  async deliverOrder(userId: string, orderId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.SHIPPING) {
      throw new BadRequestException('Order must be shipping before delivery');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED,
        deliveredAt: new Date(),
      },
    });

    return { message: 'Order delivered successfully' };
  }

  async sellerCancelOrder(userId: string, orderId: string, cancelOrderDto: CancelOrderDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        shopId: shop.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Seller can cancel PENDING or CONFIRMED orders
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status as OrderStatus)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Cancel order and restore stock
    await this.prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancelReason: cancelOrderDto.reason || 'Cancelled by seller',
          cancelledAt: new Date(),
        },
      });
    });

    return { message: 'Order cancelled successfully' };
  }

  // ==================== STATISTICS ====================

  async getSellerOrderStats(userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const [pending, confirmed, shipping, delivered, completed, cancelled] =
      await Promise.all([
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.PENDING } }),
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.CONFIRMED } }),
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.SHIPPING } }),
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.DELIVERED } }),
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.COMPLETED } }),
        this.prisma.order.count({ where: { shopId: shop.id, status: OrderStatus.CANCELLED } }),
      ]);

    return {
      pending,
      confirmed,
      shipping,
      delivered,
      completed,
      cancelled,
      total: pending + confirmed + shipping + delivered + completed + cancelled,
    };
  }
}

