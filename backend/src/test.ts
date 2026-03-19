/**
 * test.ts - Manual testing script for the entire pipeline
 * 
 * This is NOT a unit test - it's a manual testing script to verify
 * all the pipeline components work together.
 * 
 * Run with: npm run test
 * 
 * It tests each stage of the RAG pipeline:
 * 1. Loading the knowledge base
 * 2. Preprocessing a question
 * 3. Creating embeddings
 * 4. Generating an answer
 * 
 * If all stages pass, the system is working correctly!
 */
import 'dotenv/config';
import { loadKnowledgeBase } from './utils/loader.ts';
import { preprocess }        from './pipeline/preprocess.ts';
import { embed }             from './pipeline/embed.ts';
import { generate }          from './pipeline/generate.ts';

async function test() {

  // ── 1. Data Loader ──────────────────────────────────────────────────────
  console.log('\n--- 1. KNOWLEDGE BASE LOADER ---');
  const entries = loadKnowledgeBase();
  console.log('First entry:', entries[0]);

  // ── 2. Preprocessor ─────────────────────────────────────────────────────
  console.log('\n--- 2. PREPROCESSOR ---');
  const raw = 'What are the requirements to clear final year?';
  const cleaned = preprocess(raw);
  console.log('Raw:     ', raw);
  console.log('Cleaned: ', cleaned);

  // ── 3. Embedding ────────────────────────────────────────────────────────
  console.log('\n--- 3. EMBEDDING ---');
  const vector = await embed(cleaned);
  console.log('Vector length:', vector.length);           // should be 3072
  console.log('First 5 values:', vector.slice(0, 5));     // sanity check

  // ── 4. Generation ───────────────────────────────────────────────────────
  console.log('\n--- 4. GENERATION ---');
  const fakeContext = entries
    .map(e => `Q: ${e.question}\nA: ${e.answer}`)
    .join('\n\n');
  const answer = await generate(raw, fakeContext);
  console.log('Answer:', answer);

  console.log('\n All pipeline stages passed.');
}

test().catch(console.error);