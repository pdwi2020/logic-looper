import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      gzipSize: true,
      open: false,
    }),
    viteCompression({
      algorithm: 'gzip',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 50,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          animations: ['framer-motion'],
          state: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
