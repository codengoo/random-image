import { RandomImage } from '../index.js';
import { ImageOptions, DownloadOptions, ImageResult } from '../types.js';
import ora from 'ora';
import chalk from 'chalk';
import * as path from 'path';
import {
  displayError,
  displayImageInfo,
  displayDownloadSuccess,
  displayInfo,
} from './display.js';

/**
 * Fetch a random image with loading spinner
 */
export async function fetchImage(
  fetcher: RandomImage,
  providerName: string,
  fetchOptions: ImageOptions
) {
  const spinner = ora({
    text: chalk.cyan('🔍 Searching for the perfect image...'),
    spinner: 'dots',
  }).start();

  try {
    const image = await fetcher.getRandom(fetchOptions);
    spinner.succeed(chalk.green('✨ Image found!'));
    return image;
  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch image'));
    throw error;
  }
}

/**
 * Download an image with loading spinner
 */
export async function downloadImage(
  fetcher: RandomImage,
  image: string | ImageResult,
  downloadPath: string,
  downloadOptions: DownloadOptions
) {
  const resolvedPath = path.resolve(downloadPath);
  
  displayInfo(`Downloading to: ${chalk.cyan(resolvedPath)}`);
  
  const spinner = ora({
    text: chalk.cyan('💾 Downloading image...'),
    spinner: 'dots',
  }).start();

  try {
    const filePath = await fetcher.download(image, downloadPath, downloadOptions);
    spinner.succeed(chalk.green('📦 Download complete!'));
    return filePath;
  } catch (error) {
    spinner.fail(chalk.red('Download failed'));
    throw error;
  }
}
