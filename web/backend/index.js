import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // FIX: Import the cors middleware

import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import provisionRoutes from './routes/provision.js';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Middleware (CORS) ---
// This MUST come BEFORE any of your routes.
// It tells your backend to trust requests originating from your frontend domain.
const corsOptions = {
  // IMPORTANT: This should be the exact URL of your frontend.
  origin: 'https://intelvis.ai',
  // This allows the browser to send cookies with the API request.
  credentials: true,
};
app.use(cors(corsOptions));

// --- Core Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/provision', provisionRoutes);

// --- Health Check Route (Good for debugging) ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});