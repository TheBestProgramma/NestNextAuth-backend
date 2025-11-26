import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * TCP Microservice client configuration
 * For connecting to authentication service
 */
export const getAuthServiceConfig = (): ClientsModuleAsyncOptions => [
  {
    name: 'AUTH_SERVICE',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('AUTH_SERVICE_HOST') || 'localhost',
        port: parseInt(configService.get<string>('AUTH_SERVICE_PORT') || '3001', 10),
      },
    }),
    inject: [ConfigService],
  },
];

/**
 * TCP Microservice server configuration
 * For authentication service to listen
 */
export const getMicroserviceServerConfig = () => ({
  transport: Transport.TCP,
  options: {
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  },
});

