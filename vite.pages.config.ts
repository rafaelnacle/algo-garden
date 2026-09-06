import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

// The Pages build reuses the lab as a browser-only app, with no server runtime.
export default defineConfig({
  root: fileURLToPath(new URL('./static', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  base: process.env.PAGES_BASE_PATH ? `${process.env.PAGES_BASE_PATH}/` : '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  build: {
    outDir: '../dist/pages',
    emptyOutDir: true,
  },
});
