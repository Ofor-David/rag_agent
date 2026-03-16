import 'dotenv/config';
import { ingestKnowledgeBase } from './ingest.ts';

ingestKnowledgeBase().catch(console.error);