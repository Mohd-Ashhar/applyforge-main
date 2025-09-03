// src/global.d.ts

export {};

declare global {
  interface Window {
    Sentry?: {
      captureException: (
        error: any,
        options?: {
          tags?: Record<string, string | number | boolean>;
        }
      ) => void;
      // You can add other Sentry methods here if you use them
    };
  }
}