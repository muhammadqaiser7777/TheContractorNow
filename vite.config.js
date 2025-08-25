import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ensures correct asset paths
  plugins: [react()],
  server: {
    historyApiFallback: true, // Ensure SPA routing works in local dev
  },
});
