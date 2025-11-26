import { Module } from '@nestjs/common';
import { LoggerModule } from '@/core/logger';
import { HealthController } from './health.controller';

@Module({
  imports: [LoggerModule],
  controllers: [HealthController],
})
export class HealthModule {}

