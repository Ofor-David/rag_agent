/**
 * admin.ts - Admin-only endpoints for managing the system
 * 
 * These endpoints are protected (require admin authentication) and
 * allow the HOD/admin to:
 * 
 * 1. Ingest knowledge base - Load questions and answers from the JSON file
 *    and store them in Qdrant Cloud (with embeddings)
 * 2. View flagged answers - See all answers that students marked as wrong
 * 
 * These are "admin only" because regular students shouldn't be able to
 * modify the knowledge base or see all flagged items.
 * 
 * POST /api/v1/admin/ingest - Load knowledge base into vector DB
 * GET  /api/v1/admin/flags - Get all flagged answers for review
 */
import { Router }                  from 'express';
import { readFileSync, existsSync } from 'fs';
import { join }                    from 'path';
import { adminAuth }               from '../middleware/adminAuth.ts';
import { ingestQdrant }            from '../vectordb/ingest.ts';
import { sendSuccess, sendError }  from '../utils/response.ts';

const router     = Router();
const FLAGS_PATH = join(process.cwd(), 'logs', 'flags.json');

// POST /api/v1/admin/ingest
// Loads the knowledge base JSON file, creates embeddings, and stores in Qdrant
router.post('/admin/ingest', adminAuth, async (_req, res) => {
  try {
    const { inserted, skipped } = await ingestQdrant();
    return sendSuccess(res, 200, {
      message:          'Knowledge base ingested successfully.',
      records_inserted: inserted,
      records_skipped:  skipped,
    });
  } catch (err) {
    console.error('Ingestion error:', err);
    return sendError(res, 500, 'INGESTION_FAILED', 'Failed to ingest knowledge base.');
  }
});

// GET /api/v1/admin/flags
// Returns all answers that students have flagged as incorrect
router.get('/admin/flags', adminAuth, (_req, res) => {
  const flags = existsSync(FLAGS_PATH)
    ? JSON.parse(readFileSync(FLAGS_PATH, 'utf-8'))
    : [];
  return sendSuccess(res, 200, { count: flags.length, flags });
});

export default router;