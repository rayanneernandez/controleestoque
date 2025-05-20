import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/sistema-controle-estoque/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});