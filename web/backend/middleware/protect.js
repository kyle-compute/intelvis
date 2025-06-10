// backend/middleware/protect.js
import prisma from '../lib/db.js';
import jwt from 'jsonwebtoken';


export const protect = async (req, res, next) => {
  let token;
  if (req.cookies.authToken) {
    try {
      token = req.cookies.authToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, createdAt: true },
      });
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};