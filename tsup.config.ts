import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  format: ['cjs', 'esm', "iife"],
  outDir: 'dist',
});
