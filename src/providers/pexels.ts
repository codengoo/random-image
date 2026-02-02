import { ImageProvider, ImageOptions, ImageResult } from '../types';

export class PexelsProvider implements ImageProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchRandomImage(options: ImageOptions): Promise<ImageResult> {
    // Pexels 'curated' or 'search'. 
    // If query is present, use search. If not, use curated.
    // We need to randomize the result because Pexels search/curated returns a list.
    // We can use 'page' and 'per_page=1' with a random page number to simulate random? 
    // Or just fetch one page and pick random?
    // Pexels API doesn't have a direct /random endpoint like Unsplash.
    // Efficient strategy: Search with 1 result per page, but randomize the page number.
    // Max page is tricky, maybe limit to top 100 results?
    
    const endpoint = options.query 
        ? 'https://api.pexels.com/v1/search' 
        : 'https://api.pexels.com/v1/curated';

    // Randomizing page number (1-100) to get a "random" image
    const randomPage = Math.floor(Math.random() * 100) + 1;
    
    const params = new URLSearchParams();
    if (options.query) params.append('query', options.query);
    params.append('per_page', '1');
    params.append('page', randomPage.toString());

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
        throw new Error('No images found on Pexels');
    }

    const photo = data.photos[0];

    // Pexels supports resizing via query params on the image url?
    // Pexels returns src object with original, large2x, large, medium, small, portrait, landscape, tiny.
    // Or we can modify the 'original' url.
    // Pexels docs say: https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350
    
    const baseUrl = photo.src.original;
    const sizeParams = new URLSearchParams();
    sizeParams.append('auto', 'compress');
    sizeParams.append('cs', 'tinysrgb'); // Default pexels param
    if (options.width) sizeParams.append('w', options.width.toString());
    if (options.height) sizeParams.append('h', options.height.toString());
    
    // Note: Quality param is not standard in Pexels URL manipulation documented publicly as 'q', 
    // but 'auto=compress' handles it. We can try adding it if needed or ignore. 
    // I'll skip explicit q param mapping for now as it's not strictly 'quality=X'.

    const finalUrl = `${baseUrl}?${sizeParams.toString()}`;

    return {
      url: finalUrl,
      width: options.width || photo.width,
      height: options.height || photo.height,
      author: photo.photographer,
      authorUrl: photo.photographer_url,
      originalUrl: photo.url
    };
  }
}
