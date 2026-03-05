import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return address;
  }

  async create(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    return this.prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: isDefault || addressCount === 0,
      },
    });
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    // Check if address exists and belongs to user
    await this.findOne(userId, id);

    const { isDefault, ...addressData } = updateAddressDto;

    // If setting as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: {
        ...addressData,
        ...(isDefault !== undefined && { isDefault }),
      },
    });
  }

  async remove(userId: string, id: string) {
    // Check if address exists and belongs to user
    const address = await this.findOne(userId, id);

    await this.prisma.address.delete({
      where: { id },
    });

    // If deleted address was default, set another address as default
    if (address.isDefault) {
      const firstAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await this.prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }

  async setDefault(userId: string, id: string) {
    // Check if address exists and belongs to user
    await this.findOne(userId, id);

    // Unset all default addresses
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set this address as default
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async getDefault(userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { userId, isDefault: true },
    });

    if (!address) {
      throw new NotFoundException('No default address found');
    }

    return address;
  }
}
