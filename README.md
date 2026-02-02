# random-image

A generic utility library to fetch random images from various providers like Unsplash and Pexels.

## Installation

```bash
npm install random-image
```

## Usage

You need to obtain API keys from the respective providers:
- [Unsplash Developers](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)

```typescript
import { RandomImage, UnsplashProvider, PexelsProvider } from 'random-image';

// Using Unsplash
const unsplash = new UnsplashProvider('YOUR_UNSPLASH_ACCESS_KEY');
const fetcher = new RandomImage(unsplash);

fetcher.getRandom({
    width: 1920,
    height: 1080,
    query: 'nature'
}).then(image => {
    console.log(image.url); // URL to the image
    console.log(image.author); // Photographer's name
});

// Using Pexels
const pexels = new PexelsProvider('YOUR_PEXELS_API_KEY');
const pexelsFetcher = new RandomImage(pexels);

pexelsFetcher.getRandom({
    width: 800,
    height: 600,
    query: 'cats'
}).then(image => {
    console.log(image.url);
});
```

## API

### `RandomImage`
The main class to interact with.

```typescript
class RandomImage {
    constructor(provider: ImageProvider);
    getRandom(options: ImageOptions): Promise<ImageResult>;
}
```

### `ImageOptions`
- `width` (number): Desired width of the image.
- `height` (number): Desired height of the image.
- `quality` (number): Quality (0-100) if supported.
- `query` (string): Search query (e.g. "nature", "city").

### `ImageResult`
- `url` (string): Direct URL to the image.
- `width` (number): Width of the image.
- `height` (number): Height of the image.
- `author` (string): Name of the photographer.
- `authorUrl` (string): URL to photographer's profile.
- `originalUrl` (string): URL to the original photo page.

## License

ISC
