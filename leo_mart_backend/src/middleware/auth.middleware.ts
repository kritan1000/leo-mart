import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret not configured');
    }

    const decoded = verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
