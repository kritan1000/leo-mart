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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    const decoded = verify(token, secret);
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
};
