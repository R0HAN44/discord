import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "rohan";

export const authRouter = Router();

// Login route
authRouter.post('/login', async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user in the database using Prisma
    const user = await db.profile.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Signup route
authRouter.post('/signup', async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      return res.status(200).json({
        success: false,
        message: 'Email, name and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.profile.findFirst({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using Prisma
    const newUser = await db.profile.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        imageUrl: newUser.imageUrl
      },
      message: 'Signup successful'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
