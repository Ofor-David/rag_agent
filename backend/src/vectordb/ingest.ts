import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embed } from "../pipeline/embed.ts";
import { loadKnowledgeBase } from "../utils/loader.ts";

const BATCH_SIZE = 20;
const VECTOR_SIZE = 3072;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function ingestQdrant(): Promise<{
  inserted: number;
  skipped: number;
}> {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  });
  const collection = process.env.QDRANT_COLLECTION!;
  const entries = loadKnowledgeBase();

  // Full refresh
  try {
    await client.deleteCollection(collection);
    console.log("Deleted existing collection.");
  } catch {
    console.log("No existing collection, creating fresh.");
  }

  await client.createCollection(collection, {
    vectors: { size: VECTOR_SIZE, distance: "Cosine" },
  });
  console.log(`Created collection: ${collection}`);

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const points = [];

    for (const entry of batch) {
      try {
        const vector = await embed(`${entry.answer} ${entry.category}`);
        points.push({
          id: inserted + points.length,
          vector,
          payload: {
            question: entry.question,
            answer: entry.answer,
            category: entry.category,
          },
        });
        console.log(
          `Embedded ${inserted + points.length}/${entries.length}: ${entry.category}`,
        );
      } catch (err) {
        console.warn("Skipping entry:", err);
        skipped++;
      }
    }

    if (points.length > 0) {
      await client.upsert(collection, { points });
      inserted += points.length;
    }

    if (i + BATCH_SIZE < entries.length) {
      console.log("Pausing between batches...");
      await sleep(1000);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
  return { inserted, skipped }; // ← add this line before the closing brace
}
