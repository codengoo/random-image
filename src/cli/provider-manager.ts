import { UnsplashProvider, PexelsProvider, PixabayProvider, ImageProvider } from '../index.js';
import { displayError } from './display.js';

type ProviderName = 'unsplash' | 'pexels' | 'pixabay';

interface ProviderKeys {
  unsplash?: string;
  pexels?: string;
  pixabay?: string;
}

/**
 * Select a random provider from available ones
 */
export function selectRandomProvider(providers: ProviderKeys): ProviderName | null {
  const availableProviders = Object.entries(providers)
    .filter(([_, key]) => key)
    .map(([name]) => name as ProviderName);

  if (availableProviders.length === 0) {
    return null;
  }

  return availableProviders[Math.floor(Math.random() * availableProviders.length)];
}

/**
 * Create provider instance based on name and API key
 */
export function createProvider(providerName: ProviderName, apiKey: string): ImageProvider | null {
  switch (providerName) {
    case 'unsplash':
      return new UnsplashProvider(apiKey);
    case 'pexels':
      return new PexelsProvider(apiKey);
    case 'pixabay':
      return new PixabayProvider(apiKey);
    default:
      return null;
  }
}

/**
 * Validate and get provider with API key
 */
export function getProviderInstance(
  providerName: string,
  providers: ProviderKeys
): { provider: ImageProvider; name: ProviderName } | null {
  const name = providerName.toLowerCase() as ProviderName;
  const apiKey = providers[name];

  if (!apiKey) {
    displayError(`API key for ${providerName} not found.`);
    console.log(`Please set ${providerName.toUpperCase()}_KEY environment variable.\n`);
    return null;
  }

  const provider = createProvider(name, apiKey);
  if (!provider) {
    displayError(`Unknown provider "${providerName}"`);
    console.log('Available providers: unsplash, pexels, pixabay, random\n');
    return null;
  }

  return { provider, name };
}
