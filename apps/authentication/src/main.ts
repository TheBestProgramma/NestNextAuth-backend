import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const logger = new Logger('Authentication Microservice');

  // Create TCP microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
      },
    },
  );

  // Start listening
  await app.listen();
  
  logger.log(
    `≡ƒÜÇ Authentication microservice is listening on ${process.env.AUTH_SERVICE_HOST || 'localhost'}:${process.env.AUTH_SERVICE_PORT || '3001'}`,
  );
}
bootstrap();
