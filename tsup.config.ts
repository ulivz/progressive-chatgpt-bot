import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['esm/index.js'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: [
    'lodash.throttle',
    '@larksuiteoapi/node-sdk',
  ],
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
  format: 'cjs',
});
