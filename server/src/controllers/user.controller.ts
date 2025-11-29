import { Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest, UserRole } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;

    const filter: any = {};

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const { skip, limit: limitNum } = calculatePagination(
      Number(page),
      Number(limit)
    );

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    res.status(200).json(paginatedResponse(users, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(user, 'User retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, firstName, lastName, status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { username, firstName, lastName, status },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json(successResponse(user, 'User role updated successfully'));
  } catch (error) {
    next(error);
  }
};

