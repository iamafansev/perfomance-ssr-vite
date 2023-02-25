import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  appType: 'custom',
  build: {
    outDir: './dist',
    assetsDir: './assets',
    manifest: true,
    rollupOptions: {
      input: 'src/index.tsx',
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
  plugins: [react()],
});
