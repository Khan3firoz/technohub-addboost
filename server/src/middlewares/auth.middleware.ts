import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(errorResponse('No token provided', 'Authentication required'));
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (error) {
      res.status(401).json(errorResponse('Invalid or expired token', 'Authentication failed'));
      return;
    }
  } catch (error) {
    res.status(500).json(errorResponse('Server error during authentication'));
    return;
  }
};

