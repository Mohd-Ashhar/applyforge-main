import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React from "react";

// **FIXED: Dashboard import path**
import Dashboard from "./pages/Dashboard"; // Fixed spelling
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TailoredResumes from "./pages/TailoredResumes";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import SavedCoverLetters from "./pages/SavedCoverLetters";
import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import Feedback from "./pages/Feedback";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ATSChecker from "./pages/ATSChecker";
import AIResumeTailor from "./pages/AIResumeTailor";
import JobFinder from "./pages/JobFinder";
import JobResults from "./pages/JobResults";
import OneClickTailoring from "./pages/OneClickTailoring";
import AutoApplyAgent from "./pages/AutoApplyAgent";

const queryClient = new QueryClient();

// **FIXED: Removed isLoading from useAuth destructuring**
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // **UPDATED: Use user === undefined to represent loading state**
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // **UPDATED: Use !user (null or false) to represent unauthenticated**
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// **FIXED: Removed isLoading from useAuth destructuring**
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // **UPDATED: Use user === undefined to represent loading state**
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // **UPDATED: Use user (truthy) to represent authenticated**
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// **ROUTES COMPONENT**
const AppRoutes = () => {
  return (
    <Routes>
      {/* **DASHBOARD - Protected route for authenticated users** */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* **LANDING PAGE - Public route for non-authenticated users** */}
      <Route
        path="/landing"
        element={
          <PublicRoute>
            <Index />
          </PublicRoute>
        }
      />

      {/* **AUTH PAGE - Public route, redirects if already authenticated** */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      {/* **ALL FEATURE PAGES - Protected routes** */}
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

      {/* **PUBLIC ROUTES** */}
      <Route path="/pricing" element={<Pricing />} />

      {/* **404 PAGE** */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
