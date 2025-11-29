import { Response, NextFunction } from 'express';
import { PortfolioItem } from '../models/PortfolioItem.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getPortfolioItems = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    const { skip, limit: limitNum } = calculatePagination(Number(page), Number(limit));

    const [items, total] = await Promise.all([
      PortfolioItem.find(filter)
        .skip(skip)
        .limit(limitNum)
        .sort({ order: 1, createdAt: -1 }),
      PortfolioItem.countDocuments(filter)
    ]);

    res.status(200).json(paginatedResponse(items, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getPortfolioItemById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await PortfolioItem.findById(id);

    if (!item) {
      throw new AppError('Portfolio item not found', 404);
    }

    res.status(200).json(successResponse(item, 'Portfolio item retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createPortfolioItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await PortfolioItem.create(req.body);
    res.status(201).json(successResponse(item, 'Portfolio item created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await PortfolioItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      throw new AppError('Portfolio item not found', 404);
    }

    res.status(200).json(successResponse(item, 'Portfolio item updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await PortfolioItem.findByIdAndDelete(id);

    if (!item) {
      throw new AppError('Portfolio item not found', 404);
    }

    res.status(200).json(successResponse(null, 'Portfolio item deleted successfully'));
  } catch (error) {
    next(error);
  }
};

