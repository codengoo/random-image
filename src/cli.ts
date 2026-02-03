#!/usr/bin/env node

import { Command } from 'commander';
import { RandomImage } from './index.js';
import chalk from 'chalk';
import { loadEnvironment, getApiKeys } from './cli/env-loader.js';
import {
  displayError,
  displayInfo,
  displayImageInfo,
  displayDownloadSuccess,
  displayAvailableProviders,
} from './cli/display.js';
import {
  selectRandomProvider,
  getProviderInstance,
} from './cli/provider-manager.js';
import {
  buildFetchOptions,
  buildDownloadOptions,
  getDownloadPath,
} from './cli/options-builder.js';
import {
  fetchImage,
  downloadImage,
} from './cli/actions.js';

// Load environment variables
loadEnvironment();

const program = new Command();

program
  .name('random-image')
  .description('🎨 CLI tool to fetch random images from various providers')
  .version('1.2.0');

program
  .command('fetch')
  .description('🖼️  Fetch a random image from image providers')
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
      // Get API keys from environment
      const providers = getApiKeys();

      // Determine which provider to use
      let providerName = options.provider.toLowerCase();
      
      if (providerName === 'random') {
        const selectedProvider = selectRandomProvider(providers);
        
        if (!selectedProvider) {
          displayError('No API keys found in environment variables.');
          console.log(chalk.yellow('\n💡 Please set at least one of:'));
          console.log(chalk.cyan('   • UNSPLASH_KEY'));
          console.log(chalk.cyan('   • PEXELS_KEY'));
          console.log(chalk.cyan('   • PIXABAY_KEY\n'));
          process.exit(1);
        }

        providerName = selectedProvider;
        displayInfo(`Using random provider: ${chalk.bold(providerName)}`);
      }

      // Create provider instance
      const result = getProviderInstance(providerName, providers);
      if (!result) {
        process.exit(1);
      }

      const { provider, name } = result;
      const fetcher = new RandomImage(provider);

      // Prepare fetch options
      const fetchOptions = buildFetchOptions(options);

      // Fetch image
      const image = await fetchImage(fetcher, name, fetchOptions);

      // Display image info
      displayImageInfo(image, name);

      // Download if requested
      if (options.download !== undefined) {
        const downloadPath = getDownloadPath(options);
        const downloadOptions = buildDownloadOptions(options);

        const filePath = await downloadImage(
          fetcher,
          image,
          downloadPath,
          downloadOptions
        );

        displayDownloadSuccess(filePath);
      }

    } catch (error) {
      if (error instanceof Error) {
        displayError(error.message);
      } else {
        displayError('An unexpected error occurred');
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
