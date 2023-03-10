import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['esm/index.js'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'aircode',
    'chatgpt',
  ],
  noExternal: [
    'lodash.throttle',
    '@larksuiteoapi/node-sdk',
  ],
  outDir: 'dist',
  format: 'cjs',
});
