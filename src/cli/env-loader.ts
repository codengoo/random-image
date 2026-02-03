import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

/**
 * Load environment variables from .env file
 * Tries multiple locations to support both development and production scenarios
 */
export function loadEnvironment(): void {
  const possibleEnvPaths = [
    path.resolve(process.cwd(), '.env'),           // Current working directory
    path.resolve(__dirname, '.env'),                // Same directory as the CLI script (dist/)
    path.resolve(__dirname, '..', '.env'),          // Parent directory (root of project)
  ];

  for (const envPath of possibleEnvPaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      break;
    }
  }
}

/**
 * Get available API keys from environment
 */
export function getApiKeys() {
  return {
    unsplash: process.env.UNSPLASH_KEY,
    pexels: process.env.PEXELS_KEY,
    pixabay: process.env.PIXABAY_KEY,
  };
}
