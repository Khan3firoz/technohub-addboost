import { Response, NextFunction } from 'express';
import { Testimonial } from '../models/Testimonial.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const getTestimonials = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, visible } = req.query;
    const filter: any = {};

    // If user is not admin, only show visible testimonials
    if (req.user?.role !== 'admin') {
      filter.visible = true;
    } else if (visible !== undefined) {
      filter.visible = visible === 'true';
    }

    const { skip, limit: limitNum } = calculatePagination(Number(page), Number(limit));

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .skip(skip)
        .limit(limitNum)
        .sort({ order: 1, createdAt: -1 }),
      Testimonial.countDocuments(filter)
    ]);

    res.status(200).json(paginatedResponse(testimonials, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getTestimonialById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    // Non-admins can only see visible testimonials
    if (req.user?.role !== 'admin' && !testimonial.visible) {
      throw new AppError('Testimonial not found', 404);
    }

    res.status(200).json(successResponse(testimonial, 'Testimonial retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(successResponse(testimonial, 'Testimonial created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    res.status(200).json(successResponse(testimonial, 'Testimonial updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const toggleTestimonialVisibility = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    testimonial.visible = !testimonial.visible;
    await testimonial.save();

    res.status(200).json(successResponse(testimonial, 'Testimonial visibility toggled successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    res.status(200).json(successResponse(null, 'Testimonial deleted successfully'));
  } catch (error) {
    next(error);
  }
};

