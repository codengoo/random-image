# random-image

A generic utility library to fetch random images from various providers like Unsplash and Pexels, with built-in download capabilities and CLI support.

## Installation

```bash
npm install @nghiavuive/random-image
```

## CLI Usage

You can use the CLI without installation via `npx`:

```bash
npx @nghiavuive/random-image fetch --query "nature" --download
```

Or install globally:

```bash
npm install -g @nghiavuive/random-image
random-image fetch --query "mountains" --download
```

### CLI Setup

Set environment variables for the providers you want to use:

```bash
export UNSPLASH_KEY="your_unsplash_access_key"
export PEXELS_KEY="your_pexels_api_key"
export PIXABAY_KEY="your_pixabay_api_key"
```

Or create a `.env` file in your project:

```env
UNSPLASH_KEY=your_unsplash_access_key
PEXELS_KEY=your_pexels_api_key
PIXABAY_KEY=your_pixabay_api_key
```

### CLI Commands

#### Fetch Command

```bash
# Basic usage - uses random provider from available API keys
random-image fetch

# Fetch with search query
random-image fetch --query "nature"

# Fetch and download
random-image fetch --query "mountains" --download

# Specify provider
random-image fetch --provider unsplash --query "ocean"

# Custom dimensions
random-image fetch --width 1920 --height 1080 --query "sunset"

# Download to custom directory
random-image fetch --query "cats" --download ./my-images

# Download with custom filename
random-image fetch --query "dogs" --download --filename "my-dog.jpg"

# Download with overwrite
random-image fetch --download --overwrite

# Generate random UUID filename
random-image fetch --download --no-keep-original-name

# Full example with all options
random-image fetch \
  --provider pexels \
  --query "abstract art" \
  --width 2560 \
  --height 1440 \
  --orientation landscape \
  --download ./wallpapers \
  --filename "wallpaper.jpg" \
  --overwrite
```

#### CLI Flags

- `-q, --query <search>`: Search query for the image
- `-w, --width <number>`: Width of the image
- `-h, --height <number>`: Height of the image
- `--quality <number>`: Quality of the image (0-100)
- `--orientation <type>`: Image orientation (`landscape` or `portrait`)
- `-p, --provider <name>`: Provider to use (`unsplash`, `pexels`, `pixabay`, or `random`)
- `-d, --download [path]`: Download the image (default: `./downloads`)
- `--filename <name>`: Custom filename for downloaded image
- `--overwrite`: Overwrite existing files
- `--no-keep-original-name`: Generate random UUID filename instead of keeping original

**Random Provider Mode**: If you don't specify `--provider` or use `--provider random`, the CLI will randomly select from providers that have API keys configured. This is useful for distributing requests across multiple services.

## Programmatic Usage

You need to obtain API keys from the respective providers:
- [Unsplash Developers](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)

### Basic Usage - Fetching Random Images

```typescript
import { RandomImage, UnsplashProvider, PexelsProvider } from '@nghiavuive/random-image';

// Using Unsplash
const unsplash = new UnsplashProvider('YOUR_UNSPLASH_ACCESS_KEY');
const fetcher = new RandomImage(unsplash);

const image = await fetcher.getRandom({
    width: 1920,
    height: 1080,
    query: 'nature'
});

console.log(image.url); // URL to the image
console.log(image.author); // Photographer's name

// Using Pexels
const pexels = new PexelsProvider('YOUR_PEXELS_API_KEY');
const pexelsFetcher = new RandomImage(pexels);

const pexelsImage = await pexelsFetcher.getRandom({
    width: 800,
    height: 600,
    query: 'cats'
});

console.log(pexelsImage.url);
```

### Downloading Images

The library now supports downloading images directly to your local filesystem:

```typescript
import { RandomImage, UnsplashProvider } from '@nghiavuive/random-image';

const provider = new UnsplashProvider('YOUR_API_KEY');
const fetcher = new RandomImage(provider);

// Fetch and download a random image
const image = await fetcher.getRandom({ query: 'mountains' });

// Download with auto-generated filename
const filePath = await fetcher.download(image, './downloads');
console.log(`Image saved to: ${filePath}`);

// Download with custom filename
const customPath = await fetcher.download(
    image, 
    './downloads',
    { filename: 'my-mountain.jpg' }
);

// Download with overwrite option
const overwritePath = await fetcher.download(
    image,
    './downloads',
    { 
        filename: 'mountain.jpg',
        overwrite: true  // Will replace existing file
    }
);

// Download directly from URL
await fetcher.download(
    'https://example.com/image.jpg',
    './downloads',
    { filename: 'direct-download.jpg' }
);

// Download with UUID-based random filename
await fetcher.download(
    image,
    './downloads',
    { keepOriginalName: false }
);

// Download keeping original filename (default behavior)
await fetcher.download(
    image,
    './downloads',
    { keepOriginalName: true }
);
```

## API

### `RandomImage`
The main class to interact with.

```typescript
class RandomImage {
    constructor(provider: ImageProvider);
    
    // Fetch a random image
    getRandom(options: ImageOptions): Promise<ImageResult>;
    
    // Download an image to local filesystem
    download(
        imageUrl: string | ImageResult,
        destinationPath: string,
        options?: DownloadOptions
    ): Promise<string>;
}
```

### `ImageOptions`
Configuration for fetching random images:
- `width` (number, optional): Desired width of the image.
- `height` (number, optional): Desired height of the image.
- `quality` (number, optional): Quality (0-100) if supported by provider.
- `query` (string, optional): Search query (e.g. "nature", "city").
- `orientation` ("landscape" | "portrait", optional): Image orientation.

### `DownloadOptions`
Configuration for downloading images:
- `filename` (string, optional): Custom filename for the downloaded image. If provided, this takes precedence over `keepOriginalName`.
- `overwrite` (boolean, optional): Whether to overwrite existing files. Default is `false`. If `false` and file exists, an error will be thrown.
- `keepOriginalName` (boolean, optional): Controls filename generation when `filename` is not provided:
  - `true` or `undefined` (default): Extract and use the original filename from the URL
  - `false`: Generate a random UUID-based filename

### `ImageResult`
Result object containing image information:
- `url` (string): Direct URL to the image.
- `width` (number): Width of the image.
- `height` (number): Height of the image.
- `author` (string): Name of the photographer.
- `authorUrl` (string, optional): URL to photographer's profile.
- `originalUrl` (string): URL to the original photo page.

## Features

### CLI Features
- ✅ Command-line interface for quick image fetching
- ✅ Random provider selection when multiple API keys are available
- ✅ Environment variable support for API keys
- ✅ Direct download from command line
- ✅ All library features available via CLI flags

### Library Features

### Download Functionality
- ✅ Flexible filename options:
  - Custom filename
  - Keep original filename from URL (default)
  - Generate random UUID-based filename
- ✅ Overwrite protection
- ✅ Automatic file extension detection
- ✅ Support for both HTTP and HTTPS
- ✅ Automatic redirect handling (up to 5 redirects)
- ✅ Stream-based downloading for memory efficiency
- ✅ Error handling with cleanup of partial downloads

## Supported Providers

- **Unsplash**: High-quality photos with attribution
- **Pexels**: Free stock photos and videos
- **Pixabay**: Free images and videos

## License

ISC

