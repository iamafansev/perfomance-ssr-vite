import path from 'path';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import webfontDownload from 'vite-plugin-webfont-dl';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  appType: 'custom',
  build: {
    outDir: './dist',
    assetsDir: './assets',
    manifest: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    middlewareMode: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  plugins: [
    webfontDownload([], { injectAsStyleTag: false, async: false }),
    imagetools(),
    svgr(),
    react(),
  ],
  resolve: {
    alias: {
      client: path.resolve(__dirname, './src/client'),
      server: path.resolve(__dirname, './src/server'),
    },
  },
});
