import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitNum } = calculatePagination(Number(page), Number(limit));

    const [services, total] = await Promise.all([
      Service.find().skip(skip).limit(limitNum).sort({ order: 1, createdAt: -1 }),
      Service.countDocuments()
    ]);

    res.status(200).json(paginatedResponse(services, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.status(200).json(successResponse(service, 'Service retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(successResponse(service, 'Service created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.status(200).json(successResponse(service, 'Service updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.status(200).json(successResponse(null, 'Service deleted successfully'));
  } catch (error) {
    next(error);
  }
};

