import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const secretKey = req.headers['x-secret-key'] as string;
    
    if (!secretKey) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    // Find user by secret key
    const user = await User.findOne({ secretKey });
    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Error authenticating request' });
  }
}; 