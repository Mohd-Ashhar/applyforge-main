// src/sentry.ts

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  
  // BrowserTracing is removed. Tracing is enabled by tracesSampleRate below.
  integrations: [
    Sentry.replayIntegration(),
  ],

  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  release: `applyforge@${__APP_VERSION__}`,
});