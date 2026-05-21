import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewRoutes from './routes/reviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register API Route Handlers
app.use('/api/review', reviewRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', engine: 'llama-3.3' });
});

// Start local dev server if not wrapped inside Vercel's serverless runtime
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

export default app;
