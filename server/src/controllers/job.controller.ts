import { Response, NextFunction } from 'express';
import { Job } from '../models/Job.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, department, status } = req.query;
    const filter: any = {};

    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    } else {
      // By default, only show open jobs to non-admins
      if (req.user?.role !== 'admin') {
        filter.status = 'open';
      }
    }

    const { skip, limit: limitNum } = calculatePagination(Number(page), Number(limit));

    const [jobs, total] = await Promise.all([
      Job.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Job.countDocuments(filter)
    ]);

    res.status(200).json(paginatedResponse(jobs, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    // Non-admins can only see open jobs
    if (req.user?.role !== 'admin' && job.status !== 'open') {
      throw new AppError('Job not found', 404);
    }

    res.status(200).json(successResponse(job, 'Job retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(successResponse(job, 'Job created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.status(200).json(successResponse(job, 'Job updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.status(200).json(successResponse(null, 'Job deleted successfully'));
  } catch (error) {
    next(error);
  }
};

