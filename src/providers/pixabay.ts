import axios from "axios";
import { ImageProvider, ImageOptions, ImageResult } from "../types";

export class PixabayProvider implements ImageProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchRandomImage(options: ImageOptions): Promise<ImageResult> {
    const params: any = {
      key: this.apiKey,
      q: options.query || "",
      per_page: 20, // Fetch a few to pick randomly
    };

    if (options.orientation) {
      params.orientation =
        options.orientation === "portrait" ? "vertical" : "horizontal";
    }

    const response = await axios.get("https://pixabay.com/api/", {
      params,
    });

    const hits = response.data.hits;

    if (!hits || hits.length === 0) {
      throw new Error("No images found");
    }

    // Pick a random hit
    const randomHit = hits[Math.floor(Math.random() * hits.length)];

    return {
      url: randomHit.largeImageURL || randomHit.webformatURL,
      width: randomHit.imageWidth || randomHit.webformatWidth,
      height: randomHit.imageHeight || randomHit.webformatHeight,
      author: randomHit.user,
      authorUrl: `https://pixabay.com/users/${randomHit.user}-${randomHit.user_id}/`,
      originalUrl: randomHit.pageURL,
    };
  }
}
