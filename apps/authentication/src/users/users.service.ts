import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Register a new user
   * @param data User registration data
   * @returns User object without password
   * @throws ConflictException if email already exists
   */
  async register(data: { email: string; name: string; password: string }): Promise<any> {
    // Check if user already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create and save user
    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    await user.save();

    // Return user without password
    const { password, ...result } = user.toObject();
    return result;
  }

  /**
   * Find all active users
   * @returns Array of users without passwords
   */
  async findAll(): Promise<any[]> {
    return this.userModel
      .find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User document (includes password for authentication)
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select('+password') // Explicitly include password for authentication
      .exec();
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns User document without password
   * @throws NotFoundException if user not found
   */
  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }

  /**
   * Verify password
   * @param plainPassword Plain text password
   * @param hashedPassword Hashed password from database
   * @returns True if password matches
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

