// vite.config.js
const defineConfig = require('vite').defineConfig;

module.exports = defineConfig({
  // ... other options
  server: {
    hmr: {
      protocol: 'ws', // use 'wss' if you are using HTTPS
    },
    // ... other server options
  },
  // ... other options
});
