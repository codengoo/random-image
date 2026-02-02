export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number; // 0-100
  query?: string;
}

export interface ImageResult {
  url: string;
  width: number;
  height: number;
  author: string;
  authorUrl?: string;
  originalUrl: string;
}

export interface ImageProvider {
  fetchRandomImage(options: ImageOptions): Promise<ImageResult>;
}
