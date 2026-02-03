# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
