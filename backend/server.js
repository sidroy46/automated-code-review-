import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import reviewRoutes from './routes/reviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: '*', // For development flexibility; restrict in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SmartReview AI backend is running smoothly' });
});

// API Routes
app.use('/api', reviewRoutes);
app.use('/api', chatRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
