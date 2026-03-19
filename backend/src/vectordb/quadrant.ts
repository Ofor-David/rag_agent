import { QdrantClient } from '@qdrant/js-client-rest';
import type { IVectorDB, SearchResult } from '../utils/types.ts';

export class QdrantDB implements IVectorDB {
  private client: QdrantClient;
  private collection: string;

  constructor() {
    this.client = new QdrantClient({
      url:    process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    });
    this.collection = process.env.QDRANT_COLLECTION!;
  }

  async query(vector: number[], topK: number): Promise<SearchResult[]> {
    const results = await this.client.search(this.collection, {
      vector,
      limit:        topK,
      with_payload: true,
    });

    return results.map(r => ({
      question: r.payload?.question as string ?? 'Unknown',
      answer:   r.payload?.answer   as string ?? 'Unknown',
      category: r.payload?.category as string ?? 'Unknown',
      score:    r.score,
    }));
  }

  async health(): Promise<'connected' | 'error'> {
    try {
      await this.client.getCollections();
      return 'connected';
    } catch {
      return 'error';
    }
  }
}