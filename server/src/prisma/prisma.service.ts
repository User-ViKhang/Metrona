import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      // Clean in order of dependencies
      const models = Object.keys(this).filter((key) => {
        return (
          !key.startsWith('_') &&
          !key.startsWith('$') &&
          typeof (this as any)[key] === 'object' &&
          (this as any)[key]?.deleteMany
        );
      });

      return Promise.all(
        models.map((modelKey) => (this as any)[modelKey].deleteMany()),
      );
    }
  }
}

