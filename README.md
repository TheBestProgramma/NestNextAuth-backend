# NestNextAuth Backend

A modern, scalable authentication and user management system built with NestJS microservices architecture. This backend provides a robust API gateway with TCP-based microservice communication, JWT authentication, and comprehensive security features.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

NestNextAuth Backend is a microservices-based authentication system that demonstrates best practices in building scalable, secure, and maintainable backend applications. It features:

- **API Gateway Pattern**: Single entry point for all client requests
- **Microservices Architecture**: Decoupled services for independent scaling
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Flexible document-based data storage
- **Comprehensive Security**: Rate limiting, input validation, password hashing
- **Developer Experience**: Swagger documentation, structured logging, health checks

## 🏗️ Architecture

### Microservices Architecture

The backend follows a microservices pattern with clear separation of concerns:

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Gateway Service│  ← API Gateway (Port 4000)
│   (NestJS)      │  - Handles HTTP requests
│                 │  - Routes to microservices
│                 │  - Rate limiting
│                 │  - CORS management
│                 │  - Swagger documentation
└────────┬────────┘
         │ TCP
         │
┌────────▼────────┐
│ Authentication  │  ← Authentication Microservice (Port 4001)
│   Microservice  │  - User registration
│   (NestJS)      │  - User authentication
│                 │  - JWT token generation
│                 │  - Password hashing
└────────┬────────┘
         │
┌────────▼────────┐
│    MongoDB      │  ← Database (Port 27017)
│   (users_db)    │  - User data storage
└─────────────────┘
```

### Key Architectural Decisions

1. **API Gateway Pattern**: The Gateway service acts as the single entry point, providing unified API interface, request routing, and cross-cutting concerns.

2. **Microservice Communication**: Services communicate via TCP using NestJS microservices transport layer, enabling decoupled services and independent scaling.

3. **Shared Code**: Common utilities, DTOs, and configurations are shared between services through a `common/` directory structure.

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Database**: MongoDB 7 (via Mongoose)
- **Authentication**: JWT with Passport.js
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler
- **Microservices**: TCP-based inter-service communication
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## ✨ Features

### Authentication & User Management

- **User Registration**: Email, name, and password registration with validation
- **User Authentication**: JWT-based login system with secure password verification
- **User Listing**: Retrieve all registered users with proper data filtering

### Security Features

- **Rate Limiting**: Global rate limiting (10 requests per minute) to prevent abuse
- **Password Security**: Bcrypt hashing with secure salt rounds (10 rounds)
- **JWT Tokens**: Stateless authentication with secure token generation (1 day expiration)
- **Input Validation**: DTO-based validation with class-validator
- **CORS Configuration**: Configurable CORS policies for production
- **Password Exclusion**: Passwords never returned in API responses

### Developer Experience

- **API Documentation**: Interactive Swagger UI at `/api` endpoint
- **Health Checks**: Health monitoring endpoint at `/health`
- **Structured Logging**: Centralized logging service with context support
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Type Safety**: Full TypeScript support across the stack

## 📁 Project Structure

```
NestNextAuth-backend/
├── apps/
│   ├── gateway/              # API Gateway service
│   │   ├── src/
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   │   ├── dto/      # Data Transfer Objects
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── health/       # Health check endpoints
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.module.ts
│   │   │   ├── gateway.service.ts
│   │   │   └── main.ts       # Gateway bootstrap
│   │   └── Dockerfile
│   └── authentication/       # Authentication microservice
│       ├── src/
│       │   ├── users/        # User management logic
│       │   │   ├── schemas/  # Mongoose schemas
│       │   │   ├── users.controller.ts
│       │   │   ├── users.module.ts
│       │   │   └── users.service.ts
│       │   ├── authentication.controller.ts
│       │   ├── authentication.module.ts
│       │   ├── authentication.service.ts
│       │   └── main.ts       # Service bootstrap
│       └── Dockerfile
├── common/                   # Shared code
│   ├── config/               # Configuration utilities
│   │   ├── database.config.ts
│   │   └── microservice.config.ts
│   └── dto/                  # Shared DTOs
│       └── base-response.dto.ts
├── core/                     # Core utilities
│   ├── decorators/           # Custom decorators
│   │   └── public.decorator.ts
│   ├── filters/              # Exception filters
│   │   └── http-exception.filter.ts
│   ├── interfaces/           # TypeScript interfaces
│   │   └── api-response.interface.ts
│   ├── logger/               # Logging service
│   │   ├── logger.module.ts
│   │   └── logger.service.ts
│   └── utils/                # Utility functions
│       └── response.util.ts
├── config/                   # Application configuration
│   ├── app.config.ts
│   ├── environment.config.ts
│   └── index.ts
├── docker-compose.yml        # Docker orchestration
├── nest-cli.json             # NestJS CLI configuration
├── package.json
├── tsconfig.json             # TypeScript configuration
└── tsconfig.build.json       # Build configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- MongoDB 7.x (or use Docker Compose)
- Docker & Docker Compose (for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NestNextAuth-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/users_db
   
   # Authentication Microservice
   AUTH_SERVICE_HOST=localhost
   AUTH_SERVICE_PORT=4001
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
   
   # CORS Configuration
   ALLOWED_ORIGINS=*
   ```
   
   **Note**: If using Docker Compose, the gateway will run on port 4000. For local development without Docker, use port 3000 to match the code default.

4. **Start MongoDB** (if not using Docker)
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

5. **Run the application**

   **Option 1: Development mode (recommended)**
   ```bash
   npm run start:dev
   ```
   This starts both gateway and authentication services with hot-reload.

   **Option 2: Using Docker Compose (production-like)**
   ```bash
   docker-compose up
   ```

   **Option 3: Run services individually**
   ```bash
   # Terminal 1: Start authentication microservice
   npm run start:dev authentication
   
   # Terminal 2: Start gateway
   npm run start:dev gateway
   ```

6. **Verify the setup**
   - Gateway API: http://localhost:3000 (or 4000 if using Docker)
   - Swagger Documentation: http://localhost:3000/api (or 4000 if using Docker)
   - Health Check: http://localhost:3000/health (or 4000 if using Docker)

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Gateway HTTP port | `3000` (local), `4000` (Docker) | No |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/users_db` | No |
| `AUTH_SERVICE_HOST` | Authentication service host | `localhost` | No |
| `AUTH_SERVICE_PORT` | Authentication service TCP port | `4001` | No |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key...` | **Yes (production)** |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated or `*`) | `*` | No |

### Port Configuration

- **Gateway**: 4000 (HTTP) - Default in Docker, 3000 in local development
- **Authentication Service**: 4001 (TCP)
- **MongoDB**: 27017

**Note**: The gateway defaults to port 3000 when running locally without Docker, but Docker Compose uses port 4000. The frontend is configured to use port 4000 by default.

### CORS Configuration

CORS is configured based on environment:

- **Development**: Allows all origins by default (`*`)
- **Production**: Must explicitly set `ALLOWED_ORIGINS` environment variable

Example for production:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "isActive": true
    }
  }
}
```

#### Get All Users
```http
GET /auth/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Utility Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### API Documentation
```http
GET /api
```
Interactive Swagger UI for API documentation and testing.

## 💻 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with hot-reload
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build gateway only
npm run build:gateway      # Build gateway
npm run build:auth         # Build authentication service
npm run build:all          # Build all services

# Production
npm run start              # Start gateway (production)
npm run start:gateway      # Start gateway
npm run start:auth         # Start authentication service
npm run start:prod         # Start in production mode

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
```

### Development Workflow

1. **Start MongoDB** (if not using Docker)
   ```bash
   mongod
   ```

2. **Start development server**
   ```bash
   npm run start:dev
   ```

3. **Access Swagger UI**
   - Navigate to http://localhost:3000/api (or 4000 if using Docker)
   - Test endpoints directly from the browser

4. **Monitor logs**
   - All services log to console with structured format
   - Use context tags to filter logs

### Code Style

- **ESLint**: Configured for TypeScript and NestJS best practices
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict mode enabled
- **Naming Conventions**: 
  - Controllers: `*.controller.ts`
  - Services: `*.service.ts`
  - Modules: `*.module.ts`
  - DTOs: `*.dto.ts`
  - Schemas: `*.schema.ts`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Structure

Tests are located alongside source files with `.spec.ts` extension:

```
apps/
├── gateway/
│   └── src/
│       ├── auth/
│       │   └── auth.controller.spec.ts
│       └── gateway.controller.spec.ts
└── authentication/
    └── src/
        └── users/
            └── users.service.spec.ts
```

### Test Coverage

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage reports.

## 🚀 Deployment

### Docker Deployment (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build:all
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb://your-mongodb-host:27017/users_db
   JWT_SECRET=your-production-secret-minimum-32-characters
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

3. **Start services**
   ```bash
   # Start authentication service
   npm run start:auth

   # Start gateway (in another terminal or process manager)
   npm run start:gateway
   ```

### Production Considerations

- **Environment Variables**: Never commit `.env` files. Use environment variable management (AWS Secrets Manager, Azure Key Vault, etc.)
- **JWT Secret**: Use a strong, randomly generated secret (minimum 32 characters)
- **CORS**: Explicitly set `ALLOWED_ORIGINS` in production
- **MongoDB**: Use MongoDB Atlas or a managed MongoDB service for production
- **Process Management**: Use PM2, systemd, or similar for process management
- **Monitoring**: Set up application monitoring (e.g., Datadog, New Relic)
- **Logging**: Configure structured logging to a centralized system
- **Health Checks**: Monitor `/health` endpoint for service availability

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::4000`

**Solution**:
```bash
# Find process using port
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Kill process or change PORT in .env
PORT=4001 npm run start:dev
```

#### MongoDB Connection Failed

**Error**: `MongooseError: connect ECONNREFUSED`

**Solution**:
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check `MONGODB_URI` in `.env`
3. Verify MongoDB is accessible: `mongosh "mongodb://localhost:27017/users_db"`

#### Microservice Communication Failed

**Error**: `ECONNREFUSED` when calling authentication endpoints

**Solution**:
1. Verify authentication service is running
2. Check `AUTH_SERVICE_HOST` and `AUTH_SERVICE_PORT` in `.env`
3. Ensure both services are running:
   ```bash
   # Terminal 1
   npm run start:dev authentication
   
   # Terminal 2
   npm run start:dev gateway
   ```

#### JWT Token Invalid

**Error**: `Unauthorized` or `Invalid token`

**Solution**:
1. Verify `JWT_SECRET` matches between services
2. Check token expiration (default: 1 day)
3. Ensure token is sent in `Authorization: Bearer <token>` header

#### Rate Limiting

**Error**: `Too Many Requests`

**Solution**:
- Rate limit is set to 10 requests per minute globally
- Wait before retrying
- Adjust rate limit in `gateway.module.ts` if needed

### Debug Mode

Enable debug logging:

```bash
npm run start:debug
```

This enables verbose logging and attaches a debugger on port 9229.

### Viewing Logs

All services use structured logging. Logs include:
- Timestamp
- Log level (ERROR, WARN, LOG, DEBUG, VERBOSE)
- Context (service/module name)
- Message

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT.io](https://jwt.io) - JWT token decoder
- [Swagger/OpenAPI](https://swagger.io/specification/)
- [Docker Documentation](https://docs.docker.com)

## 🔗 Related Projects

- **Frontend**: [NestNextAuth Frontend](../NestNextAuth-frontend) - Next.js frontend application
- **Project Walkthrough**: [PROJECT_WALKTHROUGH.md](../PROJECT_WALKTHROUGH.md) - Detailed architecture and code walkthrough

## 📝 License

This project is part of the NestNextAuth full-stack application.

---

**Built with ❤️ using NestJS and TypeScript**

