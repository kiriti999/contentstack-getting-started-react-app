import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const suppressCSSImportWarnings = (): Plugin => ({
  name: 'suppress-css-import-warnings',
  configureServer() {
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const msg = args[0]?.toString() || '';
      if (msg.includes('@import must precede')) {
        return;
      }
      originalWarn.apply(console, args);
    };
  },
});

export default defineConfig({
  plugins: [
    react(),
    suppressCSSImportWarnings(),
  ],
  
  server: {
    port: 3000,
    open: true,
  },
  
  build: {
    outDir: 'build',
  },
  logLevel: 'info',
});
