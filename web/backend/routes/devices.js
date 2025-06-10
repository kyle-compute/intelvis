import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js'; // <-- UNCOMMENT THIS

const app = express();
const port = 3001; // Or process.env.PORT || 3001

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes); // <-- UNCOMMENT THIS

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});