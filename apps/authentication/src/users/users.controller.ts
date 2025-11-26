import { Controller, UnauthorizedException, HttpException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param data User registration data
   * @returns User object without password
   */
  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: RegisterPayload) {
    try {
      return await this.usersService.register(data);
    } catch (error) {
      // Convert HttpException to RpcException for microservice communication
      if (error instanceof HttpException) {
        const status = error.getStatus();
        const response = error.getResponse();
        const message = typeof response === 'string' ? response : (response as any)?.message || error.message;
        throw new RpcException({
          status,
          message,
        });
      }
      throw error;
    }
  }

  /**
   * Get all active users
   * @returns Array of users without passwords
   */
  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user and generate JWT token
   * @param data Login credentials
   * @returns Access token and user data
   * @throws UnauthorizedException if credentials are invalid
   */
  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: LoginPayload) {
    try {
      // Find user by email (includes password)
      const user = await this.usersService.findByEmail(data.email);
      
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is inactive');
      }

      // Verify password
      const isPasswordValid = await this.usersService.verifyPassword(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const payload = {
        sub: (user._id as any).toString(),
        email: user.email,
        name: user.name,
      };

      const access_token = this.jwtService.sign(payload);

      // Return token and user data (without password)
      const { password, ...userWithoutPassword } = user.toObject();
      
      return {
        access_token,
        user: userWithoutPassword,
      };
    } catch (error) {
      // Convert HttpException to RpcException for microservice communication
      if (error instanceof HttpException) {
        const status = error.getStatus();
        const response = error.getResponse();
        const message = typeof response === 'string' ? response : (response as any)?.message || error.message;
        throw new RpcException({
          status,
          message,
        });
      }
      throw error;
    }
  }
}

