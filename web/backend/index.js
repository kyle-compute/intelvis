// backend/index.js - THE FINAL, BULLETPROOF VERSION
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import provisionRoutes from './routes/provision.js';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Middleware (CORS) ---
const corsOptions = {
  origin: 'https://intelvis.ai', // Your exact frontend URL
  credentials: true,
};

// FIX: Explicitly handle pre-flight OPTIONS requests.
// The browser sends an OPTIONS request first for any non-simple request.
// This new route handler will catch it, apply CORS, and respond with 204 No Content.
// This MUST come before the general app.use(cors(corsOptions)).
app.options('*', cors(corsOptions));

// Now, apply CORS for all other requests (GET, POST, etc.)
app.use(cors(corsOptions));

// --- Core Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
// These are correct. The full path is handled here.
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