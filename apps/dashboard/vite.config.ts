import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [
    react(),
    qiankun('dashboard', { useDevMode: true }),
  ],
  server: {
    port: 3003,
    strictPort: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hmr: false,
  },
});