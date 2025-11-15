import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  /**
   * Register a new user
   */
  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with email, name, and password',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        email: 'john@example.com',
        name: 'John Doe',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this email already exists',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error',
  })
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, dto),
      );
      return result;
    } catch (error: any) {
      // Handle microservice errors - extract proper error message
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Handle RpcException from microservices
      if (error?.status && error?.message) {
        throw new HttpException(
          error.message,
          error.status,
        );
      }
      
      // Handle error objects with response property
      if (error?.response) {
        const message = error.response.message || error.response.error || error.message;
        const status = error.response.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          message,
          status,
        );
      }
      
      // Fallback for other error types
      throw new HttpException(
        error?.message || 'Registration failed. Please try again.',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Login user
   */
  @Post('login')
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticates user and returns JWT access token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          _id: '507f1f77bcf86cd799439011',
          email: 'john@example.com',
          name: 'John Doe',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
  })
  async login(@Body() dto: LoginDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, dto),
      );
      return result;
    } catch (error: any) {
      // Handle microservice errors - extract proper error message
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Handle RpcException from microservices
      if (error?.status && error?.message) {
        throw new HttpException(
          error.message,
          error.status,
        );
      }
      
      // Handle error objects with response property
      if (error?.response) {
        const message = error.response.message || error.response.error || error.message;
        const status = error.response.statusCode || error.status || HttpStatus.UNAUTHORIZED;
        throw new HttpException(
          message,
          status,
        );
      }
      
      // Fallback for other error types
      throw new HttpException(
        error?.message || 'Invalid email or password',
        error?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Get all users
   */
  @Get('users')
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Returns a list of all active users',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          email: 'john@example.com',
          name: 'John Doe',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  async getUsers() {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'get_users' }, {}),
      );
      return result;
    } catch (error) {
      // Handle microservice errors
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch users',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

