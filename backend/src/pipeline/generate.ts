import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an academic assistant for the Department of Computer Science,
Nnamdi Azikiwe University. Answer student questions ONLY using the context provided below.
If the answer is not in the context, say: "I don't have that information. Please contact the HOD directly."
Do not guess or invent information.`;

export async function generate(question: string, context: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `CONTEXT:\n${context}\n\nQUESTION:\n${question}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 400,
        temperature: 0.2,
      },
    });

    const content = response.text;

    if (!content || content.trim() === '') {
      throw new Error('Empty response returned from Gemini');
    }

    return content;
  } catch (err) {
    console.error('Generation failed:', err);
    throw new Error('LLM_FAILED');
  }
}