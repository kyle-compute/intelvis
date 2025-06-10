// backend/routes/auth.js

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/protect.js'; // We will create this next

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'authToken';

// --- Helper to set the JWT cookie ---
const setTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Mitigates CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// --- ROUTES ---

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
  });
});

// @desc    Login a user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setTokenCookie(res, token);

  res.status(200).json({
    id: user.id,
    email: user.email,
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', protect, (req, res) => {
  // The 'protect' middleware adds the user to the request object
  res.status(200).json(req.user);
});

// @desc    Log user out
// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  // Clear the cookie by setting it to nothing and expiring it
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;