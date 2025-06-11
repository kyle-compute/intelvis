// backend/index.js - THE FINAL, CANONICAL & CORRECT VERSION
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import provisionRoutes from './routes/provision.js';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Middleware (CORS) ---
// This MUST come BEFORE any other middleware or routes.
const corsOptions = {
  origin: 'https://intelvis.ai', // Your exact frontend URL
  credentials: true,
};

// FIX: Apply CORS globally. This will automatically handle OPTIONS
// pre-flight requests for all your defined routes.
app.use(cors(corsOptions));

// --- Core Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
// These are correct. The backend is now responsible for the full path.
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/provision', provisionRoutes);

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});