// src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  MODE: string;
  // Add other env variables here if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Also declare the app version global variable
declare const __APP_VERSION__: string;