import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getHealth() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    // Check database
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.services.database = 'healthy';
    } catch (error) {
      checks.services.database = 'unhealthy';
      checks.status = 'degraded';
    }

    // Check Redis
    try {
      await this.redisService.set('health:check', 'ok', 10);
      const result = await this.redisService.get('health:check');
      checks.services.redis = result === 'ok' ? 'healthy' : 'unhealthy';
    } catch (error) {
      checks.services.redis = 'unhealthy';
      checks.status = 'degraded';
    }

    return checks;
  }
}
