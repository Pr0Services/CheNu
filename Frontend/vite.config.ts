import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web/src'),
      '@core': path.resolve(__dirname, './apps/web/src/core'),
      '@components': path.resolve(__dirname, './apps/web/src/components'),
      '@pages': path.resolve(__dirname, './apps/web/src/pages'),
      '@hooks': path.resolve(__dirname, './apps/web/src/hooks'),
      '@services': path.resolve(__dirname, './apps/web/src/services'),
      '@stores': path.resolve(__dirname, './apps/web/src/stores'),
      '@types': path.resolve(__dirname, './apps/web/src/types'),
      '@utils': path.resolve(__dirname, './apps/web/src/utils'),
      '@xr': path.resolve(__dirname, './apps/web/src/xr'),
      '@agents': path.resolve(__dirname, './apps/web/src/agents'),
      '@themes': path.resolve(__dirname, './apps/web/src/themes'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
