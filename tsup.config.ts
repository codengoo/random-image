import { defineConfig } from 'tsup'

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
  },
  // CLI build
  {
    entry: ['src/cli.ts'],
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: false,
    outDir: 'dist',
  },
])
