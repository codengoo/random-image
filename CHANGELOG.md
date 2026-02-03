# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-03

### Added
- **CLI support**: Now available as a command-line tool via `npx random-image`
- `fetch` command to fetch random images from the command line
- CLI flags:
  - `--query`: Search query for images
  - `--width`, `--height`: Image dimensions
  - `--quality`: Image quality (0-100)
  - `--orientation`: Image orientation (landscape/portrait)
  - `--provider`: Choose provider (unsplash, pexels, pixabay, or random)
  - `--download`: Download the image to a directory
  - `--filename`: Custom filename for downloads
  - `--overwrite`: Overwrite existing files
  - `--no-keep-original-name`: Generate random UUID filename
- Random provider selection: If no provider specified, randomly selects from available API keys
- Environment variable support for API keys (`UNSPLASH_KEY`, `PEXELS_KEY`, `PIXABAY_KEY`)
- `commander` dependency for CLI argument parsing

### Changed
- Package now includes a `bin` entry point for CLI usage
- Build process now generates both library and CLI outputs
- Package description updated to reflect CLI capabilities

## [1.1.0] - 2026-02-03

### Added
- New `download()` method to download images to a specified directory
- `DownloadOptions` interface for flexible download configuration
  - `filename`: Custom filename for downloaded images
  - `overwrite`: Option to overwrite existing files
  - `keepOriginalName`: Control filename generation (original from URL or random UUID)
- Automatic directory creation if destination path doesn't exist
- Smart filename generation:
  - Extract original filename from URL (default)
  - Generate random UUID-based filename when `keepOriginalName: false`
  - Custom filename support with highest priority
- File extension auto-detection and fallback to .jpg
- Redirect handling (up to 5 redirects)
- Overwrite protection to prevent accidental file replacement

### Changed
- Download functionality uses axios with stream support for efficient file downloads
- Improved error handling for download operations

## [1.0.2] - Previous release

Initial stable release with basic random image fetching functionality.
