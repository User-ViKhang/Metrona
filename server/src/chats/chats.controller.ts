import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dto';
import { CurrentUser } from '../common/decorators';
import { PaginationDto } from '../common/dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async getChatRooms(@CurrentUser('userId') userId: string) {
    return this.chatsService.getChatRooms(userId);
  }

  @Post('shop/:shopId')
  async getOrCreateChatRoom(
    @CurrentUser('userId') userId: string,
    @Param('shopId') shopId: string,
  ) {
    return this.chatsService.getOrCreateChatRoom(userId, shopId);
  }

  @Get(':chatRoomId/messages')
  async getMessages(
    @CurrentUser('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.chatsService.getMessages(
      userId,
      chatRoomId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Post(':chatRoomId/messages')
  async sendMessage(
    @CurrentUser('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatsService.sendMessage(userId, chatRoomId, createMessageDto);
  }

  @Patch(':chatRoomId/read')
  async markAsRead(
    @CurrentUser('userId') userId: string,
    @Param('chatRoomId') chatRoomId: string,
  ) {
    return this.chatsService.markAsRead(userId, chatRoomId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('userId') userId: string) {
    const count = await this.chatsService.getUnreadCount(userId);
    return { count };
  }
}

