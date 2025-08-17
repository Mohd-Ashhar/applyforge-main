import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Calendar,
  Trash2,
  Building,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Heart,
  Share2,
  Eye,
  Loader2,
  Plus,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  Clock,
  Globe,
  Briefcase,
  Bot,
  Brain,
  Activity,
  Star,
  Zap,
  Shield,
  Home,
  ChevronRight,
  Crown,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

interface SavedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description?: string;
  saved_at: string;
  apply_url: string;
  posted_at?: string;
  employment_type?: string;
  seniority_level?: string;
  job_function?: string;
  industries?: string;
  user_id: string;
}

// **MOBILE-ENHANCED LOADING SKELETON - TEAL THEME**
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg"
      >
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/20 rounded-lg sm:rounded-xl border border-teal-500/30"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-3 sm:h-4 w-3/4 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-2 sm:h-3 w-1/2 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>

          <motion.div
            className="h-12 sm:h-16 w-full bg-slate-700/50 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />

          <div className="flex gap-2">
            <motion.div
              className="h-8 sm:h-9 flex-1 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="h-8 sm:h-9 w-8 sm:w-9 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// **MOBILE-ENHANCED TRACKED JOB CARD COMPONENT**
const TrackedJobCard = memo(
  ({
    job,
    index,
    onRemove,
    onShare,
    removingIds,
  }: {
    job: SavedJob;
    index: number;
    onRemove: (jobId: string) => void;
    onShare: (job: SavedJob) => void;
    removingIds: Set<string>;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    const formatSavedDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Today";
      if (diffDays <= 7) return `${diffDays} days ago`;
      return `${Math.floor(diffDays / 7)} weeks ago`;
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
      (description: string, maxLength: number = 120) => {
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
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center font-semibold text-teal-400 border border-teal-500/30 flex-shrink-0 text-xs sm:text-sm"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getCompanyInitials(job.company_name)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold truncate text-white group-hover:text-teal-400 transition-colors">
                    {job.job_title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {job.company_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Tracking Badge */}
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
                <Eye className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                Tracking
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 min-w-0 flex-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{job.job_location}</span>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
                <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                {formatSavedDate(job.saved_at)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4 flex-1 flex flex-col">
            {/* Employment Type and Level Tags */}
            {(job.employment_type ||
              job.seniority_level ||
              job.job_function) && (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {job.employment_type && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                    <Briefcase className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.employment_type}</span>
                  </Badge>
                )}
                {job.seniority_level && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                    <Target className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.seniority_level}</span>
                  </Badge>
                )}
                {job.job_function && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                    <span className="truncate">{job.job_function}</span>
                  </Badge>
                )}
              </div>
            )}

            {/* Job Description */}
            {job.job_description && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                  Opportunity Details
                </h4>
                <div className="p-2 sm:p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {truncateDescription(job.job_description)}
                  </p>
                </div>
              </div>
            )}

            {/* Posted Date */}
            {job.posted_at && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Posted {formatDate(job.posted_at)}</span>
              </div>
            )}

            {/* AI Enhancement Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Bot className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                AI Tracked
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                Curated
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                Ready to Apply
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 mt-auto">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => window.open(job.apply_url, "_blank")}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                  size="sm"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Apply Now</span>
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-8 sm:h-9"
                    onClick={() => onShare(job)}
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share opportunity</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onRemove(job.id)}
                    disabled={removingIds.has(job.id)}
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-slate-600 h-8 sm:h-9"
                  >
                    {removingIds.has(job.id) ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop tracking</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

TrackedJobCard.displayName = "TrackedJobCard";

// **MOBILE-ENHANCED AGENT TRACKER STATS COMPONENT**
const JobTrackerStats = memo(({ jobCount }: { jobCount: number }) => {
  const stats = useMemo(
    () => ({
      tracked: jobCount,
      active: jobCount, // All tracked jobs are active
      avgMatch: jobCount > 0 ? 85 : 0, // Average match score
      readyToApply: jobCount, // All are ready to apply
    }),
    [jobCount]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.tracked}
          </div>
          <div className="text-xs text-slate-400">Opportunities Tracked</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.active}
          </div>
          <div className="text-xs text-slate-400">Active Tracking</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.avgMatch}%
          </div>
          <div className="text-xs text-slate-400">Avg Match Score</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.readyToApply}
          </div>
          <div className="text-xs text-slate-400">Ready to Apply</div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

JobTrackerStats.displayName = "JobTrackerStats";

const JobLibrary: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", user?.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast({
        title: "Agent Error",
        description: "Failed to load your job tracker.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const handleRemove = useCallback(
    async (jobId: string) => {
      setRemovingIds((prev) => new Set(prev).add(jobId));

      try {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("id", jobId)
          .eq("user_id", user?.id);

        if (error) throw error;

        setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
        toast({
          title: "Tracking Stopped ✅",
          description: "The opportunity has been removed from your tracker.",
        });
      } catch (error) {
        console.error("Error removing job:", error);
        toast({
          title: "Remove Failed",
          description: "There was an error removing the job.",
          variant: "destructive",
        });
      } finally {
        setRemovingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }
    },
    [user?.id, toast]
  );

  const handleShare = useCallback(
    (job: SavedJob) => {
      if (navigator.share) {
        navigator.share({
          title: `${job.job_title} at ${job.company_name}`,
          text: `Check out this tracked opportunity: ${job.job_title} at ${job.company_name}`,
          url: job.apply_url,
        });
      } else {
        navigator.clipboard.writeText(job.apply_url);
        toast({
          title: "Link Copied ✅",
          description: "Opportunity link copied to clipboard.",
        });
      }
    },
    [toast]
  );

  const filteredJobs = useMemo(
    () =>
      savedJobs.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.job_location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [savedJobs, searchTerm]
  );

  const sortedJobs = useMemo(
    () =>
      [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
          case "company":
            return a.company_name.localeCompare(b.company_name);
          case "title":
            return a.job_title.localeCompare(b.job_title);
          case "date":
          default:
            return (
              new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
            );
        }
      }),
    [filteredJobs, sortBy]
  );

  if (!user) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-4 border border-teal-500/20"
                >
                  <Eye className="w-8 h-8 text-teal-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to access your AI Job Tracker.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                >
                  Login to Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader />

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Back to Dashboard Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm text-sm sm:text-base h-9 sm:h-10"
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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-teal-600/20 rounded-full flex items-center justify-center border border-teal-500/20 backdrop-blur-xl"
                  >
                    <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Tracker
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Job{" "}
                    <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                      Library
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
                      <span className="text-teal-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent job tracking system monitoring every
                      opportunity
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Track, organize, and manage all your potential job
                      opportunities with AI-powered insights
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Tracker Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Eye,
                    title: "Smart Tracking",
                    desc: "AI monitors every opportunity",
                  },
                  {
                    icon: Activity,
                    title: "Real-time Updates",
                    desc: "Live job status monitoring",
                  },
                  {
                    icon: Target,
                    title: "Match Scoring",
                    desc: "AI rates job compatibility",
                  },
                  {
                    icon: Shield,
                    title: "Secure Storage",
                    desc: "Your data stays private",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Job Tracker Stats */}
            <JobTrackerStats jobCount={savedJobs.length} />

            {/* Search and Filter Controls */}
            {savedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Search your tracked opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
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
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm h-10 sm:h-11"
                  >
                    <Filter className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Sort by </span>
                    <span className="truncate">
                      {sortBy === "date"
                        ? "Date"
                        : sortBy === "company"
                        ? "Company"
                        : "Title"}
                    </span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchSavedJobs}
                        className="px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-10 sm:h-11"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh tracker</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedJobs.length === 0 ? (
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
                        className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-teal-500/20"
                      >
                        <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {searchTerm
                          ? "No Matching Opportunities"
                          : "Your Tracker Awaits"}
                      </h3>

                      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {searchTerm
                          ? `No tracked opportunities found matching "${searchTerm}". Try a different search term.`
                          : "You haven't tracked any job opportunities yet. Start by discovering and saving jobs to let your AI tracker monitor them!"}
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
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Discover Jobs to Track
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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {sortedJobs.map((job, index) => (
                    <TrackedJobCard
                      key={job.id}
                      job={job}
                      index={index}
                      onRemove={handleRemove}
                      onShare={handleShare}
                      removingIds={removingIds}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Job Search CTA */}
            {sortedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-teal-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      Ready to track more opportunities?
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm sm:text-base">
                      Let your AI agents discover and track more job
                      opportunities automatically
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/job-finder")}
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Job Discovery Agent
                      </Button>
                      <Button
                        onClick={() => navigate("/one-click-tailoring")}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Instant Tailoring Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobLibrary;
