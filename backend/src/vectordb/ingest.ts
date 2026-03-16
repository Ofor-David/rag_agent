import { ChromaClient, type EmbeddingFunction } from "chromadb";
import { embed } from "../pipeline/embed.ts";
import { loadKnowledgeBase } from "../utils/loader.ts";
import "dotenv/config";
import {} from "chromadb";

// Tell ChromaDB we are handling embeddings ourselves
class NoOpEmbedder implements EmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    return texts.map(() => []);
  }
}

const BATCH_SIZE = 20;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function ingestKnowledgeBase(): Promise<{
  inserted: number;
  skipped: number;
}> {
  const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
  });
  const name = process.env.CHROMA_COLLECTION!;
  const entries = loadKnowledgeBase();
  const embedder = new NoOpEmbedder();

  // Full refresh
  try {
    await client.deleteCollection({ name });
    console.log("Deleted existing collection.");
  } catch {
    console.log("No existing collection found, creating fresh.");
  }

  const collection = await client.createCollection({
    name,
    embeddingFunction: embedder,
  });

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    for (const entry of batch) {
      try {
        const textToEmbed = `${entry.answer} ${entry.category}`;
        const vector = await embed(textToEmbed);

        await collection.add({
          ids: [`entry_${inserted}`],
          embeddings: [vector],
          metadatas: [
            {
              question: entry.question,
              answer: entry.answer,
              category: entry.category,
            },
          ],
          documents: [entry.answer],
        });

        inserted++;
        console.log(
          `Embedded ${inserted}/${entries.length}: ${entry.category}`,
        );
      } catch (err) {
        console.warn("Skipping entry due to error:", err);
        skipped++;
      }
    }

    if (i + BATCH_SIZE < entries.length) {
      console.log("Pausing between batches...");
      await sleep(1000);
    }
  }

  console.log(
    `\nIngestion complete. Inserted: ${inserted}, Skipped: ${skipped}`,
  );
  return { inserted, skipped };
}

