import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto, ProductSortBy } from './dto';
import { Prisma } from '@prisma/client';
import { createPaginatedResult } from '../common/dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async createProduct(userId: string, createProductDto: CreateProductDto) {
    // Get user's shop
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You need to create a shop first');
    }

    const { images, categoryIds, ...productData } = createProductDto;

    // Create product with images and categories
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        shopId: shop.id,
        images: images?.length
          ? {
              create: images.map((url, index) => ({
                url,
                order: index,
              })),
            }
          : undefined,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        categories: {
          include: {
            category: true,
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
    });

    return product;
  }

  async getProducts(queryDto: QueryProductDto) {
    const { page = 1, limit = 20, search, categoryId, shopId, minPrice, maxPrice, sortBy } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    }

    if (shopId) {
      where.shopId = shopId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build order by
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sortBy) {
      case ProductSortBy.PRICE_LOW:
        orderBy = { price: 'asc' };
        break;
      case ProductSortBy.PRICE_HIGH:
        orderBy = { price: 'desc' };
        break;
      case ProductSortBy.BEST_SELLING:
        orderBy = { sold: 'desc' };
        break;
      case ProductSortBy.RATING:
        orderBy = { rating: 'desc' };
        break;
      case ProductSortBy.NEWEST:
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' },
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
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginatedResult(products, total, page, limit);
  }

  async getProductById(productId: string) {
    // Try to get from cache first
    const cacheKey = `product:${productId}`;
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categories: {
          include: {
            category: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            logo: true,
            rating: true,
            totalSold: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache for 5 minutes
    await this.redisService.setJson(cacheKey, product, 300);

    return product;
  }

  async updateProduct(userId: string, productId: string, updateProductDto: UpdateProductDto) {
    // Verify ownership
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.ownerId !== userId) {
      throw new ForbiddenException('You do not own this product');
    }

    const { images, categoryIds, ...productData } = updateProductDto;

    // Update product
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        // Update images if provided
        images: images
          ? {
              deleteMany: {},
              create: images.map((url, index) => ({
                url,
                order: index,
              })),
            }
          : undefined,
        // Update categories if provided
        categories: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        categories: {
          include: {
            category: true,
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
    });

    // Invalidate cache
    await this.redisService.del(`product:${productId}`);

    return updatedProduct;
  }

  async deleteProduct(userId: string, productId: string) {
    // Verify ownership
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.ownerId !== userId) {
      throw new ForbiddenException('You do not own this product');
    }

    // Soft delete by setting status to INACTIVE
    await this.prisma.product.update({
      where: { id: productId },
      data: { status: 'INACTIVE' },
    });

    // Invalidate cache
    await this.redisService.del(`product:${productId}`);

    return { message: 'Product deleted successfully' };
  }

  // Seller's products
  async getMyProducts(userId: string, page = 1, limit = 20) {
    const shop = await this.prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (!shop) {
      throw new ForbiddenException('You do not have a shop');
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { shopId: shop.id },
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
        where: { shopId: shop.id },
      }),
    ]);

    return createPaginatedResult(products, total, page, limit);
  }
}

