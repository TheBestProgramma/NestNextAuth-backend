import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * MongoDB connection configuration
 * Can be reused across modules
 */
export const getMongooseConfig = (): MongooseModuleAsyncOptions => ({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/users_db',
    retryWrites: true,
    w: 'majority',
  }),
  inject: [ConfigService],
});

