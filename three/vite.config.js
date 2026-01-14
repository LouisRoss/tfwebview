import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    port: 5200,
    open: true,
    hmr: {
      protocol: 'ws', // use 'wss' if you are using HTTPS
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  base: "/"
});

