import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  plugins: [react(), viteCommonjs()],
  test: {
    // Configure Vitest options here
    globals: true,
    environment: 'jsdom'
  }
});
