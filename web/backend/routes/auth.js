// backend/routes/auth.js - THE FINAL, ABSOLUTE, CORRECTED VERSION
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/protect.js';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'authToken';

// backend/routes/auth.js

const setTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    // THIS IS THE FIX: Makes cookie available to all subdomains of intelvis.ai
    domain: '.intelvis.ai', 
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// backend/routes/auth.js

router.post('/logout', (req, res) => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
    domain: '.intelvis.ai', // THIS IS ALSO THE FIX
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setTokenCookie(res, token);
  res.status(200).json({ id: user.id, email: user.email });
});

router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

router.post('/logout', (req, res) => {
  // The logout cookie must have the exact same domain and path to be cleared correctly.
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
    domain: '.intelvis.ai', // THIS IS THE FIX
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;