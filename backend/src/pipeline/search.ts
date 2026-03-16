import type { IVectorDB, SearchResult } from '../utils/types.ts';

export async function searchAndRetrieve(
  db: IVectorDB,
  vector: number[],
  topK: number
): Promise<{ sources: SearchResult[]; context: string }> {

  const results = await db.query(vector, topK);

  if (results.length === 0) {
    throw new Error('NO_RESULTS');
  }

  const context = results
    .map(r => `Q: ${r.question}\nA: ${r.answer}`)
    .join('\n\n');

  return { sources: results, context };
}