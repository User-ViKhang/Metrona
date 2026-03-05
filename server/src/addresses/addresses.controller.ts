import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { CurrentUser } from '../common/decorators';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(@CurrentUser('userId') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get('default')
  async getDefault(@CurrentUser('userId') userId: string) {
    return this.addressesService.getDefault(userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.addressesService.findOne(userId, id);
  }

  @Post()
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(userId, createAddressDto);
  }

  @Put(':id')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, id, updateAddressDto);
  }

  @Patch(':id/default')
  async setDefault(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.addressesService.setDefault(userId, id);
  }

  @Delete(':id')
  async remove(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.addressesService.remove(userId, id);
  }
}
