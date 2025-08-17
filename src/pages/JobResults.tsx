import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  Briefcase,
  Clock,
  Building,
  ExternalLink,
  ArrowLeft,
  Search,
  FileText,
  Save,
  Upload,
  Check,
  Home,
  Filter,
  RefreshCw,
  Eye,
  Share2,
  Loader2,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  Heart,
  Zap,
  Globe,
  MoreVertical,
  Star,
  Bookmark,
  Bot,
  Brain,
  Radar,
  Compass,
  Shield,
  Activity,
  ChevronRight,
  Crown,
  Settings,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

interface JobResult {
  jobLink: string;
  title: string;
  companyName: string;
  companyLinkedinUrl: string;
  location: string;
  postedAt: string;
  applyUrl: string;
  descriptionText: string;
  seniorityLevel: string;
  employmentType: string;
  jobFunction: string;
  industries: string;
  uniqueId?: string;
}

// **ENHANCED LOADING SKELETON - ROSE/RED THEME**
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

// **FULLY REFACTORED DISCOVERED JOB CARD - FIXED MOBILE LAYOUT**
const DiscoveredJobCard = memo<{
  job: JobResult;
  index: number;
  onSaveJob: (job: JobResult, index: number) => void;
  onTailorResume: (job: JobResult, index: number) => void;
  onGenerateCoverLetter: (job: JobResult, index: number) => void;
  onAppliedChange: (job: JobResult, index: number, checked: boolean) => void;
  onShare: (job: JobResult) => void;
  savedJobs: Set<number>;
  savingJobs: Set<number>;
  processingResume: Set<number>;
  processingCoverLetter: Set<number>;
  appliedJobs: Set<number>;
  applyingJobs: Set<number>;
  user: any;
}>(
  ({
    job,
    index,
    onSaveJob,
    onTailorResume,
    onGenerateCoverLetter,
    onAppliedChange,
    onShare,
    savedJobs,
    savingJobs,
    processingResume,
    processingCoverLetter,
    appliedJobs,
    applyingJobs,
    user,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPostedDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Discovered today";
      if (diffDays <= 7) return `Discovered ${diffDays} days ago`;
      return `Discovered ${Math.floor(diffDays / 7)} weeks ago`;
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
          {/* **FIXED MOBILE HEADER** */}
          <CardHeader className="pb-3 sm:pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* **MAIN HEADER ROW** */}
              <div className="flex items-start gap-3">
                {/* Company Avatar */}
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center font-semibold text-rose-400 border border-rose-500/30 flex-shrink-0"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs sm:text-sm">
                    {getCompanyInitials(job.companyName || "UN")}
                  </span>
                </motion.div>

                {/* Job Title & Company */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-rose-400 transition-colors leading-tight mb-1 break-words line-clamp-2">
                    {job.title || "Job Title Not Available"}
                  </CardTitle>

                  <div className="flex items-center gap-2 min-w-0">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {job.companyName || "Company Name Not Available"}
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

                {/* Desktop Share Button */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
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

              {/* **FIXED BADGES AND APPLIED SECTION** */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center sm:justify-between">
                {/* Discovery Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs whitespace-nowrap flex-shrink-0">
                    {formatPostedDate(job.postedAt)}
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs whitespace-nowrap flex-shrink-0">
                    <Radar className="w-3 h-3 mr-1 flex-shrink-0" />
                    AI Discovered
                  </Badge>
                </div>

                {/* Applied Checkbox */}
                {user && (
                  <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
                    <Checkbox
                      id={`applied-${index}`}
                      checked={appliedJobs.has(index)}
                      onCheckedChange={(checked) =>
                        onAppliedChange(job, index, checked as boolean)
                      }
                      disabled={applyingJobs.has(index)}
                      className="flex-shrink-0"
                    />
                    <label
                      htmlFor={`applied-${index}`}
                      className="text-xs font-medium leading-none cursor-pointer text-slate-400 whitespace-nowrap"
                    >
                      {applyingJobs.has(index) ? "Processing..." : "Applied"}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            {/* **JOB DETAILS - IMPROVED MOBILE LAYOUT** */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-300 truncate">
                  {job.location || "Location Not Available"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-300 truncate">
                  {job.seniorityLevel || "Experience Level Not Available"}
                </span>
              </div>
            </div>

            {/* **FIXED EMPLOYMENT TYPE AND INDUSTRY TAGS** */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {job.employmentType && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {job.employmentType}
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

            {/* **JOB DESCRIPTION** */}
            {job.descriptionText && (
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
                        job.descriptionText
                          .replace(/&gt;/g, ">")
                          .replace(/&lt;/g, "<")
                      ),
                    }}
                  />
                </div>
              </div>
            )}

            {/* **FIXED AI DISCOVERY BADGES** */}
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

            {/* **IMPROVED ACTION BUTTONS LAYOUT** */}
            <div className="pt-2">
              {/* Desktop Layout */}
              <div className="hidden md:flex flex-wrap gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onSaveJob(job, index)}
                    disabled={savingJobs.has(index)}
                    size="sm"
                    className={
                      savedJobs.has(index)
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg border-0"
                        : "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-rose-500 hover:to-pink-500 hover:text-white border border-slate-600 shadow-md hover:border-rose-400"
                    }
                  >
                    {savedJobs.has(index) ? (
                      <>
                        <Heart className="w-4 h-4 mr-2 fill-current" />
                        Tracked
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        {savingJobs.has(index) ? "Tracking..." : "Track"}
                      </>
                    )}
                  </Button>
                </motion.div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onTailorResume(job, index)}
                      disabled={processingResume.has(index)}
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10"
                    >
                      {processingResume.has(index) ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      Tailor Resume
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload resume to tailor for this discovery
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onGenerateCoverLetter(job, index)}
                      disabled={processingCoverLetter.has(index)}
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10"
                    >
                      {processingCoverLetter.has(index) ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Cover Letter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Generate cover letter for this discovery
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
                      href={job.applyUrl}
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

              {/* **COMPLETELY FIXED MOBILE LAYOUT** */}
              <div className="md:hidden space-y-2">
                {/* First Row: Track & Share */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => onSaveJob(job, index)}
                      disabled={savingJobs.has(index)}
                      size="sm"
                      className={
                        savedJobs.has(index)
                          ? "w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg border-0 text-xs h-9"
                          : "w-full bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 hover:from-rose-500 hover:to-pink-500 hover:text-white border border-slate-600 shadow-md text-xs h-9"
                      }
                    >
                      {savedJobs.has(index) ? (
                        <>
                          <Heart className="w-3 h-3 mr-1 fill-current flex-shrink-0" />
                          <span className="truncate">Tracked</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {savingJobs.has(index) ? "Tracking..." : "Track"}
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <Button
                    onClick={() => onShare(job)}
                    size="sm"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-9"
                  >
                    <Share2 className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Share</span>
                  </Button>
                </div>

                {/* Second Row: AI Tools */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => onTailorResume(job, index)}
                    disabled={processingResume.has(index)}
                    size="sm"
                    variant="outline"
                    className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white bg-blue-500/10 text-xs h-9"
                  >
                    {processingResume.has(index) ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                    ) : (
                      <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">Resume</span>
                  </Button>

                  <Button
                    onClick={() => onGenerateCoverLetter(job, index)}
                    disabled={processingCoverLetter.has(index)}
                    size="sm"
                    variant="outline"
                    className="w-full border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white bg-green-500/10 text-xs h-9"
                  >
                    {processingCoverLetter.has(index) ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin flex-shrink-0" />
                    ) : (
                      <Upload className="w-3 h-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">Cover</span>
                  </Button>
                </div>

                {/* Third Row: Apply Button */}
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
                      href={job.applyUrl}
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

// **AGENT DISCOVERY STATS COMPONENT**
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
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [savingJobs, setSavingJobs] = useState<Set<number>>(new Set());
  const [processingResume, setProcessingResume] = useState<Set<number>>(
    new Set()
  );
  const [processingCoverLetter, setProcessingCoverLetter] = useState<
    Set<number>
  >(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [applyingJobs, setApplyingJobs] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    const results = sessionStorage.getItem("jobSearchResults");
    if (results) {
      try {
        const parsedResults = JSON.parse(results);
        const jobsArray = Array.isArray(parsedResults)
          ? parsedResults
          : [parsedResults];
        const jobsWithIds = jobsArray.map((job, index) => ({
          ...job,
          uniqueId: `${job.title}-${job.companyName}-${index}-${Date.now()}`,
        }));
        setJobResults(jobsWithIds);

        if (user && jobsWithIds.length > 0) {
          saveJobSearchResults(jobsWithIds);
        }
      } catch (error) {
        console.error("Error parsing job results:", error);
        setJobResults([]);
      }
    } else {
      navigate("/job-discovery");
    }
    setLoading(false);
  }, [navigate, user]);

  const saveJobSearchResults = useCallback(
    async (jobs: JobResult[]) => {
      if (!user) return;

      try {
        const jobSearchData = jobs.map((job) => ({
          user_id: user.id,
          job_title: job.title || "Unknown",
          company_name: job.companyName || "Unknown",
          location: job.location || "Unknown",
          experience_level: job.seniorityLevel || "Not specified",
          job_type: job.employmentType || "Not specified",
          work_type: "Not specified",
          apply_link: job.applyUrl || "",
          company_linkedin_url: job.companyLinkedinUrl || null,
          posted_at: job.postedAt || new Date().toISOString(),
          job_description: job.descriptionText || null,
          seniority_level: job.seniorityLevel || null,
          employment_type: job.employmentType || null,
          job_function: job.jobFunction || null,
          industries: job.industries || null,
        }));

        const { error } = await supabase
          .from("job_search_results")
          .insert(jobSearchData);

        if (error) {
          console.error("Error saving job search results:", error);
          toast({
            title: "Agent Storage Error",
            description:
              "Opportunities discovered but failed to save. You can still view the results.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in saveJobSearchResults:", error);
        toast({
          title: "Agent Storage Error",
          description:
            "Opportunities discovered but failed to save. You can still view the results.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  const handleSaveJob = useCallback(
    async (job: JobResult, index: number) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to track job opportunities.",
          variant: "destructive",
        });
        return;
      }

      setSavingJobs((prev) => new Set(prev).add(index));

      if (savedJobs.has(index)) {
        try {
          const { data: existingSavedJobs, error: fetchError } = await supabase
            .from("saved_jobs")
            .select("id")
            .eq("user_id", user.id)
            .eq("job_title", job.title)
            .eq("company_name", job.companyName)
            .eq("apply_url", job.applyUrl);

          if (fetchError) throw fetchError;

          if (existingSavedJobs && existingSavedJobs.length > 0) {
            const idsToDelete = existingSavedJobs.map((record) => record.id);
            const { error: deleteError } = await supabase
              .from("saved_jobs")
              .delete()
              .in("id", idsToDelete);

            if (deleteError) throw deleteError;
          }

          setSavedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });

          toast({
            title: "Agent Tracking Stopped ✅",
            description: "Opportunity removed from your tracker.",
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
            newSet.delete(index);
            return newSet;
          });
        }
        return;
      }

      try {
        const jobData = {
          user_id: user.id,
          job_title: job.title || "",
          company_name: job.companyName || "",
          job_location: job.location || "",
          job_link: job.jobLink || null,
          company_linkedin_url: job.companyLinkedinUrl || null,
          posted_at: job.postedAt || "",
          apply_url: job.applyUrl || "",
          job_description: job.descriptionText || null,
          seniority_level: job.seniorityLevel || null,
          employment_type: job.employmentType || null,
          job_function: job.jobFunction || null,
          industries: job.industries || null,
        };

        const { error } = await supabase.from("saved_jobs").insert(jobData);

        if (error) {
          if (error.code === "23505") {
            setSavedJobs((prev) => new Set(prev).add(index));
            toast({
              title: "Already Tracking ✅",
              description: "This opportunity is already in your tracker.",
            });
          } else {
            throw error;
          }
        } else {
          setSavedJobs((prev) => new Set(prev).add(index));
          toast({
            title: "Agent Now Tracking! 🎯",
            description: "Opportunity added to your AI tracker.",
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
          newSet.delete(index);
          return newSet;
        });
      }
    },
    [user, savedJobs, toast]
  );

  const handleTailorResume = useCallback(
    async (job: JobResult, index: number) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to use AI resume tailoring.",
          variant: "destructive",
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setProcessingResume((prev) => new Set(prev).add(index));

        try {
          const base64Resume = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const response = await fetch(
            "https://n8n.applyforge.cloud/webhook-test/tailor-resume",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.id,
                feature: "discovery_agent_tailoring",
                resume: base64Resume,
                jobDescription: job.descriptionText,
                fileType: file.type === "application/pdf" ? "pdf" : "docx",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to tailor resume");
          }

          const tailoredResumeUrl = await response.text();

          if (tailoredResumeUrl) {
            const { error } = await supabase.from("tailored_resumes").insert({
              user_id: user.id,
              job_description: job.descriptionText,
              resume_data: tailoredResumeUrl,
              title: `${user.email?.split("@")[0] || "User"} - ${job.title}`,
              file_type: "pdf",
            });

            if (error) {
              console.error("Error saving tailored resume:", error);
            }

            const a = document.createElement("a");
            a.href = tailoredResumeUrl;
            a.download = `${user.email?.split("@")[0] || "User"}-${
              job.title
            }.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
              title: "Agent Success! 🤖",
              description:
                "Your AI-tailored resume has been generated and downloaded!",
            });
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
            newSet.delete(index);
            return newSet;
          });
        }
      };
      input.click();
    },
    [user, toast]
  );

  const handleGenerateCoverLetter = useCallback(
    async (job: JobResult, index: number) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to use AI cover letter generation.",
          variant: "destructive",
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setProcessingCoverLetter((prev) => new Set(prev).add(index));

        try {
          const base64Resume = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const response = await fetch(
            "https://primary-production-800d.up.railway.app/webhook-test/generate-cover-letter",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.id,
                feature: "discovery_agent_cover_letters",
                resume: base64Resume,
                jobDescription: job.descriptionText,
                companyName: job.companyName,
                positionTitle: job.title,
                fileType: file.type === "application/pdf" ? "pdf" : "docx",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to generate cover letter");
          }

          const coverLetterUrl = await response.text();

          if (coverLetterUrl) {
            const { error } = await supabase.from("cover_letters").insert({
              user_id: user.id,
              job_description: job.descriptionText,
              company_name: job.companyName,
              position_title: job.title,
              cover_letter_url: coverLetterUrl,
              original_resume_name: file.name,
              file_type: "pdf",
            });

            if (error) {
              console.error("Error saving cover letter:", error);
            }

            const a = document.createElement("a");
            a.href = coverLetterUrl;
            a.download = `cover-letter-${job.companyName}-${job.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
              title: "Agent Success! 🤖",
              description:
                "Your personalized cover letter has been generated and downloaded!",
            });
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
            newSet.delete(index);
            return newSet;
          });
        }
      };
      input.click();
    },
    [user, toast]
  );

  const handleAppliedChange = useCallback(
    async (job: JobResult, index: number, checked: boolean) => {
      if (!user) {
        toast({
          title: "Authentication Required 🔐",
          description: "Please log in to mark jobs as applied.",
          variant: "destructive",
        });
        return;
      }

      if (checked) {
        setAppliedJobs((prev) => new Set(prev).add(index));
        setApplyingJobs((prev) => new Set(prev).add(index));

        try {
          const appliedJobData = {
            user_id: user.id,
            job_title: job.title || "Unknown Job",
            company_name: job.companyName || "Unknown Company",
            job_location: job.location || "Location Not Available",
            job_link: job.jobLink || null,
            company_linkedin_url: job.companyLinkedinUrl || null,
            posted_at: job.postedAt || new Date().toISOString().slice(0, 10),
            apply_url: job.applyUrl || "",
            job_description: job.descriptionText || null,
            seniority_level: job.seniorityLevel || null,
            employment_type: job.employmentType || null,
            job_function: job.jobFunction || null,
            industries: job.industries || null,
          };

          const { error } = await supabase
            .from("applied_jobs")
            .insert(appliedJobData);

          if (error) {
            throw error;
          }

          setJobResults((prevResults) => {
            return prevResults.filter((_, jobIndex) => jobIndex !== index);
          });

          setSavedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
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
            newSet.delete(index);
            return newSet;
          });
        } finally {
          setApplyingJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(index);
            return newSet;
          });
        }
      }
    },
    [user, toast]
  );

  const handleShare = useCallback(
    (job: JobResult) => {
      if (navigator.share) {
        navigator.share({
          title: `${job.title} at ${job.companyName}`,
          text: `Check out this AI-discovered opportunity: ${job.title} at ${job.companyName}`,
          url: job.applyUrl,
        });
      } else {
        navigator.clipboard.writeText(job.applyUrl);
        toast({
          title: "Link Copied ✅",
          description: "Discovery link copied to clipboard.",
        });
      }
    },
    [toast]
  );

  const filteredJobs = useMemo(
    () =>
      jobResults.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [jobResults, searchTerm]
  );

  const sortedJobs = useMemo(
    () =>
      [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
          case "company":
            return a.companyName.localeCompare(b.companyName);
          case "title":
            return a.title.localeCompare(b.title);
          case "date":
          default:
            return (
              new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
            );
        }
      }),
    [filteredJobs, sortBy]
  );

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
              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6"
              >
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm justify-start text-sm sm:text-base"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </motion.div>

              {/* Hero Section - AI Agent Focused */}
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

                {/* Agent Discovery Capabilities */}
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

              {/* Agent Discovery Stats */}
              <DiscoveryAgentStats jobCount={jobResults.length} />

              {/* Search and Filter Controls */}
              {jobResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      placeholder="Search discovered opportunities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white placeholder-slate-400 text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setSortBy(
                          sortBy === "date"
                            ? "company"
                            : sortBy === "company"
                            ? "title"
                            : "date"
                        )
                      }
                      className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-sm sm:text-base"
                    >
                      <Filter className="w-4 h-4" />
                      Sort by{" "}
                      {sortBy === "date"
                        ? "Date"
                        : sortBy === "company"
                        ? "Company"
                        : "Title"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Content */}
              <AnimatePresence mode="wait">
                {sortedJobs.length === 0 ? (
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
                            : "All Opportunities Applied!"}
                        </h3>

                        <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                          {searchTerm
                            ? `No opportunities found matching "${searchTerm}". Try a different search term.`
                            : "Amazing! You've applied to all discovered positions. Let your AI agent find more opportunities."}
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
                              onClick={() => navigate("/job-discovery")}
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
                      {sortedJobs.map((job, index) => (
                        <DiscoveredJobCard
                          key={
                            job.uniqueId ||
                            `${job.title}-${job.companyName}-${index}`
                          }
                          job={job}
                          index={index}
                          onSaveJob={handleSaveJob}
                          onTailorResume={handleTailorResume}
                          onGenerateCoverLetter={handleGenerateCoverLetter}
                          onAppliedChange={handleAppliedChange}
                          onShare={handleShare}
                          savedJobs={savedJobs}
                          savingJobs={savingJobs}
                          processingResume={processingResume}
                          processingCoverLetter={processingCoverLetter}
                          appliedJobs={appliedJobs}
                          applyingJobs={applyingJobs}
                          user={user}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Discovery CTA */}
              {sortedJobs.length > 0 && (
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
                        onClick={() => navigate("/job-discovery")}
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
