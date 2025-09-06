// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Strategy to update the service worker
      registerType: 'autoUpdate',
      
      // Enables the service worker during development for testing
      devOptions: {
        enabled: true
      },

      // Caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        // Exclude vercel.json from precaching as it's a server config file
        globIgnores: ['**/vercel.json'],
      },

      // PWA Manifest
      manifest: {
        name: 'ApplyForge',
        short_name: 'ApplyForge',
        description: 'AI-powered tools to streamline your job application process.',
        theme_color: '#18181b', // A dark theme color to match a modern UI
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});