import { ImageProvider, ImageOptions, ImageResult } from '../types';

export class UnsplashProvider implements ImageProvider {
  private accessKey: string;

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  async fetchRandomImage(options: ImageOptions): Promise<ImageResult> {
    const params = new URLSearchParams();
    if (options.query) params.append('query', options.query);
    // Unsplash doesn't strictly support width/height for random photo selection in the same way for resizing via API query params on the /random endpoint directly for *fetching* the image content, 
    // but we can request specific dimensions roughly or rely on the returned structure to pick a size.
    // However, the /photos/random endpoint returns a JSON with urls.raw, urls.full, etc.
    // We can append parameters to the returned URL for resizing.
    
    // Using fetching logic:
    const url = `https://api.unsplash.com/photos/random?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${this.accessKey}`
      }
    });

    if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle single random photo (array if count param used, but here generic assumes one)
    const photo = Array.isArray(data) ? data[0] : data;

    // Construct resized URL
    // Unsplash uses Imgix. We can append parameters.
    const baseUrl = photo.urls.raw;
    const sizeParams = new URLSearchParams();
    if (options.width) sizeParams.append('w', options.width.toString());
    if (options.height) sizeParams.append('h', options.height.toString());
    if (options.quality) sizeParams.append('q', options.quality.toString());
    
    const finalUrl = `${baseUrl}&${sizeParams.toString()}`;

    return {
      url: finalUrl,
      width: options.width || photo.width,
      height: options.height || photo.height,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      originalUrl: photo.links.html // Link to photo page
    };
  }
}
