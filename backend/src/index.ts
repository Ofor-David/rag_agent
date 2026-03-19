/**
 * server.ts - Main entry point for the backend server
 * 
 * This is where the web server starts. It:
 * - Sets up Express (the web framework)
 * - Configures CORS (allows the frontend to talk to this backend)
 * - Creates the ChromaDB connection (the vector database for storing knowledge)
 * - Connects all the routes (like /ask, /flag, /admin) to their URLs
 * - Starts listening on port 3001 (or whatever PORT is set in .env)
 * 
 * Think of it as the "front desk" of the application - it directs all incoming
 * requests to the right place.
 */
import 'dotenv/config';
import express     from 'express';
import cors        from 'cors';
import healthRouter from './routes/health.ts';
import flagRouter   from './routes/flag.ts';
import askRouter, { setVectorDB } from './routes/ask.ts';
import adminRouter  from './routes/admin.ts';
import { QdrantDB } from './vectordb/quadrant.ts';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// CORS lets the frontend (different URL) make requests to this backend
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Key'],
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
// Explicitly handle OPTIONS preflight for all routes

app.options('*', cors(corsOptions));
// Create the vector database instance and pass it to the ask route
// This allows the /ask endpoint to search through the knowledge base
app.use(express.json());

const db = new QdrantDB();
// Express needs to parse JSON bodies from requests
setVectorDB(db);

// Connect all routes under /api/v1 prefix
// /api/v1/health -> health check
// /api/v1/ask    -> ask a question
// /api/v1/flag   -> flag an answer
// /api/v1/admin  -> admin operations
app.use('/api/v1', healthRouter);
app.use('/api/v1', flagRouter);
app.use('/api/v1', askRouter);
app.use('/api/v1', adminRouter);

// Start the server - it now listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
