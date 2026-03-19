/**
 * run_ingest.ts - Standalone script to ingest knowledge base
 * 
 * This is a simple script that runs the knowledge base ingestion.
 * It's an alternative to using the admin API endpoint.
 * 
 * Run with: npm run ingest
 * (which runs: node --loader ts-node/esm --no-warnings src/vectordb/ingest.ts)
 * 
 * Before running, make sure:
 * - ChromaDB is running on localhost:8000
 * - knowledge_base.json exists in the data folder
 * - GEMINI_API_KEY is set in .env
 * 
 * This will delete any existing collection and create a fresh one
 * with all the questions and answers embedded.
 */
import 'dotenv/config';
import { ingestQdrant } from './ingest.ts';
ingestQdrant().catch(console.error);