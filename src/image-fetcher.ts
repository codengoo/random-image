import { ImageProvider, ImageOptions, ImageResult, DownloadOptions } from './types';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { v7 as uuidv4 } from 'uuid';

export class RandomImage {
  private provider: ImageProvider;

  constructor(provider: ImageProvider) {
    this.provider = provider;
  }

  /**
   * Fetches a random image based on the provided options.
   * @param options - Configuration options for the image (width, height, query, etc.)
   * @returns A promise that resolves to an ImageResult object.
   */
  async getRandom(options: ImageOptions = {}): Promise<ImageResult> {
    return this.provider.fetchRandomImage(options);
  }

  /**
   * Downloads an image to a specified directory.
   * @param imageUrl - The URL of the image to download (can be a string or ImageResult object)
   * @param destinationPath - The directory path where the image will be saved
   * @param options - Download options (filename, overwrite, etc.)
   * @returns A promise that resolves to the full path of the downloaded file
   */
  async download(
    imageUrl: string | ImageResult,
    destinationPath: string,
    options: DownloadOptions = {}
  ): Promise<string> {
    const url = typeof imageUrl === 'string' ? imageUrl : imageUrl.url;

    // Create directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // Determine filename
    let finalFilename: string;
    if (options.filename) {
      finalFilename = options.filename;
    } else if (options.keepOriginalName) {
      // keepOriginalName === true or undefined (default behavior: try to keep original)
      const urlPath = new URL(url).pathname;
      const urlFilename = path.basename(urlPath);
      if (urlFilename && urlFilename.length > 0 && urlFilename !== '/') {
        finalFilename = urlFilename;
      } else {
        // Fallback if no filename in URL
        const ext = this.getExtensionFromUrl(url) || '.jpg';
        finalFilename = `${uuidv4()}${ext}`;
      }
    } else {
      // Generate UUID v4 filename
      const ext = this.getExtensionFromUrl(url) || '.jpg';
      finalFilename = `${uuidv4()}${ext}`;
    }

    // Ensure filename has an extension
    if (!path.extname(finalFilename)) {
      finalFilename += '.jpg';
    }

    const fullPath = path.join(destinationPath, finalFilename);

    // Check if file exists and overwrite option
    if (fs.existsSync(fullPath) && !options.overwrite) {
      throw new Error(`File already exists: ${fullPath}. Set overwrite: true to replace it.`);
    }

    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        maxRedirects: 5, // Automatically handle redirects
      });

      const writer = fs.createWriteStream(fullPath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          resolve(fullPath);
        });

        writer.on('error', (err) => {
          fs.unlink(fullPath, () => { }); // Delete partial file
          reject(err);
        });

        response.data.on('error', (err: Error) => {
          writer.close();
          fs.unlink(fullPath, () => { }); // Delete partial file
          reject(err);
        });
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to download image: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Helper method to extract file extension from URL
   * @param url - The URL to extract extension from
   * @returns The file extension (e.g., '.jpg', '.png') or null
   */
  private getExtensionFromUrl(url: string): string | null {
    try {
      const urlPath = new URL(url).pathname;
      const ext = path.extname(urlPath);
      return ext || null;
    } catch {
      return null;
    }
  }
}
