import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function embed(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
      throw new Error('Empty embedding returned from Gemini');
    }

    return embedding;
  } catch (err) {
    console.error('Embedding failed:', err);
    throw new Error('EMBEDDING_FAILED');
  }
}