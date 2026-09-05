import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false, // Ensure source maps are never generated or exposed to the public
    minify: true,
    cssMinify: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('canvas-confetti') || id.includes('dompurify') || id.includes('html2canvas')) {
              return 'vendor-utils';
            }
            return 'vendor-core';
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    watch: {
      ignored: ['**/backend/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  }
});
