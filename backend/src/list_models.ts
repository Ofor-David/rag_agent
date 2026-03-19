/**
 * list_models.ts - Utility to List Available Gemini Models
 * 
 * This is a debugging/development tool that queries the Gemini API
 * to list all AI models available with your API key.
 * 
 * WHY USE THIS?
 * - Verify your API key is working correctly
 * - See what models you have access to
 * - Check which actions each model supports (generateContent, embedContent, etc.)
 * - Useful when troubleshooting API access issues
 * 
 * HOW TO RUN:
 * ```bash
 * npx tsx src/list_models.ts
 * ```
 * 
 * REQUIREMENTS:
 * - GEMINI_API_KEY must be set in .env file
 * - Internet connection to reach Google's API
 * 
 * EXPECTED OUTPUT:
 * Each model will be printed with its name and supported actions:
 * ```
 * models/gemini-2.5-flash-lite | generateContent
 * models/gemini-embedding-001 | embedContent
 * ...
 * ```
 * 
 * COMMON ISSUES:
 * - If you see fewer models than expected, your API key may have limited access
 * - If you see a 403 error, the key was created from Google Cloud Console instead of AI Studio
 * - If you see an empty list, check your API key is valid
 */
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

/**
 * Initialize the Gemini AI client
 * Uses the API key from environment variables
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Fetch and display all available models
 * 
 * The models.list() method returns an async iterator of all models
 * available with the current API key.
 */
const response = await ai.models.list();

/**
 * Iterate through all models and print their information
 * 
 * For each model, we display:
 * - name: The model's identifier (used in API calls)
 * - supportedActions: What the model can do (generateContent, embedContent, etc.)
 */
for await (const model of response) {
  console.log(model.name, '|', model.supportedActions);
}
