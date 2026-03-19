/**
 * ingest.ts - Knowledge Base Ingestion Pipeline
 * 
 * This module handles the initial loading of the knowledge base into Qdrant Cloud.
 * 
 * WHAT IT DOES:
 * 1. Loads questions and answers from knowledge_base.json
 * 2. Creates embedding vectors for each entry using Gemini
 * 3. Stores the vectors in Qdrant Cloud for semantic search
 * 
 * WHEN TO RUN:
 * - When first setting up the system
 * - When updating the knowledge base (knowledge_base.json)
 * - When switching to a different vector database
 * 
 * HOW IT WORKS:
 * 1. Delete any existing collection (fresh start)
 * 2. Create a new collection with the correct vector size (3072 for gemini-embedding-001)
 * 3. Process entries in batches to avoid rate limits
 * 4. For each entry: create embedding + store in Qdrant
 * 
 * IMPORTANT NOTES:
 * - gemini-embedding-001 produces 3072-dimensional vectors
 * - Batching (20 entries at a time) prevents API rate limits
 * - A 1-second pause between batches prevents overwhelming the API
 * - Entries that fail to embed are skipped (counted in 'skipped')
 */
import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { embed } from '../pipeline/embed.ts';
import { loadKnowledgeBase } from '../utils/loader.ts';

/**
 * Batch size for ingestion
 * Processing too many entries at once can hit API rate limits,
 * so we process in smaller batches with pauses between them.
 */
const BATCH_SIZE = 20;

/**
 * Vector dimension for gemini-embedding-001
 * This must match the embedding model output size.
 * gemini-embedding-001 produces 3072-dimensional vectors.
 */
const VECTOR_SIZE = 3072;

/**
 * Utility function to pause execution
 * Used between batches to avoid overwhelming the Gemini API
 * @param ms - Milliseconds to wait
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Main ingestion function
 * Loads knowledge base, creates embeddings, and stores in Qdrant
 * 
 * @returns Object with counts of inserted and skipped entries
 */
export async function ingestQdrant(): Promise<{
  inserted: number;
  skipped: number;
}> {
  // Initialize Qdrant client with credentials from environment variables
  // QDRANT_URL: The cloud endpoint for Qdrant
  // QDRANT_API_KEY: Authentication key for Qdrant Cloud
  const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  });

  // Get the collection name from environment variables
  // This is the name of the vector collection in Qdrant Cloud
  const collection = process.env.QDRANT_COLLECTION!;

  // Load and validate the knowledge base from JSON file
  // This reads data/knowledge_base.json and returns validated entries
  const entries = loadKnowledgeBase();

  // Step 1: Delete existing collection (if any)
  // This ensures a clean slate for ingestion
  // If no collection exists, the API will return an error which we catch and ignore
  try {
    await client.deleteCollection(collection);
    console.log('Deleted existing collection.');
  } catch {
    console.log('No existing collection, creating fresh.');
  }

  // Step 2: Create new collection with vector configuration
  // - size: Vector dimensions (must match embedding model output)
  // - distance: Similarity metric (Cosine measures angle between vectors)
  await client.createCollection(collection, {
    vectors: { size: VECTOR_SIZE, distance: 'Cosine' },
  });
  console.log(`Created collection: ${collection}`);

  // Initialize counters for tracking ingestion results
  let inserted = 0;  // Successfully embedded and stored entries
  let skipped = 0;    // Entries that failed to embed

  // Step 3: Process entries in batches
  // We iterate through the knowledge base in chunks of BATCH_SIZE
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    // Get the current batch of entries
    const batch = entries.slice(i, i + BATCH_SIZE);
    const points = [];  // Qdrant point objects to insert

    // Step 4: Embed each entry in the batch
    // For each entry, we:
    // 1. Create an embedding vector using Gemini
    // 2. Package it as a Qdrant "point" with the question/answer as metadata
    for (const entry of batch) {
      try {
        // Combine answer and category for richer embedding
        // The category helps with context-aware retrieval
        const textToEmbed = `${entry.answer} ${entry.category}`;
        
        // Create embedding vector using Gemini
        const vector = await embed(textToEmbed);
        
        // Create Qdrant point object
        // - id: Unique identifier for this point
        // - vector: The embedding values
        // - payload: Additional metadata (question, answer, category)
        points.push({
          id: inserted + points.length,
          vector,
          payload: {
            question: entry.question,
            answer: entry.answer,
            category: entry.category,
          },
        });
        
        // Log progress for debugging
        console.log(
          `Embedded ${inserted + points.length}/${entries.length}: ${entry.category}`,
        );
      } catch (err) {
        // If embedding fails for an entry, skip it and continue
        // This prevents one bad entry from failing the entire ingestion
        console.warn('Skipping entry:', err);
        skipped++;
      }
    }

    // Step 5: Insert the batch into Qdrant
    // upsert() inserts or updates if the ID already exists
    if (points.length > 0) {
      await client.upsert(collection, { points });
      inserted += points.length;
    }

    // Step 6: Pause between batches
    // This prevents hitting Gemini API rate limits
    // We only pause if there are more batches to process
    if (i + BATCH_SIZE < entries.length) {
      console.log('Pausing between batches...');
      await sleep(1000);
    }
  }

  // Final summary
  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
  return { inserted, skipped };
}
