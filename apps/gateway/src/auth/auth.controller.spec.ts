import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { AuthController } from './auth.controller';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authClient: ClientProxy;

  const mockAuthClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useValue: mockAuthClient,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authClient = module.get<ClientProxy>('AUTH_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const expectedUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthClient.send.mockReturnValue(of(expectedUser));

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedUser);
      expect(mockAuthClient.send).toHaveBeenCalledWith(
        { cmd: 'register' },
        registerDto,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const conflictError = new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );

      mockAuthClient.send.mockReturnValue(throwError(() => conflictError));

      await expect(controller.register(registerDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.register(registerDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });

    it('should handle validation errors', async () => {
      const validationError = new HttpException(
        'Validation failed',
        HttpStatus.BAD_REQUEST,
      );

      mockAuthClient.send.mockReturnValue(throwError(() => validationError));

      await expect(controller.register(registerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully and return access token', async () => {
      const expectedResponse = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          name: 'Test User',
          isActive: true,
        },
      };

      mockAuthClient.send.mockReturnValue(of(expectedResponse));

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(mockAuthClient.send).toHaveBeenCalledWith(
        { cmd: 'login' },
        loginDto,
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const unauthorizedError = new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );

      mockAuthClient.send.mockReturnValue(throwError(() => unauthorizedError));

      await expect(controller.login(loginDto)).rejects.toThrow(HttpException);
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });

  describe('getUsers', () => {
    it('should return array of users', async () => {
      const expectedUsers = [
        {
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          name: 'Test User',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAuthClient.send.mockReturnValue(of(expectedUsers));

      const result = await controller.getUsers();

      expect(result).toEqual(expectedUsers);
      expect(Array.isArray(result)).toBe(true);
      expect(mockAuthClient.send).toHaveBeenCalledWith(
        { cmd: 'get_users' },
        {},
      );
    });

    it('should handle errors when fetching users', async () => {
      const error = new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      mockAuthClient.send.mockReturnValue(throwError(() => error));

      await expect(controller.getUsers()).rejects.toThrow(HttpException);
    });
  });
});

