import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnsplashProvider } from '../src/providers/unsplash';
import { PexelsProvider } from '../src/providers/pexels';
import { RandomImage } from '../src/image-fetcher';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('UnsplashProvider', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should fetch random image from Unsplash', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        urls: { raw: 'https://images.unsplash.com/photo-123' },
        width: 1000,
        height: 800,
        user: { name: 'John Doe', links: { html: 'https://unsplash.com/@john' } },
        links: { html: 'https://unsplash.com/photos/123' }
      })
    });

    const provider = new UnsplashProvider('test-key');
    const result = await provider.fetchRandomImage({ width: 800, height: 600 });

    expect(result.url).toContain('w=800');
    expect(result.url).toContain('h=600');
    expect(result.author).toBe('John Doe');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://api.unsplash.com/photos/random'),
      expect.objectContaining({
        headers: { Authorization: 'Client-ID test-key' }
      })
    );
  });
});

describe('PexelsProvider', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should fetch random image from Pexels', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        photos: [{
          src: { original: 'https://images.pexels.com/photos/123/original.jpg' },
          width: 1000,
          height: 800,
          photographer: 'Jane Doe',
          photographer_url: 'https://pexels.com/@jane',
          url: 'https://pexels.com/photo/123'
        }]
      })
    });

    const provider = new PexelsProvider('test-key');
    const result = await provider.fetchRandomImage({ width: 800, height: 600 });

    expect(result.url).toContain('w=800');
    expect(result.url).toContain('h=600');
    expect(result.author).toBe('Jane Doe');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://api.pexels.com/v1/curated'),
      expect.objectContaining({
        headers: { Authorization: 'test-key' }
      })
    );
  });
});

describe('RandomImage', () => {
  it('should use the provided provider', async () => {
    const mockProvider = {
      fetchRandomImage: vi.fn().mockResolvedValue({
        url: 'test-url',
        width: 100,
        height: 100,
        author: 'Me', 
        originalUrl: 'orig-url'
      })
    };

    const fetcher = new RandomImage(mockProvider);
    const result = await fetcher.getRandom({ width: 100 });

    expect(mockProvider.fetchRandomImage).toHaveBeenCalledWith({ width: 100 });
    expect(result.url).toBe('test-url');
  });
});
