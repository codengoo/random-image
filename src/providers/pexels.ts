import axios from "axios";
import { ImageProvider, ImageOptions, ImageResult } from "../types";

export class PexelsProvider implements ImageProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchRandomImage(options: ImageOptions): Promise<ImageResult> {
    const endpoint = options.query
      ? "https://api.pexels.com/v1/search"
      : "https://api.pexels.com/v1/curated";

    // Randomizing page number (1-100) to get a "random" image
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const params: any = {
      per_page: 1,
      page: randomPage,
    };
    if (options.query) params.query = options.query;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: this.apiKey,
      },
      params: params,
    });

    const data = response.data;

    if (!data.photos || data.photos.length === 0) {
      throw new Error("No images found on Pexels");
    }

    const photo = data.photos[0];

    const baseUrl = photo.src.original;
    const sizeParams = new URLSearchParams();
    sizeParams.append("auto", "compress");
    sizeParams.append("cs", "tinysrgb"); // Default pexels param
    if (options.width) sizeParams.append("w", options.width.toString());
    if (options.height) sizeParams.append("h", options.height.toString());

    const finalUrl = `${baseUrl}?${sizeParams.toString()}`;

    return {
      url: finalUrl,
      width: options.width || photo.width,
      height: options.height || photo.height,
      author: photo.photographer,
      authorUrl: photo.photographer_url,
      originalUrl: photo.url,
    };
  }
}
