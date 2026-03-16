import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.ts'
import flagRouter from './routes/flag.ts';
import askRouter from './routes/ask.ts'

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'X-Admin-Key'] }));
app.use(express.json());

// Routes
app.use('/api/v1', healthRouter);
app.use('/api/v1', flagRouter);
app.use('/api/v1', askRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});