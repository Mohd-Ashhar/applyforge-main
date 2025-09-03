// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';
import { readFileSync } from 'fs';

// Read package.json to get the version for Sentry releases
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
);

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),

    // Sentry plugin for source map uploads
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'your-org-slug', // Replace with your Sentry organization slug
      project: 'applyforge',
      release: {
        name: `applyforge@${packageJson.version}`,
        deploy: {
          env: 'production'
        }
      },
     sourcemaps: {
  assets: './dist/**',// New, correct name
}
    })
  ],

  // Defines __APP_VERSION__ for use in your Sentry init script
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },

  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },

  build: {
    sourcemap: true, // Required for Sentry to map errors
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          auth: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1_000
  },

  server: { port: 8080, host: true },
  preview: { port: 8080, host: true }
}));
