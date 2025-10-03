import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

// Enhanced error reporting for production
const reportError = (error: Error, errorInfo?: any) => {
  if (process.env.NODE_ENV === "production") {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error("Global error:", error);
    // Example: Sentry.captureException(error, { extra: errorInfo });
  } else {
    console.error("Global error:", error, errorInfo);
  }
};

// Global error handlers
const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    reportError(new Error(`Unhandled promise rejection: ${event.reason}`), {
      type: "unhandledrejection",
      reason: event.reason,
      stack: event.reason?.stack,
    });

    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener("error", (event) => {
    reportError(event.error || new Error(event.message), {
      type: "javascript",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    });
  });

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener(
    "error",
    (event) => {
      if (event.target !== window && event.target instanceof HTMLElement) {
        reportError(
          new Error(`Resource failed to load: ${event.target.tagName}`),
          {
            type: "resource",
            element: event.target.tagName,
            source: (event.target as any).src || (event.target as any).href,
          }
        );
      }
    },
    true
  ); // Use capture phase to catch resource errors
};

// Performance monitoring
const setupPerformanceMonitoring = () => {
  // Web Vitals monitoring (Core Web Vitals)
  if ("web-vital" in window || process.env.NODE_ENV === "production") {
    // Lazy load web-vitals library
    import("web-vitals")
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        // **FIX: Removed onFID - it's deprecated and replaced by onINP**
        const sendToAnalytics = (metric: any) => {
          // Send to your analytics service
          if (process.env.NODE_ENV === "production") {
            // Example: gtag('event', metric.name, { value: metric.value });
            console.log("Web Vital:", metric);
          }
        };

        onCLS(sendToAnalytics);
        // onFID(sendToAnalytics); // **REMOVED - deprecated**
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
        onINP(sendToAnalytics); // This replaces FID
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });
  }

  // Memory usage monitoring
  if ("memory" in performance) {
    const logMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        console.warn("High memory usage detected:", {
          used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
        });
      }
    };

    // Check memory usage every 30 seconds in development
    if (process.env.NODE_ENV === "development") {
      setInterval(logMemoryUsage, 30000);
    }
  }
};

// Production optimizations
const setupProductionOptimizations = () => {
  if (process.env.NODE_ENV === "production") {
    // Disable console logs in production (except errors)
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;

    console.log = () => {}; // Disable console.log
    console.info = () => {}; // Disable console.info
    console.warn = (message: any, ...args: any[]) => {
      // Only show warnings in development or if they're critical
      if (
        message?.toString().includes("CRITICAL") ||
        message?.toString().includes("AUTH")
      ) {
        originalWarn(message, ...args);
      }
    };

    // Service Worker registration
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        "/fonts/inter-var.woff2", // Example font
        // Add other critical resources
      ];

      criticalResources.forEach((resource) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = resource;
        link.as = resource.endsWith(".woff2") ? "font" : "style";
        if (resource.endsWith(".woff2")) {
          link.crossOrigin = "anonymous";
        }
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
  }
};

// Development enhancements
const setupDevelopmentFeatures = () => {
  if (process.env.NODE_ENV === "development") {
    // React DevTools message
    console.log(
      "%c🚀 ApplyForge Development Mode",
      "color: #00D8FF; font-size: 16px; font-weight: bold;"
    );

    // Performance logging
    const logPerformance = () => {
      if (performance.navigation) {
        const loadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart;
        const domReady =
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart;

        console.log(
          `%c⚡ Performance Metrics:
        🕐 Page Load Time: ${loadTime}ms
        📄 DOM Ready: ${domReady}ms`,
          "color: #10B981; font-weight: bold;"
        );
      }
    };

    // Log performance after page load
    window.addEventListener("load", () => {
      setTimeout(logPerformance, 100);
    });

    // Auth Context debugging
    window.addEventListener("auth-state-change", (event: any) => {
      console.log(
        "%c🔐 Auth State Change:",
        "color: #F59E0B; font-weight: bold;",
        event.detail
      );
    });
  }
};

// Enhanced initialization
const initializeApp = async () => {
  try {
    // Setup all monitoring and error handling
    setupGlobalErrorHandlers();
    setupPerformanceMonitoring();
    setupProductionOptimizations();
    setupDevelopmentFeatures();

    // Get the root element
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error(
        "Root element not found! Make sure your HTML has a div with id='root'"
      );
    }

    // Create React root
    const root = createRoot(rootElement);

    // Render the app with enhanced error boundary
    const EnhancedApp = () => (
      <React.StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.StrictMode>
    );

    root.render(<EnhancedApp />);

    // App initialization complete
    if (process.env.NODE_ENV === "development") {
      console.log(
        "%c✅ ApplyForge initialized successfully!",
        "color: #10B981; font-weight: bold;"
      );
    }
  } catch (error) {
    // Critical initialization error
    reportError(error as Error, { context: "app-initialization" });

    // Show user-friendly error message
    document.body.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: #f8fafc;
        color: #1f2937;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #dc2626;">
          ApplyForge Failed to Start
        </h1>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; max-width: 600px; line-height: 1.6;">
          We're sorry, but something went wrong while loading ApplyForge. Please try refreshing the page.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #3b82f6; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            font-size: 1rem; 
            cursor: pointer;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.background='#2563eb'"
          onmouseout="this.style.background='#3b82f6'"
        >
          Refresh Page
        </button>
        <p style="margin-top: 2rem; font-size: 0.9rem; color: #6b7280;">
          If this problem persists, please contact our support team.
        </p>
      </div>
    `;
  }
};

// Start the application
initializeApp();
