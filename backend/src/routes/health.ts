/**
 * health.ts - Health check endpoint
 * 
 * This is a simple endpoint that tells if the server and database are
 * working properly. It's used by:
 * - Frontend to check if backend is online
 * - Monitoring systems to verify the service is healthy
 * - Docker/containers to check if the app started correctly
 * 
 * GET /api/v1/health
 * Returns: { status: "success", data: { vector_db: "connected", timestamp: "..." } }
 */
import { Router }  from 'express';
import { QdrantDB } from '../vectordb/quadrant.ts';
import { sendSuccess } from '../utils/response.ts';

const router = Router();
const db = new QdrantDB();

// Health check endpoint - verifies both server and database are working
router.get('/health', async (_req, res) => {
  const vector_db = await db.health();
  sendSuccess(res, 200, {
    vector_db,
    timestamp: new Date().toISOString(),
  });
});

export default router;