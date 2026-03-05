import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, CreateAddressDto, UpdateAddressDto } from './dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        shop: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        language: true,
      },
    });

    return user;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    // Get current user to check for old avatar
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    // Delete old avatar file if exists
    if (currentUser?.avatar) {
      try {
        const oldFilePath = join(process.cwd(), currentUser.avatar.replace(/^\//, ''));
        await unlink(oldFilePath);
      } catch (error) {
        // Ignore error if file doesn't exist
        console.log('Could not delete old avatar:', error.message);
      }
    }

    // Update user with new avatar
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // ==================== ADDRESS MANAGEMENT ====================

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this address is default, unset other defaults
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if user has no address, make this default
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

  async updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const { isDefault, ...addressData } = updateAddressDto;

    // If setting as default, unset other defaults
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...addressData,
        isDefault,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Check if it's the only address
    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    if (addressCount === 1) {
      throw new BadRequestException('Cannot delete the only address');
    }

    // If deleting default address, set another as default
    if (address.isDefault) {
      const otherAddress = await this.prisma.address.findFirst({
        where: { userId, id: { not: addressId } },
        orderBy: { createdAt: 'desc' },
      });

      if (otherAddress) {
        await this.prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Unset all defaults
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}

