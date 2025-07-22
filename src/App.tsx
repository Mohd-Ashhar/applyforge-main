import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tailored-resumes" element={<TailoredResumes />} />
            <Route
              path="/cover-letter-generator"
              element={<CoverLetterGenerator />}
            />
            <Route
              path="/saved-cover-letters"
              element={<SavedCoverLetters />}
            />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/ats-checker" element={<ATSChecker />} />
            <Route path="/ai-resume-tailor" element={<AIResumeTailor />} />
            <Route path="/job-finder" element={<JobFinder />} />
            <Route path="/job-results" element={<JobResults />} />
            <Route
              path="/one-click-tailoring"
              element={<OneClickTailoring />}
            />
            <Route path="/auto-apply-agent" element={<AutoApplyAgent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
