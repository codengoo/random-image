import { ImageProvider, ImageOptions, ImageResult } from './types';

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
}
