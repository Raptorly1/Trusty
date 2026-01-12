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

export const API_KEY = import.meta.env.VITE_API_KEY;
