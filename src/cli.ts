#!/usr/bin/env node

import { Command } from 'commander';
import { RandomImage, UnsplashProvider, PexelsProvider, PixabayProvider } from './index.js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from .env file
// Try to find .env in multiple locations for both dev and production scenarios
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

const program = new Command();

program
  .name('random-image')
  .description('CLI tool to fetch random images from various providers')
  .version('1.2.0');

program
  .command('fetch')
  .description('Fetch a random image from image providers')
  .option('-q, --query <search>', 'Search query for the image')
  .option('-w, --width <number>', 'Width of the image', parseInt)
  .option('-h, --height <number>', 'Height of the image', parseInt)
  .option('--quality <number>', 'Quality of the image (0-100)', parseInt)
  .option('--orientation <type>', 'Image orientation (landscape or portrait)')
  .option('-p, --provider <name>', 'Provider to use (unsplash, pexels, pixabay, or random)', 'random')
  .option('-d, --download [path]', 'Download the image to specified directory (default: ./downloads)')
  .option('--filename <name>', 'Custom filename for downloaded image')
  .option('--overwrite', 'Overwrite existing files', false)
  .option('--no-keep-original-name', 'Generate random UUID filename instead of keeping original')
  .action(async (options) => {
    try {
      // Get API keys from environment variables
      
      const providers = {
        unsplash: process.env.UNSPLASH_KEY,
        pexels: process.env.PEXELS_KEY,
        pixabay: process.env.PIXABAY_KEY,
      };
      
      // Determine which provider to use
      let providerName = options.provider.toLowerCase();
      if (providerName === 'random') {
        const availableProviders = Object.entries(providers)
          .filter(([_, key]) => key)
          .map(([name]) => name);

        if (availableProviders.length === 0) {
          console.error('Error: No API keys found in environment variables.');
          console.error('Please set at least one of: UNSPLASH_KEY, PEXELS_KEY, PIXABAY_KEY');
          process.exit(1);
        }

        providerName = availableProviders[Math.floor(Math.random() * availableProviders.length)];
        console.log(`Using random provider: ${providerName}`);
      }

      // Create provider instance
      let provider;
      const apiKey = providers[providerName as keyof typeof providers];
      
      if (!apiKey) {
        console.error(`Error: API key for ${providerName} not found.`);
        console.error(`Please set ${providerName.toUpperCase()}_KEY environment variable.`);
        process.exit(1);
      }

      switch (providerName) {
        case 'unsplash':
          provider = new UnsplashProvider(apiKey);
          break;
        case 'pexels':
          provider = new PexelsProvider(apiKey);
          break;
        case 'pixabay':
          provider = new PixabayProvider(apiKey);
          break;
        default:
          console.error(`Error: Unknown provider "${providerName}"`);
          console.error('Available providers: unsplash, pexels, pixabay, random');
          process.exit(1);
      }

      const fetcher = new RandomImage(provider);

      // Prepare fetch options
      const fetchOptions: any = {};
      if (options.query) fetchOptions.query = options.query;
      if (options.width) fetchOptions.width = options.width;
      if (options.height) fetchOptions.height = options.height;
      if (options.quality) fetchOptions.quality = options.quality;
      if (options.orientation) fetchOptions.orientation = options.orientation;

      console.log('Fetching random image...');
      const image = await fetcher.getRandom(fetchOptions);

      console.log('\n✓ Image fetched successfully!');
      console.log(`  URL: ${image.url}`);
      console.log(`  Size: ${image.width}x${image.height}`);
      console.log(`  Author: ${image.author}`);
      if (image.authorUrl) console.log(`  Author URL: ${image.authorUrl}`);
      console.log(`  Original: ${image.originalUrl}`);

      // Download if requested
      if (options.download !== undefined) {
        const downloadPath = typeof options.download === 'string' 
          ? options.download 
          : './downloads';

        console.log(`\nDownloading to ${path.resolve(downloadPath)}...`);

        const downloadOptions: any = {
          overwrite: options.overwrite,
          keepOriginalName: options.keepOriginalName,
        };
        
        if (options.filename) {
          downloadOptions.filename = options.filename;
        }

        const filePath = await fetcher.download(image, downloadPath, downloadOptions);
        console.log(`✓ Downloaded: ${filePath}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error(`\nError: ${error.message}`);
      } else {
        console.error('\nAn unexpected error occurred');
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
