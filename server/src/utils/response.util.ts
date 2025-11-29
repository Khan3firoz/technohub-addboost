import { ApiResponse, PaginationResult } from '../types';

export const successResponse = <T>(
  data?: T,
  message?: string
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (error: string, message?: string): ApiResponse => {
  return {
    success: false,
    message,
    error
  };
};

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): ApiResponse<PaginationResult<T>> => {
  return {
    success: true,
    data: {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  };
};

