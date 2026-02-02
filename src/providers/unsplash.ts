import axios from "axios";
import { ImageProvider, ImageOptions, ImageResult } from "../types";

export class UnsplashProvider implements ImageProvider {
  private accessKey: string;

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  async fetchRandomImage(options: ImageOptions): Promise<ImageResult> {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: `Client-ID ${this.accessKey}`,
      },
      params: {
        query: options.query,
        orientation: options.orientation,
      },
    });

    const data = response.data;

    // Handle single random photo (array if count param used, but here generic assumes one)
    const photo = Array.isArray(data) ? data[0] : data;

    // Construct resized URL
    // Unsplash uses Imgix. We can append parameters.
    const baseUrl = photo.urls.raw;
    const sizeParams = new URLSearchParams();
    if (options.height || options.width) {
      sizeParams.append("fit", "crop");
      sizeParams.append("crop", "entropy");
    }
    if (options.width) sizeParams.append("w", options.width.toString());
    if (options.height) sizeParams.append("h", options.height.toString());
    if (options.quality) sizeParams.append("q", options.quality.toString());

    const finalUrl = `${baseUrl}&${sizeParams.toString()}`;

    return {
      url: finalUrl,
      width: options.width || photo.width,
      height: options.height || photo.height,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      originalUrl: photo.links.html, // Link to photo page
    };
  }
}
