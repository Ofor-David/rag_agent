import { Router }            from 'express';
import { preprocess }        from '../pipeline/preprocess.ts';
import { embed }             from '../pipeline/embed.ts';
import { searchAndRetrieve } from '../pipeline/search.ts';
import { generate }          from '../pipeline/generate.ts';
import { sendSuccess, sendError } from '../utils/response.ts';
import type { IVectorDB }    from '../utils/types.ts';

const router = Router();

let vectorDB: IVectorDB | null = null;

export function setVectorDB(db: IVectorDB) {
  vectorDB = db;
}

router.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return sendError(res, 400, 'MISSING_QUESTION', 'question field is required.');
  }

  if (!vectorDB) {
    return sendError(res, 503, 'DB_NOT_READY', 'Vector database is not configured yet.');
  }

  const start = Date.now();

  try {
    const Qp             = preprocess(question);
    const Qpe            = await embed(Qp);
    const topK           = parseInt(process.env.TOP_K_RESULTS ?? '3');
    const { sources, context } = await searchAndRetrieve(vectorDB, Qpe, topK);
    const answer         = await generate(question, context);
    const response_time_ms = Date.now() - start;

    return sendSuccess(res, 200, { answer, sources, response_time_ms });

  } catch (err: any) {
    const message = err.message ?? 'Unknown error';

    if (message === 'EMBEDDING_FAILED') return sendError(res, 500, 'EMBEDDING_FAILED', 'Failed to process your question.');
    if (message === 'NO_RESULTS')       return sendError(res, 404, 'NO_RESULTS', 'No relevant information found. Please contact the HOD directly.');
    if (message === 'LLM_FAILED')       return sendError(res, 500, 'LLM_FAILED', 'Failed to generate a response.');

    return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong.');
  }
});

export default router;