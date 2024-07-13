import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import ApiError from '../utils/apiError';

config({ path: '.env' });

export interface IUser {
  username: string;
  password: string;
  age?: number;
  email: string;
  fullName: string;
  refreshToken?: string;
}

export interface IUserMethods {
  isPasswordMatched(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide a full name']
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isPasswordMatched = async function (password: string): Promise<boolean> {
  if (this.password) {
    return await bcrypt.compare(password, this.password);
  }
  return false;
};

userSchema.methods.generateAccessToken = async function (): Promise<string> {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new ApiError('ACCESS_TOKEN_SECRET is not defined in the environment', 500);
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
    }
  );
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new ApiError('REFRESH_TOKEN_SECRET is not defined in the environment', 500);
  }
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d'
    }
  );
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);