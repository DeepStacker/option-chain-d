import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
        }
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://127.0.0.1:10001/api'),
    ...Object.keys(process.env)
      .filter(key => key.startsWith('VITE_FIREBASE_'))
      .reduce((obj, key) => {
        obj[`import.meta.env.${key}`] = JSON.stringify(process.env[key]);
        return obj;
      }, {})
  }
});