import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateAddressDto, UpdateAddressDto } from './dto';
import { CurrentUser } from '../common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  // ==================== ADDRESS ENDPOINTS ====================

  @Get('me/addresses')
  async getAddresses(@CurrentUser('userId') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('me/addresses')
  async createAddress(
    @CurrentUser('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.usersService.createAddress(userId, createAddressDto);
  }

  @Put('me/addresses/:addressId')
  async updateAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, addressId, updateAddressDto);
  }

  @Delete('me/addresses/:addressId')
  async deleteAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.deleteAddress(userId, addressId);
  }

  @Patch('me/addresses/:addressId/default')
  async setDefaultAddress(
    @CurrentUser('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.setDefaultAddress(userId, addressId);
  }
}

