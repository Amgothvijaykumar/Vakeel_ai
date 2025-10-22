import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔐 Auth middleware - Checking token...');
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Token extracted (first 20 chars):', token.substring(0, 20) + '...');

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      console.log('✅ Token verified, userId:', decoded.userId);
      (req as any).user = { userId: decoded.userId };
      next();
    });
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
