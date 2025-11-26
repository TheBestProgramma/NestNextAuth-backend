import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  collection: 'users',
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  })
  email: string;

  @Prop({ 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't return password by default in queries
  })
  password: string;

  @Prop({ 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  })
  name: string;

  @Prop({ 
    default: true,
    index: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Additional indexes for better query performance
// Note: email index is automatically created by unique: true decorator
UserSchema.index({ isActive: 1, email: 1 }); // Compound index for filtering active users by email

