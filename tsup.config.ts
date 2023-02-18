import { join } from 'path';
import { copyFile } from 'fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: [
    'chatgpt',
    'lodash.throttle',
    '@larksuiteoapi/node-sdk',
  ],
  async onSuccess() {
    const gpt3encoderDir = join(__dirname, 'node_modules/gpt-3-encoder');
    const encoderJson = join(gpt3encoderDir, 'encoder.json');
    const vocabBpe = join(gpt3encoderDir, 'vocab.bpe');
    await copyFile(encoderJson, join(__dirname, 'dist/encoder.json'));
    await copyFile(vocabBpe, join(__dirname, 'dist/vocab.bpe'));
  },
});
