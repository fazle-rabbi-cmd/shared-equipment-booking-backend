import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'EMPLOYEE' | 'ADMIN';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return next(new AppError('Access token missing or invalid', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return next(new AppError('Token is expired or invalid', 403));
    }
    req.user = user as AuthRequest['user'];
    next();
  });
};

export const requireRole = (role: 'EMPLOYEE' | 'ADMIN') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError('Forbidden: You do not have permission to access this resource', 403));
    }
    next();
  };
};