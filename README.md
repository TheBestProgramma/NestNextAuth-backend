# NestNextAuth Backend

A production-ready NestJS monorepo authentication system built with microservices architecture, featuring TCP-based inter-service communication, MongoDB integration, and comprehensive API documentation.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)
- [Key Highlights](#key-highlights)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

This project demonstrates a scalable authentication backend system using NestJS microservices architecture. The system is split into two main services:

- **Gateway Service**: HTTP API gateway that handles client requests
- **Authentication Service**: Microservice that handles user management and authentication logic

Services communicate internally via TCP protocol, ensuring efficient and secure inter-service communication.

## 🏗️ Architecture

### Microservices Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────┐         TCP          ┌──────────────────────┐
│  Gateway App    │◄────────────────────►│  Authentication App  │
│  (Port 3000)    │                      │     (Port 3001)      │
│                 │                      │                      │
│  - HTTP Routes  │                      │  - User Management   │
│  - DTOs         │                      │  - JWT Generation    │
│  - Swagger      │                      │  - Password Hashing  │
└─────────────────┘                      └──────────┬───────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   MongoDB    │
                                            │  (Port 27017)│
                                            └──────────────┘
```

### Key Architectural Decisions

1. **Separation of Concerns**: HTTP logic in gateway, business logic in authentication service
2. **TCP Communication**: Fast, reliable inter-service communication
3. **Monorepo Structure**: Shared code in `common/`, `core/`, and `config/` folders
4. **MVC Pattern**: Clear separation between controllers, services, and data models

## ✨ Features

### Core Features
- ✅ User registration with email validation
- ✅ User login with JWT token generation
- ✅ Password hashing using bcrypt
- ✅ Get all users endpoint
- ✅ Input validation using DTOs and class-validator
- ✅ Swagger API documentation
- ✅ MongoDB database integration
- ✅ TCP microservices communication

### Bonus Features
- ✅ JWT-based authentication
- ✅ Docker containerization
- ✅ Environment-based configuration
- ✅ Global exception handling
- ✅ CORS enabled
- ✅ TypeScript for type safety

## 🛠️ Tech Stack

### Core Technologies
- **NestJS 11**: Progressive Node.js framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

### Key Libraries
- `@nestjs/microservices`: TCP microservices communication
- `@nestjs/swagger`: API documentation
- `class-validator`: Input validation
- `class-transformer`: Object transformation

## 📁 Project Structure

```
NestNextAuth-backend/
├── apps/
│   ├── gateway/              # API Gateway Service
│   │   ├── src/
│   │   │   ├── auth/         # Authentication routes
│   │   │   │   ├── dto/     # Data Transfer Objects
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.module.ts
│   │   │   └── main.ts       # Gateway entry point
│   │   └── Dockerfile
│   │
│   └── authentication/      # Authentication Microservice
│       ├── src/
│       │   ├── users/       # User management
│       │   │   ├── schemas/ # Mongoose schemas
│       │   │   ├── users.controller.ts  # TCP message handlers
│       │   │   ├── users.service.ts     # Business logic
│       │   │   └── users.module.ts
│       │   ├── authentication.module.ts
│       │   └── main.ts      # Microservice entry point
│       └── Dockerfile
│
├── common/                   # Shared utilities
│   ├── config/              # Reusable configurations
│   └── dto/                 # Shared DTOs
│
├── core/                    # Core functionality
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── interfaces/          # TypeScript interfaces
│   └── utils/               # Utility functions
│
├── config/                  # Application configuration
│   ├── app.config.ts
│   └── environment.config.ts
│
├── docker-compose.yml       # Docker orchestration
├── package.json
└── tsconfig.json
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ LTS
- **pnpm** (recommended) or npm
- **MongoDB** 7+ (or Docker for containerized MongoDB)
- **Docker** (optional, for containerized setup)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheBestProgramma/NestNextAuth-backend.git
   cd NestNextAuth-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env  # If .env.example exists
   # Or create .env file manually
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/users_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Microservices
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001

# Gateway
PORT=3000
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

## 🏃 Running the Application

### Option 1: Local Development (Recommended for Development)

1. **Start MongoDB**
   ```bash
   # Using Docker
   docker compose up -d mongodb
   
   # Or start MongoDB service locally
   ```

2. **Start Authentication Microservice**
   ```bash
   pnpm run start:dev authentication
   # Service will run on port 3001
   ```

3. **Start Gateway** (in a new terminal)
   ```bash
   pnpm run start:dev gateway
   # Gateway will run on port 3000
   ```

### Option 2: Docker Compose (Recommended for Production)

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Verify Services are Running

- **Gateway**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Authentication Service**: Running on port 3001 (TCP, not HTTP)

## 📚 API Documentation

Once the gateway is running, visit **http://localhost:3000/api** for interactive Swagger documentation.

### Available Endpoints

#### 1. Register User
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
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Login User
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true
  }
}
```

#### 3. Get All Users
```http
GET /auth/users
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🐳 Docker Setup

### Docker Compose Services

The `docker-compose.yml` file defines three services:

1. **mongodb**: MongoDB database
2. **authentication**: Authentication microservice
3. **gateway**: API gateway

### Building Docker Images

```bash
# Build all services
docker compose build

# Build specific service
docker compose build authentication
docker compose build gateway
```

### Environment Variables in Docker

Environment variables are set in `docker-compose.yml`. For production, use a `.env` file or Docker secrets.

## 🎯 Key Highlights

### For Interviewers

This project demonstrates:

1. **Microservices Architecture**
   - Clear separation between gateway and authentication service
   - TCP-based inter-service communication
   - Scalable and maintainable codebase

2. **Best Practices**
   - DTOs for request validation
   - TypeScript for type safety
   - Modular monorepo structure
   - Environment-based configuration

3. **Production-Ready Features**
   - Password hashing with bcrypt
   - JWT token generation
   - Global exception handling
   - Swagger API documentation
   - Docker containerization

4. **Code Quality**
   - Clean architecture (MVC pattern)
   - Separation of concerns
   - Reusable shared modules
   - Comprehensive error handling

### Technical Decisions Explained

- **Why TCP over HTTP for microservices?**
  - Faster communication for internal services
  - Lower overhead compared to HTTP
  - Better suited for high-frequency inter-service calls

- **Why Monorepo?**
  - Shared code in `common/`, `core/`, and `config/`
  - Easier dependency management
  - Consistent codebase across services

- **Why MongoDB?**
  - Flexible schema for user data
  - Easy to scale horizontally
  - Good performance for read-heavy operations

## 🧪 Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

## 🔮 Future Enhancements

Potential improvements for production:

- [ ] Rate limiting implementation
- [ ] Centralized logging system
- [ ] Health check endpoints
- [ ] Unit and E2E test coverage
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Role-based access control (RBAC)
- [ ] Refresh token mechanism
- [ ] API versioning
- [ ] Request/response logging middleware

## 📝 Scripts

```bash
# Development
pnpm run start:dev gateway        # Start gateway in watch mode
pnpm run start:dev authentication # Start auth service in watch mode

# Building
pnpm run build                    # Build all apps
pnpm run build gateway            # Build gateway only
pnpm run build authentication    # Build auth service only

# Code Quality
pnpm run lint                     # Lint code
pnpm run format                   # Format code with Prettier

# Testing
pnpm run test                     # Run unit tests
pnpm run test:cov                 # Run tests with coverage
```

## 🤝 Contributing

This is a demonstration project. For questions or suggestions, please open an issue.

## 📄 License

This project is private and proprietary.

## 👤 Author

**Solomon Kiptoo**
- GitHub: [@TheBestProgramma](https://github.com/TheBestProgramma)

---

## 🎓 Learning Resources

If you're new to NestJS microservices:

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [MongoDB with Mongoose](https://docs.nestjs.com/techniques/mongodb)

---

**Built with ❤️ using NestJS**



