import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  const mockUserModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    select: jest.fn(),
    sort: jest.fn(),
    exec: jest.fn(),
  };

  // Mock constructor for userModel
  const MockUserModel = jest.fn().mockImplementation((data) => {
    const userData = {
      _id: '507f1f77bcf86cd799439011',
      email: data.email,
      name: data.name,
      password: data.password,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const userInstance = {
      ...data,
      toObject: jest.fn().mockReturnValue({
        ...userData,
        password: data.password,
      }),
      save: jest.fn().mockResolvedValue({
        ...userData,
        password: data.password,
        toObject: jest.fn().mockReturnValue({
          ...userData,
          password: data.password,
        }),
      }),
    };
    return userInstance;
  });

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel as any,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      MockUserModel.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(registerData);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', registerData.email);
      expect(result).toHaveProperty('name', registerData.name);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(MockUserModel).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      MockUserModel.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      await expect(service.register(registerData)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerData)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should return array of active users without passwords', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockUser.toObject()]),
      };

      MockUserModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(MockUserModel.find).toHaveBeenCalledWith({ isActive: true });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when found', async () => {
      MockUserModel.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(MockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return null when user not found', async () => {
      MockUserModel.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user without password when found', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      };

      MockUserModel.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser.toObject());
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      };

      MockUserModel.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('invalid-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('verifyPassword', () => {
    it('should return true for matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword('password123', 'hashedPassword');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should return false for non-matching passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword('wrongpassword', 'hashedPassword');

      expect(result).toBe(false);
    });
  });
});

