
import express from 'express';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js'; 
import provisionRoutes from './routes/provision.js';
const app = express();
const port = process.env.PORT || 3001;

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