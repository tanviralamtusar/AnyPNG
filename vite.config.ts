import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'extension/inpaint',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
});
