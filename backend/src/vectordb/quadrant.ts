/**
 * quadrant.ts - Qdrant Cloud Vector Database Adapter
 * 
 * This module provides an adapter class that implements the IVectorDB interface
 * for Qdrant Cloud. It wraps the Qdrant client with our application's specific
 * data structures and query logic.
 * 
 * WHAT IS QDRANT?
 * Qdrant is a vector database - a specialized database for storing and searching
 * embedding vectors. It's like a regular database, but optimized for finding
 * "similar" items based on their numeric representations.
 * 
 * WHY QDRANT CLOUD?
 * - Managed service (no server setup required)
 * - Scalable and reliable
 * - Supports semantic search with cosine similarity
 * - REST API for easy integration
 * 
 * THE ADAPTER PATTERN:
 * This class wraps the raw Qdrant client and provides a clean interface
 * that matches our application's needs (IVectorDB interface).
 * If we ever switch to a different vector DB, we only need to modify this file.
 * 
 * KEY CONCEPTS:
 * - Collection: A named container for vectors (like a table in SQL)
 * - Point: A single vector with an ID and optional metadata (payload)
 * - Search: Finding similar vectors using cosine similarity
 * - Payload: Additional data stored with each vector (question, answer, category)
 */
import { QdrantClient } from '@qdrant/js-client-rest';
import type { IVectorDB, SearchResult } from '../utils/types.ts';

/**
 * QdrantDB - Adapter class for Qdrant Cloud vector database
 * 
 * This class implements the IVectorDB interface, providing methods for:
 * - query(): Search for similar questions using embeddings
 * - health(): Check if the database connection is working
 * 
 * It acts as a bridge between our application code and the Qdrant client library.
 */
export class QdrantDB implements IVectorDB {
  /**
   * The underlying Qdrant client instance
   * Used to make API calls to Qdrant Cloud
   */
  private client: QdrantClient;

  /**
   * The name of the Qdrant collection to use
   * Set via QDRANT_COLLECTION environment variable
   */
  private collection: string;

  /**
   * Constructor - Initialize Qdrant client with credentials
   * 
   * Reads configuration from environment variables:
   * - QDRANT_URL: The cloud endpoint (e.g., https://xxx.qdrant.io)
   * - QDRANT_API_KEY: Authentication key for Qdrant Cloud
   * - QDRANT_COLLECTION: Name of the collection to use
   */
  constructor() {
    // Create Qdrant client with cloud credentials
    this.client = new QdrantClient({
      url:    process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    });
    
    // Get collection name from environment
    // This is the name of the vector collection created during ingestion
    this.collection = process.env.QDRANT_COLLECTION!;
  }

  /**
   * Search for similar questions in the knowledge base
   * 
   * This is the core search method used by the /ask endpoint.
   * Given a question's embedding vector, it finds the most similar
   * questions in the knowledge base.
   * 
   * HOW IT WORKS:
   * 1. Takes a query vector (embedded question)
   * 2. Asks Qdrant to find the top-K most similar vectors
   * 3. Returns the matching entries with their original questions, answers, and categories
   * 
   * @param vector - The embedded question (list of 3072 numbers)
   * @param topK - Number of results to return (usually 3)
   * @returns Array of matching SearchResult objects with question, answer, category, and score
   */
  async query(vector: number[], topK: number): Promise<SearchResult[]> {
    // Call Qdrant's search API
    // - collection: Which collection to search
    // - vector: The query vector to compare against
    // - limit: How many results to return
    // - with_payload: Include the metadata (question, answer, category) in results
    const results = await this.client.search(this.collection, {
      vector,
      limit:        topK,
      with_payload: true,
    });

    // Transform Qdrant results into our application's SearchResult format
    // Each result contains:
    // - payload: The metadata we stored (question, answer, category)
    // - score: Similarity score from cosine similarity (0-1, higher = more similar)
    return results.map(r => ({
      question: r.payload?.question as string ?? 'Unknown',
      answer:   r.payload?.answer   as string ?? 'Unknown',
      category: r.payload?.category as string ?? 'Unknown',
      score:    r.score,
    }));
  }

  /**
   * Health check - Verify database connection is working
   * 
   * This method is used by the /health endpoint to verify that
   * both the server and the Qdrant database are operational.
   * 
   * @returns 'connected' if Qdrant is reachable, 'error' otherwise
   */
  async health(): Promise<'connected' | 'error'> {
    try {
      // Attempt to list collections - this will fail if Qdrant is unreachable
      await this.client.getCollections();
      return 'connected';
    } catch {
      // If any error occurs, return 'error'
      // This could be network issues, invalid credentials, or Qdrant being down
      return 'error';
    }
  }
}
