import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth'
    ]
  },

  build: {
    sourcemap: true,
    // Increase chunk size warning limit (optional, but shows we're aware)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: (id) => {
          // Firebase in its own chunk
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
          // Chart libraries
          if (id.includes('node_modules/chart.js') ||
            id.includes('node_modules/lightweight-charts') ||
            id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'animations';
          }
          // Redux and state management
          if (id.includes('node_modules/@reduxjs') ||
            id.includes('node_modules/redux') ||
            id.includes('node_modules/react-redux')) {
            return 'redux';
          }
          // UI components and icons
          if (id.includes('node_modules/@heroicons')) {
            return 'icons';
          }
          // Other large vendor chunks
          if (id.includes('node_modules/axios') ||
            id.includes('node_modules/@msgpack')) {
            return 'network';
          }
        }
      }
    }
  }
});