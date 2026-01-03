import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto, UpdateShopDto } from './dto';
import { Role } from '../common/types';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async createShop(userId: string, createShopDto: CreateShopDto) {
    // Check if user already has a shop
    const existingShop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (existingShop) {
      throw new ConflictException('User already has a shop');
    }

    // Create shop and update user role in a transaction
    const [shop] = await this.prisma.$transaction([
      this.prisma.shop.create({
        data: {
          ...createShopDto,
          ownerId: userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.SELLER },
      }),
    ]);

    return shop;
  }

  async getShopById(shopId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return {
      ...shop,
      productCount: shop._count.products,
      _count: undefined,
    };
  }

  async getMyShop(userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('You do not have a shop yet');
    }

    return shop;
  }

  async updateShop(userId: string, updateShopDto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.prisma.shop.update({
      where: { id: shop.id },
      data: updateShopDto,
    });
  }

  async getShopProducts(shopId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          shopId,
          status: 'ACTIVE',
        },
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: {
          shopId,
          status: 'ACTIVE',
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchShops(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      this.prisma.shop.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        include: {
          _count: {
            select: {
              products: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      this.prisma.shop.count({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
      }),
    ]);

    return {
      data: shops,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

