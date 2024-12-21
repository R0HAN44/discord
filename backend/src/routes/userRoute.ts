import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "rohan";

export const userRouter = Router();

// Get current user route
userRouter.get('/', async (req: Request, res: Response):Promise<any> => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };

    // Get user from database
    const user = await db.profile.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});