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
  origin: 'https://intelvis.ai',
  credentials: true,
};
app.options('*', cors(corsOptions)); // Pre-flight
app.use(cors(corsOptions));

// --- Core Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/provision', provisionRoutes);

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
// This is the most important addition. It must be the *last* app.use() call.
// It catches any error passed via `next(error)` from any route handler.
app.use((err, req, res, next) => {
  // Log the full error stack trace for maximum debuggability
  console.error('--- UNHANDLED API ERROR ---');
  console.error(`Error processing ${req.method} ${req.originalUrl}`);
  console.error(err.stack); // This prints the full trace
  console.error('--- END OF ERROR ---');

  // Avoid sending a response if one has already been sent
  if (res.headersSent) {
    return next(err);
  }

  // Send a generic 500 response to the client
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server is running on http://0.0.0.0:${port}`);
});