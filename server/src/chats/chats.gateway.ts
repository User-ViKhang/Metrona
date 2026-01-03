import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatsService } from './chats.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Configure properly in production
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string[]>(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private chatsService: ChatsService,
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      client.userId = payload.sub;
      client.email = payload.email;

      // Add to online users
      const userSockets = this.onlineUsers.get(payload.sub) || [];
      userSockets.push(client.id);
      this.onlineUsers.set(payload.sub, userSockets);

      // Store in Redis for scaling
      await this.redisService.sadd(`user:${payload.sub}:sockets`, client.id);

      // Join user's personal room
      client.join(`user:${payload.sub}`);

      console.log(`Client connected: ${client.id}, User: ${payload.sub}`);
    } catch (error) {
      console.error('WebSocket auth error:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove from online users
      const userSockets = this.onlineUsers.get(client.userId) || [];
      const index = userSockets.indexOf(client.id);
      if (index > -1) {
        userSockets.splice(index, 1);
      }

      if (userSockets.length === 0) {
        this.onlineUsers.delete(client.userId);
      } else {
        this.onlineUsers.set(client.userId, userSockets);
      }

      // Remove from Redis
      await this.redisService.srem(`user:${client.userId}:sockets`, client.id);

      console.log(`Client disconnected: ${client.id}, User: ${client.userId}`);
    }
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.auth?.token || 
                       client.handshake.headers?.authorization;
    
    if (!authHeader) return null;

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return authHeader;
  }

  @SubscribeMessage('chat:join')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    if (!client.userId) return { error: 'Unauthorized' };

    // Verify user is participant
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        chatRoomId: data.chatRoomId,
        userId: client.userId,
      },
    });

    if (!participant) {
      return { error: 'Not a participant of this chat' };
    }

    client.join(`chat:${data.chatRoomId}`);
    return { success: true, message: `Joined room ${data.chatRoomId}` };
  }

  @SubscribeMessage('chat:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    client.leave(`chat:${data.chatRoomId}`);
    return { success: true, message: `Left room ${data.chatRoomId}` };
  }

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string; content: string; type?: string },
  ) {
    if (!client.userId) return { error: 'Unauthorized' };

    try {
      const message = await this.chatsService.sendMessage(
        client.userId,
        data.chatRoomId,
        {
          content: data.content,
          type: (data.type as any) || 'TEXT',
        },
      );

      // Emit to all participants in the room
      this.server.to(`chat:${data.chatRoomId}`).emit('chat:receive', message);

      // Also emit to user rooms for notifications
      const participants = await this.prisma.chatParticipant.findMany({
        where: { chatRoomId: data.chatRoomId },
      });

      for (const participant of participants) {
        if (participant.userId !== client.userId) {
          this.server.to(`user:${participant.userId}`).emit('chat:notification', {
            chatRoomId: data.chatRoomId,
            message,
          });
        }
      }

      return { success: true, message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('chat:typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string; isTyping: boolean },
  ) {
    if (!client.userId) return;

    const user = await this.prisma.user.findUnique({
      where: { id: client.userId },
      select: { id: true, name: true },
    });

    // Broadcast typing status to room (except sender)
    client.to(`chat:${data.chatRoomId}`).emit('chat:typing', {
      chatRoomId: data.chatRoomId,
      user,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('chat:read')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatRoomId: string },
  ) {
    if (!client.userId) return { error: 'Unauthorized' };

    try {
      await this.chatsService.markAsRead(client.userId, data.chatRoomId);

      // Notify other participants
      client.to(`chat:${data.chatRoomId}`).emit('chat:read', {
        chatRoomId: data.chatRoomId,
        userId: client.userId,
      });

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Helper method to check if user is online
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId) && this.onlineUsers.get(userId)!.length > 0;
  }

  // Helper method to get online users in a chat room
  async getOnlineUsersInRoom(chatRoomId: string): Promise<string[]> {
    const participants = await this.prisma.chatParticipant.findMany({
      where: { chatRoomId },
      select: { userId: true },
    });

    return participants
      .filter((p) => this.isUserOnline(p.userId))
      .map((p) => p.userId);
  }
}

