import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Briefcase,
  Building,
  ExternalLink,
  Search,
  FileText,
  Upload,
  Home,
  Eye,
  Share2,
  Loader2,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Heart,
  Star,
  Bot,
  Radar,
  Crown,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import { useUsageTracking } from "@/hooks/useUsageTracking";

interface JobResult {
  linkedin_apply_link: string;
  job_title: string;
  company_name: string;
  companyLinkedinUrl: string;
  location: string | string[]; // **MODIFIED**: Allow location to be a string or array of strings for robust searching
  created_at: string;
  apply_link: string;
  job_description: string;
  experience_level: string;
  job_type: string;
  jobFunction: string;
  industries: string;
  uniqueId: string;
}

interface GenerationStatus {
  resumeUrl?: string;
  coverLetterUrl?: string;
}

const DiscoveryAgentLoadingSkeleton = memo(() => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/20 rounded-xl border border-rose-500/30"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  className="h-5 sm:h-6 w-3/4 bg-slate-700/50 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="h-3 sm:h-4 w-1/2 bg-slate-700/50 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
            <motion.div
              className="w-16 sm:w-20 h-5 sm:h-6 bg-slate-700/50 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </div>
          <motion.div
            className="h-16 sm:h-20 w-full bg-slate-700/50 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((btnIndex) => (
              <motion.div
                key={btnIndex}
                className="h-8 sm:h-9 w-20 sm:w-24 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1 + btnIndex * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));
DiscoveryAgentLoadingSkeleton.displayName = "DiscoveryAgentLoadingSkeleton";

const DiscoveredJobCard = memo<{
  job: JobResult;
  index: number;
  onSaveJob: (job: JobResult) => void;
  onTailorResume: (job: JobResult) => void;
  onGenerateCoverLetter: (job: JobResult) => void;
  onAppliedChange: (job: JobResult, checked: boolean) => void;
  onShare: (job: JobResult) => void;
  onDislikeJob: (job: JobResult) => void;
  savedJobs: Set<string>;
  savingJobs: Set<string>;
  processingResume: Set<string>;
  processingCoverLetter: Set<string>;
  appliedJobs: Set<string>;
  applyingJobs: Set<string>;
  dislikingJobs: Set<string>;
  user: any;
  generationStatus: GenerationStatus;
  onViewOrDownload: (url: string, fileName: string) => void;
}>(
  ({
    job,
    index,
    onSaveJob,
    onTailorResume,
    onGenerateCoverLetter,
    onAppliedChange,
    onShare,
    onDislikeJob,
    savedJobs,
    savingJobs,
    processingResume,
    processingCoverLetter,
    appliedJobs,
    applyingJobs,
    dislikingJobs,
    user,
    generationStatus,
    onViewOrDownload,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPostedDate = useCallback((dateString: string) => {
      if (!dateString) return "Date unavailable";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      const now = new Date();
      const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
      if (diffSeconds < 60) return "Posted just now";
      const diffMinutes = Math.round(diffSeconds / 60);
      if (diffMinutes < 60) return `Posted ${diffMinutes}m ago`;
      const diffHours = Math.round(diffMinutes / 60);
      if (diffHours < 24) return `Posted ${diffHours}h ago`;
      const diffDays = Math.round(diffHours / 24);
      if (diffDays < 7) {
        if (diffDays === 0) return `Posted ${diffHours}h ago`;
        return `Posted ${diffDays}d ago`;
      }
      const diffWeeks = Math.round(diffDays / 7);
      return `Posted ${diffWeeks}w ago`;
    }, []);

    const getCompanyInitials = useCallback((companyName: string) => {
      return companyName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }, []);

    const truncateDescription = useCallback(
      (description: string, maxLength: number = 150) => {
        if (!description) return "";
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + "...";
      },
      []
    );

    // **FIXED**: Make location display robust
    const displayLocation = useMemo(() => {
      if (!job.location) return "Location Not Available";
      return Array.isArray(job.location)
        ? job.location.join(", ")
        : job.location;
    }, [job.location]);

    const isSaved = savedJobs.has(job.uniqueId);
    const isSaving = savingJobs.has(job.uniqueId);
    const isProcessingResume = processingResume.has(job.uniqueId);
    const isProcessingCoverLetter = processingCoverLetter.has(job.uniqueId);
    const isApplied = appliedJobs.has(job.uniqueId);
    const isApplying = applyingJobs.has(job.uniqueId);
    const isDisliking = dislikingJobs.has(job.uniqueId);

    const finalApplyLink = job.apply_link || job.linkedin_apply_link;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-rose-500/30 transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center font-semibold text-rose-400 border border-rose-500/30 flex-shrink-0"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs sm:text-sm">
                    {getCompanyInitials(job.company_name || "UN")}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-rose-400 transition-colors leading-tight mb-1 break-words line-clamp-2">
                    {job.job_title || "Job Title Not Available"}
                  </CardTitle>
                  <div className="flex items-center gap-2 min-w-0">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {job.company_name || "Company Name Not Available"}
                    </span>
                    {job.companyLinkedinUrl && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <a
                              href={job.companyLinkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View company LinkedIn</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onDislikeJob(job)}
                        disabled={isDisliking}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500"
                      >
                        {isDisliking ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Not interested</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onShare(job)}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-rose-400"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share discovery</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs whitespace-nowrap flex-shrink-0">
                    {formatPostedDate(job.created_at)}
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs whitespace-nowrap flex-shrink-0">
                    <Radar className="w-3 h-3 mr-1 flex-shrink-0" />
                    AI Discovered
                  </Badge>
                </div>
                {user && (
                  <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
                    <Checkbox
                      id={`applied-${job.uniqueId}`}
                      checked={isApplied}
                      onCheckedChange={(checked) =>
                        onAppliedChange(job, checked as boolean)
                      }
                      disabled={isApplying}
                      className="flex-shrink-0"
                    />
                    <label
                      htmlFor={`applied-${job.uniqueId}`}
                      className="text-xs font-medium leading-none cursor-pointer text-slate-400 whitespace-nowrap"
                    >
                      {isApplying ? "Processing..." : "Applied"}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-300 truncate">
                  {displayLocation}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-300 truncate">
                  {job.experience_level || "Experience Level Not Available"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {job.job_type && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {job.job_type}
                  </span>
                </Badge>
              )}
              {job.jobFunction && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    {job.jobFunction}
                  </span>
                </Badge>
              )}
              {job.industries && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {job.industries}
                  </span>
                </Badge>
              )}
            </div>
            {job.job_description && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400 flex-shrink-0" />
                  Opportunity Details
                </h4>
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <p
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-4"
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(
                        job.job_description
                          .replace(/&gt;/g, ">")
                          .replace(/&lt;/g, "<")
                      ),
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs whitespace-nowrap flex-shrink-0">
                <Bot className="w-3 h-3 mr-1 flex-shrink-0" />
                AI Matched
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs whitespace-nowrap flex-shrink-0">
                <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                Quality Verified
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs whitespace-nowrap flex-shrink-0">
                <Star className="w-3 h-3 mr-1 flex-shrink-0" />
                Top Match
              </Badge>
            </div>
            <div className="pt-2">
              <div className="hidden md:flex flex-wrap gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onSaveJob(job)}
                    disabled={isSaving}
                    size="sm"
                    className={
                      isSaved
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg border-0"
                        : "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-rose-500 hover:to-pink-500 hover:text-white border border-slate-600 shadow-md hover:border-rose-400"
                    }
                  >
                    {isSaved ? (
                      <>
                        <Heart className="w-4 h-4 mr-2 fill-current" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                      </>
                    )}
                  </Button>
                </motion.div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {generationStatus.resumeUrl ? (
                      <Button
                        onClick={() =>
                          onViewOrDownload(
                            generationStatus.resumeUrl,
                            `${job.company_name}_resume.pdf`
                          )
                        }
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onTailorResume(job)}
                        disabled={isProcessingResume}
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10"
                      >
                        {isProcessingResume ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        Tailor Resume
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {generationStatus.resumeUrl
                      ? "View your tailored resume"
                      : "Upload resume to tailor for this discovery"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {generationStatus.coverLetterUrl ? (
                      <Button
                        onClick={() =>
                          onViewOrDownload(
                            generationStatus.coverLetterUrl,
                            `${job.company_name}_cover_letter.pdf`
                          )
                        }
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Cover
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onGenerateCoverLetter(job)}
                        disabled={isProcessingCoverLetter}
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10"
                      >
                        {isProcessingCoverLetter ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Cover Letter
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {generationStatus.coverLetterUrl
                      ? "View your generated cover letter"
                      : "Generate cover letter for this discovery"}
                  </TooltipContent>
                </Tooltip>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                  >
                    <a
                      href={finalApplyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </motion.div>
              </div>
              <div className="md:hidden space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => onSaveJob(job)}
                      disabled={isSaving}
                      size="sm"
                      className={
                        isSaved
                          ? "w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg border-0 text-xs h-9"
                          : "w-full bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-rose-500 hover:to-pink-500 hover:text-white border border-slate-600 shadow-md text-xs h-9"
                      }
                    >
                      {isSaved ? (
                        <>
                          <Heart className="w-3 h-3 mr-1 fill-current flex-shrink-0" />
                          <span className="truncate">Saved</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {isSaving ? "Saving..." : "Save"}
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => onShare(job)}
                      size="sm"
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-9"
                    >
                      <Share2 className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Share</span>
                    </Button>
                    <Button
                      onClick={() => onDislikeJob(job)}
                      disabled={isDisliking}
                      size="sm"
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-red-500 text-xs h-9"
                    >
                      {isDisliking ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3 mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">Remove</span>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {generationStatus.resumeUrl ? (
                    <Button
                      onClick={() =>
                        onViewOrDownload(
                          generationStatus.resumeUrl,
                          `${job.company_name}_resume.pdf`
                        )
                      }
                      size="sm"
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10 text-xs h-9"
                    >
                      <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">View Resume</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onTailorResume(job)}
                      disabled={isProcessingResume}
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10 text-xs h-9"
                    >
                      {isProcessingResume ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                      ) : (
                        <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">Resume</span>
                    </Button>
                  )}
                  {generationStatus.coverLetterUrl ? (
                    <Button
                      onClick={() =>
                        onViewOrDownload(
                          generationStatus.coverLetterUrl,
                          `${job.company_name}_cover_letter.pdf`
                        )
                      }
                      size="sm"
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10 text-xs h-9"
                    >
                      <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">View Cover</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onGenerateCoverLetter(job)}
                      disabled={isProcessingCoverLetter}
                      size="sm"
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10 text-xs h-9"
                    >
                      {isProcessingCoverLetter ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                      ) : (
                        <Upload className="w-3 h-3 mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">Cover</span>
                    </Button>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white h-10 text-sm"
                  >
                    <a
                      href={finalApplyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Apply Now</span>
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);
DiscoveredJobCard.displayName = "DiscoveredJobCard";

const DiscoveryAgentStats = memo(({ jobCount }: { jobCount: number }) => {
  const stats = useMemo(
    () => ({
      discovered: jobCount,
      aiMatched: Math.round(jobCount * 0.85),
      qualityScore: jobCount > 0 ? 92 : 0,
      freshOpportunities: Math.round(jobCount * 0.7),
    }),
    [jobCount]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Radar className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.discovered}
          </div>
          <div className="text-xs text-slate-400">Opportunities Discovered</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.aiMatched}
          </div>
          <div className="text-xs text-slate-400">AI Matched</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.qualityScore}%
          </div>
          <div className="text-xs text-slate-400">Quality Score</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.freshOpportunities}
          </div>
          <div className="text-xs text-slate-400">Fresh Opportunities</div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
DiscoveryAgentStats.displayName = "DiscoveryAgentStats";

const AIJobDiscoveryAgentResults: React.FC = () => {
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [savingJobs, setSavingJobs] = useState<Set<string>>(new Set());
  const [processingResume, setProcessingResume] = useState<Set<string>>(
    new Set()
  );
  const [processingCoverLetter, setProcessingCoverLetter] = useState<
    Set<string>
  >(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyingJobs, setApplyingJobs] = useState<Set<string>>(new Set());
  const [dislikingJobs, setDislikingJobs] = useState<Set<string>>(new Set());
  const [generationStatus, setGenerationStatus] = useState<
    Record<string, GenerationStatus>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { usage } = useUsageTracking();
  const hasSavedResults = useRef(false);

  // **CHANGE 1 of 2**: Add a ref to track if the initial load has completed.
  const initialLoadComplete = useRef(false);

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    const loadAndSyncJobs = async () => {
      setLoading(true);
      const results = sessionStorage.getItem("jobSearchResults");
      let initialJobs: JobResult[] = [];

      if (results) {
        try {
          const parsedResults = JSON.parse(results);
          const jobsArray = Array.isArray(parsedResults)
            ? parsedResults
            : [parsedResults];
          initialJobs = jobsArray.map((job, index) => ({
            ...job,
            uniqueId:
              job.uniqueId ||
              `${job.job_title}-${job.company_name}-${index}-${Date.now()}`,
          }));
        } catch (error) {
          console.error(
            "Error parsing job results from session storage:",
            error
          );
          initialJobs = [];
        }
      }

      if (initialJobs.length === 0 && !results) {
        navigate("/job-discovery");
        setLoading(false);
        return;
      }

      if (!user || initialJobs.length === 0) {
        setJobResults(initialJobs);
        setLoading(false);
        return;
      }

      try {
        const applyUrls = initialJobs
          .map((job) => job.apply_link || job.linkedin_apply_link)
          .filter(Boolean);

        if (applyUrls.length === 0) {
          setJobResults(initialJobs);
          return;
        }

        const [savedRes, appliedRes, dislikedRes] = await Promise.all([
          supabase
            .from("saved_jobs")
            .select("apply_url")
            .eq("user_id", user.id)
            .in("apply_url", applyUrls),
          supabase
            .from("applied_jobs")
            .select("apply_url")
            .eq("user_id", user.id)
            .in("apply_url", applyUrls),
          supabase
            .from("disliked_jobs")
            .select("apply_link")
            .eq("user_id", user.id)
            .in("apply_link", applyUrls),
        ]);

        if (savedRes.error) throw savedRes.error;
        if (appliedRes.error) throw appliedRes.error;
        if (dislikedRes.error) throw dislikedRes.error;

        const savedUrls = new Set(savedRes.data.map((j) => j.apply_url));
        const newSavedJobs = new Set<string>();
        initialJobs.forEach((job) => {
          const finalApplyLink = job.apply_link || job.linkedin_apply_link;
          if (savedUrls.has(finalApplyLink)) {
            newSavedJobs.add(job.uniqueId);
          }
        });
        setSavedJobs(newSavedJobs);

        const appliedUrls = new Set(appliedRes.data.map((j) => j.apply_url));
        const dislikedUrls = new Set(dislikedRes.data.map((j) => j.apply_link));

        const filteredJobs = initialJobs.filter((job) => {
          const finalApplyLink = job.apply_link || job.linkedin_apply_link;
          return (
            !appliedUrls.has(finalApplyLink) &&
            !dislikedUrls.has(finalApplyLink)
          );
        });

        setJobResults(filteredJobs);
        sessionStorage.setItem(
          "jobSearchResults",
          JSON.stringify(filteredJobs)
        );
      } catch (error) {
        console.error("Error syncing job states:", error);
        toast({
          title: "Agent Sync Error",
          description: "Could not sync your jobs. Displaying all results.",
          variant: "destructive",
        });
        setJobResults(initialJobs);
      } finally {
        setLoading(false);
      }
    };

    // **CHANGE 2 of 2**: Add a condition to ensure loadAndSyncJobs runs only once.
    if (!initialLoadComplete.current) {
      loadAndSyncJobs();
      initialLoadComplete.current = true;
    }
  }, [user, navigate, toast]);

  const checkGenerationStatus = useCallback(
    async (jobs: JobResult[]) => {
      if (!user || jobs.length === 0) return;

      try {
        const [resumesRes, coverLettersRes] = await Promise.all([
          supabase
            .from("tailored_resumes")
            .select("job_description, resume_data")
            .eq("user_id", user.id),
          supabase
            .from("cover_letters")
            .select("job_description, cover_letter_url")
            .eq("user_id", user.id),
        ]);

        if (resumesRes.error) throw resumesRes.error;
        if (coverLettersRes.error) throw coverLettersRes.error;

        const resumeMap = new Map<string, string>();
        resumesRes.data?.forEach((resume) => {
          if (resume.job_description && resume.resume_data) {
            resumeMap.set(resume.job_description, resume.resume_data);
          }
        });

        const coverLetterMap = new Map<string, string>();
        coverLettersRes.data?.forEach((cl) => {
          if (cl.job_description && cl.cover_letter_url) {
            coverLetterMap.set(cl.job_description, cl.cover_letter_url);
          }
        });

        const newStatus: Record<string, GenerationStatus> = {};
        jobs.forEach((job) => {
          if (job.job_description) {
            const resumeUrl = resumeMap.get(job.job_description);
            const coverLetterUrl = coverLetterMap.get(job.job_description);

            if (resumeUrl || coverLetterUrl) {
              newStatus[job.uniqueId] = {
                ...(resumeUrl && { resumeUrl }),
                ...(coverLetterUrl && { coverLetterUrl }),
              };
            }
          }
        });

        setGenerationStatus((prevStatus) => ({ ...prevStatus, ...newStatus }));
      } catch (error) {
        console.error("Error checking generation status:", error);
        toast({
          title: "Agent Sync Error",
          description:
            "Could not verify existing documents. Some items may appear as not generated.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (user && jobResults.length > 0) {
      checkGenerationStatus(jobResults);
    }
  }, [user, jobResults, checkGenerationStatus]);

  const saveJobSearchResults = useCallback(
    async (jobs: JobResult[]) => {
      if (!user) return;

      try {
        const jobSearchData = jobs.map((job) => ({
          user_id: user.id,
          job_title: job.job_title || "Unknown",
          company_name: job.company_name || "Unknown",
          location: Array.isArray(job.location)
            ? job.location.join(", ")
            : job.location || "Unknown", // Handle array
          experience_level: job.experience_level || "Not specified",
          job_type: job.job_type || "Not specified",
          work_type: "Not specified",
          apply_link: job.apply_link || "",
          company_linkedin_url: job.companyLinkedinUrl || null,
          posted_at: job.created_at || new Date().toISOString(), // This should be posted_at from types.ts
          job_description: job.job_description || null,
          seniority_level: job.experience_level || null,
          employment_type: job.job_type || null,
          job_function: job.jobFunction || null,
          industries: job.industries || null,
        }));

        // The column in job_search_results is created_at for the timestamp of insertion,
        // and posted_at for when the job was originally posted.
        // Let's correct the mapping based on the types.
        const correctedData = jobSearchData.map((item) => {
          const { posted_at, ...rest } = item;
          return {
            ...rest,
            posted_at: item.posted_at, // The date the job was posted
            // created_at is handled by the DB default
          };
        });

        const { error } = await supabase
          .from("job_search_results")
          .insert(correctedData);

        if (error) {
          console.error("Error saving job search results:", error);
          toast({
            title: "Agent Storage Error",
            description:
              "Opportunities discovered but failed to save. You can still view them.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in saveJobSearchResults:", error);
        toast({
          title: "Agent Storage Error",
          description:
            "Opportunities discovered but failed to save. You can still view them.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (user && jobResults.length > 0 && !hasSavedResults.current) {
      saveJobSearchResults(jobResults);
      hasSavedResults.current = true;
    }
  }, [user, jobResults, saveJobSearchResults]);

  const getCurrentUserVersion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) {
        if (error.code === "PGRST116") return 0;
        return 0;
      }
      if (data && "version" in data && typeof data.version === "number") {
        return data.version;
      }
      return 0;
    } catch (error) {
      console.error("Error in getCurrentUserVersion:", error);
      return 0;
    }
  };

  const handleViewOrDownload = useCallback(
    (url: string, fileName: string) => {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error opening document:", error);
        toast({
          title: "Display Error",
          description: "Could not open the document. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleSaveJob = useCallback(
    async (job: JobResult) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to track job opportunities.",
          variant: "destructive",
        });
        return;
      }

      setSavingJobs((prev) => new Set(prev).add(job.uniqueId));

      if (savedJobs.has(job.uniqueId)) {
        try {
          const { error } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("user_id", user.id)
            .eq("apply_url", job.apply_link || job.linkedin_apply_link);

          if (error) throw error;

          setSavedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
          toast({
            title: "Agent Saving Stopped ✅",
            description: "Opportunity removed from your job library.",
          });
        } catch (error) {
          console.error("Error removing saved job:", error);
          toast({
            title: "Agent Error",
            description: "Failed to remove opportunity. Please try again.",
            variant: "destructive",
          });
        } finally {
          setSavingJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
        }
        return;
      }

      try {
        const jobData = {
          user_id: user.id,
          job_title: job.job_title || "",
          company_name: job.company_name || "",
          job_location: Array.isArray(job.location)
            ? job.location.join(", ")
            : job.location || "",
          company_linkedin_url: job.companyLinkedinUrl || null,
          posted_at: job.created_at || "",
          apply_url: job.apply_link || job.linkedin_apply_link || "",
          job_description: job.job_description || null,
          seniority_level: job.experience_level || null,
          employment_type: job.job_type || null,
          job_function: job.jobFunction || null,
          industries: job.industries || null,
        };

        const { error } = await supabase.from("saved_jobs").insert(jobData);

        if (error) {
          if (error.code === "23505") {
            setSavedJobs((prev) => new Set(prev).add(job.uniqueId));
            toast({
              title: "Already Saved ✅",
              description: "This opportunity is already in your job library.",
            });
          } else {
            throw error;
          }
        } else {
          setSavedJobs((prev) => new Set(prev).add(job.uniqueId));
          toast({
            title: "Agent Now Saving! 🎯",
            description: "Opportunity added to your AI Job Library.",
          });
        }
      } catch (error) {
        console.error("Error saving job:", error);
        toast({
          title: "Agent Error",
          description: "Failed to track opportunity. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSavingJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(job.uniqueId);
          return newSet;
        });
      }
    },
    [user, savedJobs, toast]
  );

  const handleTailorResume = useCallback(
    async (job: JobResult) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to use AI resume tailoring.",
          variant: "destructive",
        });
        return;
      }

      if (usage?.plan_type === "Free") {
        toast({
          title: "Upgrade to Unlock AI Tools 🚀",
          description:
            "Instant AI Resume Optimization is a premium feature. Please upgrade your plan to use it.",
          variant: "destructive",
          action: (
            <Button size="sm" onClick={() => navigate("/pricing")}>
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setProcessingResume((prev) => new Set(prev).add(job.uniqueId));

        try {
          const currentVersion = await getCurrentUserVersion(user.id);
          const { error: usageError } = await supabase.rpc(
            "increment_usage_secure",
            {
              p_target_user_id: user.id,
              p_usage_type: "one_click_tailors_used",
              p_increment_amount: 1,
              p_current_version: currentVersion,
              p_audit_metadata: {
                action: "discovery_agent_tailoring",
                job_title: job.job_title,
                company_name: job.company_name,
                location: job.location,
                file_type: file.type === "application/pdf" ? "pdf" : "docx",
                file_size: file.size,
              },
            }
          );
          if (usageError) {
            if (usageError.message.includes("Usage limit exceeded")) {
              toast({
                title: "Agent Limit Reached 🤖",
                description:
                  "You've reached your Discovery Agent limit. Upgrade for unlimited actions!",
                variant: "destructive",
                action: (
                  <Button size="sm" onClick={() => navigate("/pricing")}>
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade Plan
                  </Button>
                ),
              });
              return;
            }

            if (usageError.message.includes("version_conflict")) {
              toast({
                title: "Agent Sync Issue 🔄",
                description: "Your agent data was updated. Please try again.",
                variant: "destructive",
              });
              return;
            }

            console.error("Usage increment error:", usageError);
            toast({
              title: "Agent Activation Failed ⚠️",
              description:
                "Unable to activate your Discovery Agent. Please try again.",
              variant: "destructive",
            });
            return;
          }

          const formData = new FormData();

          formData.append("jobUniqueId", job.uniqueId);
          formData.append("feature", "instant_tailoring_agent");
          formData.append("jobRole", job.job_title || "");
          formData.append("jobDescription", job.job_description || "");
          formData.append("industry", job.industries || "General");
          formData.append(
            "fileType",
            file.type === "application/pdf" ? "pdf" : "docx"
          );
          formData.append("resume", file);

          const session = (await supabase.auth.getSession()).data.session;
          if (!session) throw new Error("User not authenticated");

          const response = await fetch(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/instant-resume-proxy`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to tailor resume");
          }

          const tailoredResumeUrl = await response.text();

          if (tailoredResumeUrl) {
            const { error } = await supabase.from("tailored_resumes").insert({
              user_id: user.id,
              job_description: job.job_description,
              resume_data: tailoredResumeUrl,
              title: `${user.email?.split("@")[0] || "User"} - ${
                job.job_title
              }`,
              file_type: "pdf",
            });

            if (error) {
              console.error("Error saving tailored resume:", error);
            }
            handleViewOrDownload(
              tailoredResumeUrl,
              `${user.email?.split("@")[0] || "User"}-${job.job_title}.pdf`
            );

            toast({
              title: "Agent Success! 🤖",
              description:
                "Your AI-tailored resume has been generated and downloaded!",
            });

            setGenerationStatus((prev) => ({
              ...prev,
              [job.uniqueId]: {
                ...prev[job.uniqueId],
                resumeUrl: tailoredResumeUrl,
              },
            }));
          }
        } catch (error) {
          console.error("Error tailoring resume:", error);
          toast({
            title: "Agent Error",
            description: "Failed to tailor resume. Please try again.",
            variant: "destructive",
          });
        } finally {
          setProcessingResume((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
        }
      };
      input.click();
    },
    [user, toast, navigate, usage, handleViewOrDownload]
  );

  const handleGenerateCoverLetter = useCallback(
    async (job: JobResult) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to use AI cover letter generation.",
          variant: "destructive",
        });
        return;
      }

      if (usage?.plan_type === "Free") {
        toast({
          title: "Upgrade to Unlock AI Tools 🚀",
          description:
            "Instant AI Cover Letter Generation is a premium feature. Please upgrade your plan to use it.",
          variant: "destructive",
          action: (
            <Button size="sm" onClick={() => navigate("/pricing")}>
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setProcessingCoverLetter((prev) => new Set(prev).add(job.uniqueId));

        try {
          const currentVersion = await getCurrentUserVersion(user.id);
          const { error: usageError } = await supabase.rpc(
            "increment_usage_secure",
            {
              p_target_user_id: user.id,
              p_usage_type: "one_click_tailors_used",
              p_increment_amount: 1,
              p_current_version: currentVersion,
              p_audit_metadata: {
                action: "discovery_agent_cover_letter",
                job_title: job.job_title,
                company_name: job.company_name,
                location: job.location,
                file_type: file.type === "application/pdf" ? "pdf" : "docx",
                file_size: file.size,
              },
            }
          );
          if (usageError) {
            if (usageError.message.includes("Usage limit exceeded")) {
              toast({
                title: "Agent Limit Reached 🤖",
                description:
                  "You've reached your Discovery Agent limit. Upgrade for unlimited actions!",
                variant: "destructive",
                action: (
                  <Button size="sm" onClick={() => navigate("/pricing")}>
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade Plan
                  </Button>
                ),
              });
              return;
            }

            if (usageError.message.includes("version_conflict")) {
              toast({
                title: "Agent Sync Issue 🔄",
                description: "Your agent data was updated. Please try again.",
                variant: "destructive",
              });
              return;
            }

            console.error("Usage increment error:", usageError);
            toast({
              title: "Agent Activation Failed ⚠️",
              description:
                "Unable to activate your Discovery Agent. Please try again.",
              variant: "destructive",
            });
            return;
          }

          const formData = new FormData();

          formData.append("jobUniqueId", job.uniqueId);
          formData.append("feature", "discovery_agent_cover_letters");
          formData.append("jobDescription", job.job_description || "");
          formData.append("companyName", job.company_name || "");
          formData.append("positionTitle", job.job_title || "");
          formData.append("industry", job.industries || "General");
          formData.append(
            "fileType",
            file.type === "application/pdf" ? "pdf" : "docx"
          );
          formData.append("resume", file);

          const session = (await supabase.auth.getSession()).data.session;
          if (!session) throw new Error("User not authenticated");

          const response = await fetch(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/instant-cover-letter-proxy`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to generate cover letter");
          }

          const coverLetterUrl = await response.text();

          if (coverLetterUrl) {
            const { error } = await supabase.from("cover_letters").insert({
              user_id: user.id,
              job_description: job.job_description,
              company_name: job.company_name,
              position_title: job.job_title,
              cover_letter_url: coverLetterUrl,
              original_resume_name: file.name,
              file_type: "pdf",
            });

            if (error) {
              console.error("Error saving cover letter:", error);
            }
            handleViewOrDownload(
              coverLetterUrl,
              `cover-letter-${job.company_name}-${job.job_title}.pdf`
            );

            toast({
              title: "Agent Success! 🤖",
              description:
                "Your personalized cover letter has been generated and downloaded!",
            });

            setGenerationStatus((prev) => ({
              ...prev,
              [job.uniqueId]: {
                ...prev[job.uniqueId],
                coverLetterUrl: coverLetterUrl,
              },
            }));
          }
        } catch (error) {
          console.error("Error generating cover letter:", error);
          toast({
            title: "Agent Error",
            description: "Failed to generate cover letter. Please try again.",
            variant: "destructive",
          });
        } finally {
          setProcessingCoverLetter((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
        }
      };
      input.click();
    },
    [user, toast, navigate, usage, handleViewOrDownload]
  );

  const handleAppliedChange = useCallback(
    async (job: JobResult, checked: boolean) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to mark jobs as applied.",
          variant: "destructive",
        });
        return;
      }

      if (checked) {
        setApplyingJobs((prev) => new Set(prev).add(job.uniqueId));
        setAppliedJobs((prev) => new Set(prev).add(job.uniqueId));

        try {
          const appliedJobData = {
            user_id: user.id,
            job_title: job.job_title || "Unknown Job",
            company_name: job.company_name || "Unknown Company",
            job_location: Array.isArray(job.location)
              ? job.location.join(", ")
              : job.location || "Location Not Available",
            company_linkedin_url: job.companyLinkedinUrl || null,
            posted_at: job.created_at || new Date().toISOString().slice(0, 10),
            apply_url: job.apply_link || job.linkedin_apply_link || "",
            job_description: job.job_description || null,
            seniority_level: job.experience_level || null,
            employment_type: job.job_type || null,
            job_function: job.jobFunction || null,
            industries: job.industries || null,
          };

          const { error } = await supabase
            .from("applied_jobs")
            .insert(appliedJobData);

          if (error) throw error;

          setJobResults((prevResults) => {
            const updatedResults = prevResults.filter(
              (j) => j.uniqueId !== job.uniqueId
            );
            sessionStorage.setItem(
              "jobSearchResults",
              JSON.stringify(updatedResults)
            );
            return updatedResults;
          });

          setSavedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });

          toast({
            title: "Agent Success! ✅",
            description: "Opportunity moved to your application monitor.",
          });
        } catch (error) {
          console.error("Error moving job to applied:", error);
          toast({
            title: "Agent Error",
            description: "Failed to save applied job. Please try again.",
            variant: "destructive",
          });
          setAppliedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
        } finally {
          setApplyingJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(job.uniqueId);
            return newSet;
          });
        }
      }
    },
    [user, toast]
  );

  const handleDislikeJob = useCallback(
    async (job: JobResult) => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage your job discoveries.",
          variant: "destructive",
        });
        return;
      }

      setDislikingJobs((prev) => new Set(prev).add(job.uniqueId));

      const updatedResults = jobResults.filter(
        (j) => j.uniqueId !== job.uniqueId
      );
      setJobResults(updatedResults);
      sessionStorage.setItem(
        "jobSearchResults",
        JSON.stringify(updatedResults)
      );

      toast({
        title: "Discovery Removed 👋",
        description:
          "We'll improve future recommendations based on your feedback.",
      });

      try {
        const { error } = await supabase.from("disliked_jobs").insert({
          user_id: user.id,
          job_title: job.job_title,
          company_name: job.company_name,
          apply_link: job.apply_link || job.linkedin_apply_link,
          job_description: job.job_description,
        });
        if (error) throw error;
      } catch (error) {
        console.error("Error logging disliked job:", error);
      } finally {
        setDislikingJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(job.uniqueId);
          return newSet;
        });
      }
    },
    [user, jobResults, toast]
  );

  const handleShare = useCallback(
    (job: JobResult) => {
      if (navigator.share) {
        navigator.share({
          title: `${job.job_title} at ${job.company_name}`,
          text: `Check out this AI-discovered opportunity: ${job.job_title} at ${job.company_name}`,
          url: job.apply_link,
        });
      } else {
        navigator.clipboard.writeText(job.apply_link);
        toast({
          title: "Link Copied ✅",
          description: "Discovery link copied to clipboard.",
        });
      }
    },
    [toast]
  );

  // **FIXED**: Search logic is now more robust, especially for location data.
  const filteredJobs = useMemo(
    () =>
      jobResults.filter((job) => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const titleMatch = (job.job_title ?? "")
          .toLowerCase()
          .includes(lowercasedSearchTerm);
        const companyMatch = (job.company_name ?? "")
          .toLowerCase()
          .includes(lowercasedSearchTerm);

        // Handle both string and array for location
        const locationString = Array.isArray(job.location)
          ? job.location.join(", ")
          : job.location ?? "";
        const locationMatch = locationString
          .toLowerCase()
          .includes(lowercasedSearchTerm);

        return titleMatch || companyMatch || locationMatch;
      }),
    [jobResults, searchTerm]
  );

  // **REMOVED**: Sorting logic is no longer needed.
  // The displayed jobs will be the filtered jobs in their default order.
  const displayedJobs = filteredJobs;

  if (loading) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto">
              <DiscoveryAgentLoadingSkeleton />
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="text-center space-y-4 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-4 sm:gap-6"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500/20 via-red-500/15 to-rose-600/20 rounded-full flex items-center justify-center border border-rose-500/20 backdrop-blur-xl"
                    >
                      <Radar className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
                    </motion.div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs sm:text-sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Discovery
                      </Badge>
                    </div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                    >
                      AI Job Discovery{" "}
                      <span className="bg-gradient-to-r from-rose-400 via-red-400 to-rose-500 bg-clip-text text-transparent">
                        Results
                      </span>
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Hey{" "}
                        <span className="text-rose-400 font-semibold">
                          {userName}
                        </span>
                        ! 👋
                        <br />
                        Your AI discovered {jobResults.length} perfect{" "}
                        {jobResults.length === 1
                          ? "opportunity"
                          : "opportunities"}{" "}
                        for you
                      </p>
                      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                        AI-powered job matching with intelligent opportunity
                        scoring and personalized recommendations
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
                >
                  {[
                    {
                      icon: Radar,
                      title: "AI Discovery",
                      desc: "Smart opportunity detection",
                    },
                    {
                      icon: Bot,
                      title: "Quality Matching",
                      desc: "Intelligent job scoring",
                    },
                    {
                      icon: Target,
                      title: "Perfect Fits",
                      desc: "Personalized recommendations",
                    },
                    {
                      icon: Sparkles,
                      title: "Fresh Results",
                      desc: "Latest opportunities found",
                    },
                  ].map((capability, index) => (
                    <motion.div
                      key={capability.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                    >
                      <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mx-auto mb-2 sm:mb-3" />
                      <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                        {capability.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {capability.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <DiscoveryAgentStats jobCount={jobResults.length} />

              {/* **MODIFIED**: Sorting controls removed */}
              {jobResults.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="relative w-full flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by title, company, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                    />
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                {displayedJobs.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12 sm:py-16"
                  >
                    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                      <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-slate-700/30 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                        >
                          <Radar className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                        </motion.div>
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                          {searchTerm
                            ? "No Matching Discoveries"
                            : "All Opportunities Cleared!"}
                        </h3>
                        <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                          {searchTerm
                            ? `No opportunities found matching "${searchTerm}". Try a different search term.`
                            : "Great job! You've reviewed all discovered positions. Let your AI agent find more."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          {searchTerm ? (
                            <Button
                              variant="outline"
                              onClick={() => setSearchTerm("")}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                              Clear Search
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigate("/job-finder")}
                              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                            >
                              <Radar className="w-4 h-4 mr-2" />
                              Discover More
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <AnimatePresence>
                      {displayedJobs.map((job, index) => (
                        <DiscoveredJobCard
                          key={job.uniqueId}
                          job={job}
                          index={index}
                          onSaveJob={handleSaveJob}
                          onTailorResume={handleTailorResume}
                          onGenerateCoverLetter={handleGenerateCoverLetter}
                          onAppliedChange={handleAppliedChange}
                          onShare={handleShare}
                          onDislikeJob={handleDislikeJob}
                          savedJobs={savedJobs}
                          savingJobs={savingJobs}
                          processingResume={processingResume}
                          processingCoverLetter={processingCoverLetter}
                          appliedJobs={appliedJobs}
                          applyingJobs={applyingJobs}
                          dislikingJobs={dislikingJobs}
                          user={user}
                          generationStatus={
                            generationStatus[job.uniqueId] || {}
                          }
                          onViewOrDownload={handleViewOrDownload}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              {displayedJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 sm:mt-12 text-center"
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                    <CardContent className="p-6 sm:p-8">
                      <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-rose-400" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                        Ready for more discoveries?
                      </h3>
                      <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">
                        Let your AI agent discover more personalized
                        opportunities or refine your search parameters
                      </p>
                      <Button
                        onClick={() => navigate("/job-finder")}
                        className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                      >
                        <Radar className="w-4 h-4 mr-2" />
                        Start New Discovery
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AIJobDiscoveryAgentResults;
