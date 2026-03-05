import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const userId = req.user?.['userId'];
          if (!userId) {
            return callback(new Error('User not authenticated'), '');
          }
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          const filename = `${userId}-${timestamp}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadAvatar(
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(userId, avatarUrl);
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

