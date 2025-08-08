/**
 * ===================================================================
 *  Configuration - API Key from Environment Variable
 * ===================================================================
 *
 * This file now loads the API key from the Vite environment variable VITE_API_KEY.
 * For local development, create a .env file in the project root with:
 *   VITE_API_KEY=your-google-api-key-here
 * For Vercel/production, set VITE_API_KEY in your project environment variables.
 *
 * Do NOT hardcode secrets in this file.
 */
// Vite environment variable type declaration for TypeScript
interface ImportMetaEnv {
	readonly VITE_API_KEY: string;
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export const API_KEY = import.meta.env.VITE_API_KEY;
