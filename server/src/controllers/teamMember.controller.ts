import { Response, NextFunction } from 'express';
import { TeamMember } from '../models/TeamMember.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getTeamMembers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitNum } = calculatePagination(Number(page), Number(limit));

    const [members, total] = await Promise.all([
      TeamMember.find().skip(skip).limit(limitNum).sort({ order: 1, createdAt: -1 }),
      TeamMember.countDocuments()
    ]);

    res.status(200).json(paginatedResponse(members, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getTeamMemberById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);

    if (!member) {
      throw new AppError('Team member not found', 404);
    }

    res.status(200).json(successResponse(member, 'Team member retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(successResponse(member, 'Team member created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      throw new AppError('Team member not found', 404);
    }

    res.status(200).json(successResponse(member, 'Team member updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndDelete(id);

    if (!member) {
      throw new AppError('Team member not found', 404);
    }

    res.status(200).json(successResponse(null, 'Team member deleted successfully'));
  } catch (error) {
    next(error);
  }
};

