import { Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { successResponse } from '../utils/response.util';
import { AuthRequest, TokenPayload } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, role, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'viewer',
      firstName,
      lastName
    });

    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json(
      successResponse(
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          },
          accessToken,
          refreshToken
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(200).json(
      successResponse(
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          },
          accessToken,
          refreshToken
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);

    if (!user || user.status !== 'active') {
      throw new AppError('Invalid refresh token', 401);
    }

    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.status(200).json(
      successResponse(
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        },
        'Token refreshed successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(user, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { firstName, lastName, username } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, username },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

