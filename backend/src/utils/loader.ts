import { readFileSync } from 'fs';
import { join } from 'path';

export interface KnowledgeEntry {
  question: string;
  answer:   string;
  category: string;
}

export function loadKnowledgeBase(
  path = join(process.cwd(), 'data', 'knowledge_base.json')
): KnowledgeEntry[] {
  const raw = readFileSync(path, 'utf-8');
  const parsed = JSON.parse(raw) as unknown[];

  const valid: KnowledgeEntry[] = [];

  for (const entry of parsed) {
    if (
      typeof entry === 'object' && entry !== null &&
      'question' in entry && typeof (entry as any).question === 'string' &&
      'answer'   in entry && typeof (entry as any).answer   === 'string' &&
      'category' in entry && typeof (entry as any).category === 'string'
    ) {
      valid.push(entry as KnowledgeEntry);
    } else {
      console.warn('Skipping malformed entry:', entry);
    }
  }

  console.log(`Loaded ${valid.length} knowledge base entries.`);
  return valid;
}