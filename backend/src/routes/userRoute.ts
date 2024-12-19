import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "78yh89";

export const userRouter = Router();


const users: { email: string; username: string; password: string }[] = [];


userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user in the database
    const user = users.find((user) => user.email === email);
    if (!user) {
      res.status(400).json({success:false, message: 'Invalid email or password' });
      return;
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({success:false, message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    res.json({success:true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Internal server error' });
  }
});

// Signup route
userRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(400).json({success:false, message: 'Email already registered' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    users.push({ email, username, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ email, username}, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    res.json({success:true, message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Internal server error' });
  }
});