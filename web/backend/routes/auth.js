// backend/routes/auth.js
import { Router }        from 'express';
import bcrypt            from 'bcryptjs';
import jwt               from 'jsonwebtoken';
import { PrismaClient }  from '@prisma/client';
import { protect }       from '../middleware/protect.js';

const prisma      = new PrismaClient();
const router      = Router();
const JWT_SECRET  = process.env.JWT_SECRET;
const COOKIE_NAME = 'authToken';

/* ------------------------------------------------------------------ */
/*  helpers                                                           */
/* ------------------------------------------------------------------ */

function buildCookieOptions(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 'lax' is the modern, secure default for same-site apps.
    path: '/',
    maxAge: maxAgeMs,
  };

}

function setTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, buildCookieOptions());
}

/* ------------------------------------------------------------------ */
/*  routes                                                            */
/* ------------------------------------------------------------------ */

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({ data: { email, password: hashed } });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.code === 'P2002')        // Prisma unique constraint
      return res.status(409).json({ message: 'Email already registered' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  setTokenCookie(res, token);
  res.status(200).json({ id: user.id, email: user.email });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie(COOKIE_NAME, '', {
    ...buildCookieOptions(0),
    expires: new Date(0),            // Force immediate removal
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
