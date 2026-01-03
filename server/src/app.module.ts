import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ChatsModule } from './chats/chats.module';

// Common
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

// App
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // i18n
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: 'vi',
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.get('NODE_ENV') === 'development',
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] },
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),

    // Core Modules
    PrismaModule,
    RedisModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
