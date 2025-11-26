import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from '@/core/logger';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Centralized logging
    LoggerModule,
    // Rate limiting configuration
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window in milliseconds (1 minute)
        limit: 10, // Maximum number of requests per time window
      },
    ]),
    // Health check module
    HealthModule,
    // Auth module
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    // Apply throttler guard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GatewayModule {}
