import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from '@/core/logger';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  // Get logger instance
  const logger = app.get(LoggerService);

  // Enable CORS
  let allowedOrigins: string[] | boolean = true; // Default: allow all in development
  
  if (process.env.ALLOWED_ORIGINS) {
    if (process.env.ALLOWED_ORIGINS === '*') {
      allowedOrigins = true; // Allow all origins
    } else {
      allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    }
  } else if (process.env.NODE_ENV === 'production') {
    allowedOrigins = []; // Must be explicitly set in production
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestNextAuth API')
    .setDescription('Authentication API with NestJS microservices')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization token in browser
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Gateway is running on: http://localhost:${port}`, 'Bootstrap');
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api`, 'Bootstrap');
  logger.log(`🏥 Health checks: http://localhost:${port}/health`, 'Bootstrap');
}
bootstrap();
