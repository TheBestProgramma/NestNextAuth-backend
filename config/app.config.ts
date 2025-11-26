/**
 * Application configuration
 * Centralized configuration for the entire monorepo
 */

export const appConfig = {
  // API Configuration
  api: {
    version: '1.0',
    title: 'NestNextAuth API',
    description: 'Authentication API with NestJS microservices',
  },

  // Service Ports
  ports: {
    gateway: parseInt(process.env.PORT || '3000', 10),
    authentication: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  },

  // Microservice Configuration
  microservices: {
    authentication: {
      host: process.env.AUTH_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
      transport: 'TCP' as const,
    },
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/users_db',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '1d',
  },

  // CORS Configuration
  cors: {
    origin: true,
    credentials: true,
  },

  // Swagger Configuration
  swagger: {
    path: 'api',
    title: 'NestNextAuth API',
    description: 'Authentication API with NestJS microservices',
    version: '1.0',
  },
};

