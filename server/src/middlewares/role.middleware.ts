import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { errorResponse } from '../utils/response.util';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(errorResponse('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json(
        errorResponse(
          'Insufficient permissions',
          `This action requires one of the following roles: ${allowedRoles.join(', ')}`
        )
      );
      return;
    }

    next();
  };
};

export const checkPermissions = (
  req: AuthRequest,
  res: Response,
  resourceOwnerId: string
): boolean => {
  if (!req.user) {
    res.status(401).json(errorResponse('Authentication required'));
    return false;
  }

  // Admins can access everything
  if (req.user.role === UserRole.ADMIN) {
    return true;
  }

  // Campaign managers can access their own resources
  if (
    req.user.role === UserRole.CAMPAIGN_MANAGER &&
    req.user.id === resourceOwnerId
  ) {
    return true;
  }

  res.status(403).json(errorResponse('Access denied'));
  return false;
};

