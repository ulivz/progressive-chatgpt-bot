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
  format: 'esm',
});
