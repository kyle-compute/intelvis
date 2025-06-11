// backend/index.js - FINAL & SIMPLIFIED
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import provisionRoutes from './routes/provision.js';

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: 'https://intelvis.ai',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// FIX: Removed the /api prefix. Caddy now handles this.
app.use('/auth', authRoutes);
app.use('/devices', deviceRoutes);
app.use('/provision', provisionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});