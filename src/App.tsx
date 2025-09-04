import React, { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TailoredResumes = lazy(() => import("./pages/TailoredResumes"));
const CoverLetterGenerator = lazy(() => import("./pages/CoverLetterGenerator"));
const SavedCoverLetters = lazy(() => import("./pages/SavedCoverLetters"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs"));
const PlanUsage = lazy(() => import("./pages/PlanUsage"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Pricing = lazy(() => import("./pages/Pricing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ATSChecker = lazy(() => import("./pages/ATSChecker"));
const AIResumeTailor = lazy(() => import("./pages/AIResumeTailor"));
const JobFinder = lazy(() => import("./pages/JobFinder"));
const JobResults = lazy(() => import("./pages/JobResults"));
const OneClickTailoring = lazy(() => import("./pages/OneClickTailoring"));
const AutoApplyAgent = lazy(() => import("./pages/AutoApplyAgent"));

const ErrorFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-lg">Something went wrong 😕</p>
  </div>
);

// Enhanced QueryClient configuration for production
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: data is considered stale after 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache time: data stays in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times with exponential backoff
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus in production
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        // Background refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        retryDelay: 1000,
      },
    },
    // **FIX 1: Correct mutationCache configuration**
    mutationCache: new MutationCache({
      onError: (error: unknown) => {
        // Log mutation errors to error reporting service
        if (process.env.NODE_ENV === "production") {
          // Example: errorReportingService.captureException(error);
          console.error("Mutation error:", error);
        } else {
          console.error("Mutation error:", error);
        }
      },
    }),
    // **FIX 2: Correct queryCache configuration**
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        // Log query errors to error reporting service
        if (process.env.NODE_ENV === "production") {
          // Example: errorReportingService.captureException(error);
          console.error("Query error:", error);
        } else {
          console.error("Query error:", error);
        }
      },
    }),
  });
};

// Centralized loading spinner component
const LoadingSpinner = ({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}
        />
        <p className="text-sm text-muted-foreground">Loading ApplyForge...</p>
      </div>
    </div>
  );
};

// Enhanced route loading component
const RouteLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Enhanced protected route with better error handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate to="/auth" replace state={{ from: window.location.pathname }} />
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with this page.</div>}>
      {children}
    </ErrorBoundary>
  );
};

// Enhanced public route with better error handling
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with this page.</div>}>
      {children}
    </ErrorBoundary>
  );
};

// Semi-protected route (accessible both authenticated and unauthenticated)
const SemiProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with this page.</div>}>
      {children}
    </ErrorBoundary>
  );
};

// Auth-aware route (for callback routes that need auth context)
const AuthAwareRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong during authentication.</div>}
    >
      {children}
    </ErrorBoundary>
  );
};

// Enhanced routes configuration for better maintainability
const protectedRoutes = [
  { path: "/", component: Dashboard },
  { path: "/tailored-resumes", component: TailoredResumes },
  { path: "/cover-letter-generator", component: CoverLetterGenerator },
  { path: "/saved-cover-letters", component: SavedCoverLetters },
  { path: "/saved-jobs", component: SavedJobs },
  { path: "/applied-jobs", component: AppliedJobs },
  { path: "/plan-usage", component: PlanUsage },
  { path: "/feedback", component: Feedback },
  { path: "/ats-checker", component: ATSChecker },
  { path: "/ai-resume-tailor", component: AIResumeTailor },
  { path: "/job-finder", component: JobFinder },
  { path: "/job-results", component: JobResults },
  { path: "/one-click-tailoring", component: OneClickTailoring },
  { path: "/auto-apply-agent", component: AutoApplyAgent },
];

const publicRoutes = [
  { path: "/landing", component: Index },
  { path: "/auth", component: Auth },
];

const authRoutes = [
  { path: "/auth/callback", component: AuthCallback },
  { path: "/auth/reset-password", component: ResetPassword },
];

const semiProtectedRoutes = [{ path: "/pricing", component: Pricing }];

// Main routes component
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <Routes>
      {/* Public Routes - accessible without authentication */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected Routes - require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tailored-resumes"
        element={
          <ProtectedRoute>
            <TailoredResumes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter-generator"
        element={
          <ProtectedRoute>
            <CoverLetterGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-cover-letters"
        element={
          <ProtectedRoute>
            <SavedCoverLetters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applied-jobs"
        element={
          <ProtectedRoute>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan-usage"
        element={
          <ProtectedRoute>
            <PlanUsage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats-checker"
        element={
          <ProtectedRoute>
            <ATSChecker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-resume-tailor"
        element={
          <ProtectedRoute>
            <AIResumeTailor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-finder"
        element={
          <ProtectedRoute>
            <JobFinder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-results"
        element={
          <ProtectedRoute>
            <JobResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/one-click-tailoring"
        element={
          <ProtectedRoute>
            <OneClickTailoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auto-apply-agent"
        element={
          <ProtectedRoute>
            <AutoApplyAgent />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = createQueryClient();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              Please refresh the page or contact support if the problem
              persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Sonner
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <AppRoutes />
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
            {/* React Query Devtools - only in development */}
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            )}
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
