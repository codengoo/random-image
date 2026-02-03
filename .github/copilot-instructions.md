# Copilot Instructions for random-image

## Project Overview

A TypeScript library for fetching random images from multiple providers (Unsplash, Pexels, Pixabay) with built-in download capabilities and CLI support. Dual-format NPM package supporting both CommonJS and ESM, with a command-line interface for quick image fetching.

## Build, Test, and Lint Commands

### Build
```bash
npm run build        # Build with tsup (outputs to dist/)
npm run dev          # Watch mode for development
```

The build process creates:
- Library files: `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts` (types)
- CLI binary: `dist/cli.js` (ESM with shebang)

### Test
```bash
npm test             # Run all tests with vitest
npx vitest run       # Run tests once (CI mode)
npx vitest <file>    # Run specific test file
```

### Lint
```bash
npm run lint         # Type check with tsc --noEmit (no output files)
```

### CLI Usage (Local Testing)
```bash
npm run build        # Build first
node dist/cli.js fetch --query "nature" --download
```

## Architecture

### Provider Pattern
The library uses a **provider pattern** where each image service (Unsplash, Pexels, Pixabay) implements the `ImageProvider` interface. This allows adding new image services without modifying the core `RandomImage` class.

- **Core class**: `RandomImage` - Accepts any `ImageProvider` in constructor
- **Provider interface**: `ImageProvider` - Single method `fetchRandomImage(options)`
- **Concrete providers**: `UnsplashProvider`, `PexelsProvider`, `PixabayProvider`

Each provider:
1. Takes an API key in constructor
2. Transforms service-specific API responses into the common `ImageResult` format
3. Handles URL construction with size/quality parameters specific to that service

### CLI Architecture
- **Entry point**: `src/cli.ts` - Built as standalone ESM file with Node.js shebang
- **Argument parsing**: Uses `commander` library for CLI flags and commands
- **Provider selection**: Supports explicit provider choice or random selection from available API keys
- **Environment variables**: Reads API keys from `UNSPLASH_KEY`, `PEXELS_KEY`, `PIXABAY_KEY`
- **Random mode**: When `--provider random` or no provider specified, randomly selects from providers with configured API keys

### File Structure
```
src/
  ├── index.ts                # Exports all public APIs
  ├── types.ts                # Interface definitions (shared contracts)
  ├── image-fetcher.ts        # RandomImage class (core functionality)
  ├── cli.ts                  # CLI entry point with commander setup
  └── providers/              # Service-specific implementations
      ├── unsplash.ts         # Unsplash API integration
      ├── pexels.ts           # Pexels API integration
      └── pixabay.ts          # Pixabay API integration
```

### Download Architecture
The `download()` method in `RandomImage`:
- Uses axios with `responseType: 'stream'` for memory-efficient downloads
- Implements filename resolution priority: custom filename > keepOriginalName > UUID
- Handles cleanup of partial downloads on error
- Creates destination directories automatically

## Key Conventions

### API Key Handling
- **Library**: Providers require API keys passed to constructors (not exposed in public interface)
- **CLI**: API keys read from environment variables (`UNSPLASH_KEY`, `PEXELS_KEY`, `PIXABAY_KEY`)
- **Tests**: Use `.env` file with `dotenv` for credentials
- **Random provider selection**: CLI checks which API keys are available and randomly selects one

### Provider-Specific Randomization
Each provider handles "random" differently:
- **Unsplash**: Native `/photos/random` endpoint
- **Pexels**: Random page number (1-100) from search/curated results
- **Pixabay**: Fetches 20 results, picks one randomly client-side

### URL Parameter Handling
Providers append size/quality params to image URLs differently:
- **Unsplash**: Uses Imgix params (`w`, `h`, `q`, `fit=crop`, `crop=entropy`)
- **Pexels**: Uses query params (`w`, `h`, `auto=compress`, `cs=tinysrgb`)
- **Pixabay**: Returns pre-sized URLs (`largeImageURL` or `webformatURL`)

### Type Safety
- All interfaces defined in `types.ts` for shared contracts
- Provider implementations must strictly conform to `ImageProvider` interface
- `ImageResult` normalizes different provider response shapes

### Test Practices
- Integration tests in `tests/` directory use `.skip` for tests requiring API keys
- Remove `.skip` and set env vars to run provider-specific tests
- Tests validate both image fetching and download functionality

### Package Distribution
- Built as dual-format package (CJS + ESM) via tsup
- Entry point: `src/index.ts`
- CLI entry point: `src/cli.ts` (built separately with shebang banner)
- Outputs: 
  - Library: `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts` (types)
  - CLI: `dist/cli.js` (ESM with `#!/usr/bin/env node`)
- Only `dist/` folder is published to npm (see `files` in package.json)
- `bin` field in package.json points to `dist/cli.js` for `npx` usage

### CLI Conventions
- All flags mirror library options (e.g., `--query` → `options.query`)
- Download path defaults to `./downloads` if `--download` flag present without value
- `--provider random` or omitting `--provider` enables random provider selection
- Exit codes: 0 for success, 1 for errors
- User-friendly console output with ✓ symbols for success messages

## Error Handling
- Download method throws on existing files unless `overwrite: true`
- Providers throw on no results found
- Partial downloads are cleaned up automatically on stream errors
- CLI displays user-friendly error messages and exits with code 1
