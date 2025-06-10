// backend/index.js

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js'; // Import the new router

const app = express();
const port = 4000; // Make sure this is different from your frontend port

// --- Core Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies from the request

// --- API Routes ---
// Tell Express to use your auth routes for any request to '/api/auth'
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});