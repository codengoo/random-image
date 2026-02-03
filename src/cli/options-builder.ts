import { ImageOptions, DownloadOptions } from '../types.js';

/**
 * Build ImageOptions from CLI options
 */
export function buildFetchOptions(options: any): ImageOptions {
  const fetchOptions: ImageOptions = {};
  
  if (options.query) fetchOptions.query = options.query;
  if (options.width) fetchOptions.width = options.width;
  if (options.height) fetchOptions.height = options.height;
  if (options.quality) fetchOptions.quality = options.quality;
  if (options.orientation) fetchOptions.orientation = options.orientation;

  return fetchOptions;
}

/**
 * Build DownloadOptions from CLI options
 */
export function buildDownloadOptions(options: any): DownloadOptions {
  const downloadOptions: DownloadOptions = {
    overwrite: options.overwrite,
    keepOriginalName: options.keepOriginalName,
  };

  if (options.filename) {
    downloadOptions.filename = options.filename;
  }

  return downloadOptions;
}

/**
 * Get download path from options
 */
export function getDownloadPath(options: any): string {
  return typeof options.download === 'string' 
    ? options.download 
    : './downloads';
}
