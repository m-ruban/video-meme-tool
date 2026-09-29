import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: false,
    minify: 'esbuild',

    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://video-meme.fun/',
        changeOrigin: true,
      },
      '^.*\\.(mp4|png|webp|jpg)$': {
        target: 'http://video-meme.fun',
        changeOrigin: true,
      },
    },
  },
});
