import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateMessageDto } from './dto';
import { createPaginatedResult } from '../common/dto';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  // Get or create a chat room between buyer and shop
  async getOrCreateChatRoom(userId: string, shopId: string) {
    // Verify shop exists
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Check if user is the shop owner (can't chat with own shop)
    if (shop.ownerId === userId) {
      throw new BadRequestException('Cannot chat with your own shop');
    }

    // Find existing chat room
    let chatRoom = await this.prisma.chatRoom.findFirst({
      where: {
        shopId,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            logo: true,
            ownerId: true,
          },
        },
      },
    });

    if (!chatRoom) {
      // Create new chat room
      chatRoom = await this.prisma.chatRoom.create({
        data: {
          shopId,
          participants: {
            create: [
              { userId }, // Buyer
              { userId: shop.ownerId }, // Seller
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          shop: {
            select: {
              id: true,
              name: true,
              logo: true,
              ownerId: true,
            },
          },
        },
      });
    }

    return chatRoom;
  }

  // Get all chat rooms for a user
  async getChatRooms(userId: string) {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            logo: true,
            ownerId: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format response with unread count
    return chatRooms.map((room) => {
      const participant = room.participants.find((p) => p.userId === userId);
      const otherParticipant = room.participants.find((p) => p.userId !== userId);
      const isSeller = room.shop.ownerId === userId;

      return {
        id: room.id,
        shopId: room.shopId,
        shopName: room.shop.name,
        shopLogo: room.shop.logo,
        otherUser: isSeller ? otherParticipant?.user : null,
        lastMessage: room.messages[0]?.content || null,
        lastMessageAt: room.messages[0]?.createdAt || room.createdAt,
        unreadCount: participant?.unreadCount || 0,
        isSeller,
      };
    });
  }

  // Get messages in a chat room
  async getMessages(userId: string, chatRoomId: string, page = 1, limit = 50) {
    // Verify user is participant
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        chatRoomId,
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { chatRoomId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({ where: { chatRoomId } }),
    ]);

    // Mark messages as read
    await this.markAsRead(userId, chatRoomId);

    return createPaginatedResult(messages.reverse(), total, page, limit);
  }

  // Send a message
  async sendMessage(userId: string, chatRoomId: string, createMessageDto: CreateMessageDto) {
    // Verify user is participant
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        chatRoomId,
        userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    const { content, type } = createMessageDto;

    // Create message and update chat room
    const message = await this.prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: {
          chatRoomId,
          senderId: userId,
          content,
          type: type || 'TEXT',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      // Update chat room last message
      await tx.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          lastMessage: content,
          lastMessageAt: new Date(),
        },
      });

      // Increment unread count for other participants
      await tx.chatParticipant.updateMany({
        where: {
          chatRoomId,
          userId: { not: userId },
        },
        data: {
          unreadCount: { increment: 1 },
        },
      });

      return newMessage;
    });

    return message;
  }

  // Mark messages as read
  async markAsRead(userId: string, chatRoomId: string) {
    await this.prisma.$transaction([
      // Reset unread count
      this.prisma.chatParticipant.updateMany({
        where: {
          chatRoomId,
          userId,
        },
        data: {
          unreadCount: 0,
          lastReadAt: new Date(),
        },
      }),
      // Mark all messages as read
      this.prisma.message.updateMany({
        where: {
          chatRoomId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      }),
    ]);

    return { success: true };
  }

  // Get total unread count for user
  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.prisma.chatParticipant.aggregate({
      where: { userId },
      _sum: {
        unreadCount: true,
      },
    });

    return result._sum.unreadCount || 0;
  }
}

