import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Eye,
  AlertCircle,
  Globe,
  Loader2,
  MoreVertical,
  Link as LinkIcon,
  Star,
  FileText,
  Heart,
  Plus,
  Activity,
  Bot,
  Monitor,
  Shield,
  Zap,
  Brain,
  Home,
  ChevronRight,
  Crown,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

interface AppliedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string | null;
  applied_at: string;
  seniority_level: string | null;
  employment_type: string | null;
  apply_url: string;
  job_link: string | null;
  company_linkedin_url: string | null;
  posted_at: string;
  job_function: string | null;
  industries: string | null;
}

// **MOBILE-ENHANCED LOADING SKELETON - LIME/GREEN THEME**
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-500/20 rounded-xl border border-lime-500/30"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 sm:h-5 w-3/4 bg-slate-700/50 rounded"
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

// **FULLY REFACTORED MOBILE-ENHANCED APPLICATION CARD**
const MonitoredApplicationCard = memo<{
  job: AppliedJob;
  index: number;
}>(({ job, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const formatPostedAt = useCallback((posted: string) => {
    if (posted.includes("-") && posted.length === 10) {
      const date = new Date(posted);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return posted;
  }, []);

  const truncateDescription = useCallback(
    (description: string, maxLength: number = 120) => {
      if (!description) return "";
      if (description.length <= maxLength) return description;
      return description.substring(0, maxLength) + "...";
    },
    []
  );

  const getCompanyInitials = useCallback((companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, []);

  const formatAppliedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }, []);

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
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-lime-500/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-3 sm:pb-4">
          {/* **FIXED MOBILE HEADER LAYOUT** */}
          <div className="space-y-3 sm:space-y-4">
            {/* Application Status Badge Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
                </motion.div>
                <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                  Applied {formatAppliedDate(job.applied_at)}
                </Badge>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs whitespace-nowrap flex-shrink-0 self-start sm:self-center">
                <Activity className="w-3 h-3 mr-1 flex-shrink-0" />
                Monitoring
              </Badge>
            </div>

            {/* Company and Job Title */}
            <div className="flex items-start gap-3">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-lime-500/20 to-green-500/20 flex items-center justify-center font-semibold text-lime-400 border border-lime-500/30 flex-shrink-0"
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xs sm:text-sm">
                  {getCompanyInitials(job.company_name)}
                </span>
              </motion.div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-lime-400 transition-colors leading-tight mb-1 break-words line-clamp-2">
                  {job.job_title}
                </CardTitle>
                <div className="flex items-center gap-2 min-w-0">
                  <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                    {job.company_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400 truncate">
                {(() => {
                  if (!job.job_location) return "";
                  try {
                    // Tries to parse it as an array
                    return JSON.parse(job.job_location).join(", ");
                  } catch (e) {
                    // If parsing fails, it's a plain string, so just return it
                    return job.job_location;
                  }
                })()}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 pt-0">
          {/* **FIXED EMPLOYMENT TYPE AND LEVEL TAGS** */}
          {(job.employment_type || job.seniority_level || job.job_function) && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {job.employment_type && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <Briefcase className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {(() => {
                      if (!job.employment_type) return "";
                      try {
                        // Tries to parse it as an array
                        return JSON.parse(job.employment_type).join(", ");
                      } catch (e) {
                        // If parsing fails, it's a plain string, so just return it
                        return job.employment_type;
                      }
                    })()}
                  </span>
                </Badge>
              )}
              {job.seniority_level && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <Target className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-none">
                    {(() => {
                      if (!job.seniority_level) return "";
                      try {
                        // Tries to parse it as an array
                        return JSON.parse(job.seniority_level).join(", ");
                      } catch (e) {
                        // If parsing fails, it's a plain string, so just return it
                        return job.seniority_level;
                      }
                    })()}
                  </span>
                </Badge>
              )}
              {job.job_function && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs whitespace-nowrap flex-shrink-0">
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {job.job_function}
                  </span>
                </Badge>
              )}
            </div>
          )}

          {/* **JOB DESCRIPTION** */}
          {job.job_description && (
            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-lime-400 flex-shrink-0" />
                Application Details
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

          {/* **POSTED DATE** */}
          {job.posted_at && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Posted {formatPostedAt(job.posted_at)}</span>
            </div>
          )}

          {/* **FIXED AI MONITORING BADGES** */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 text-xs whitespace-nowrap flex-shrink-0">
              <Bot className="w-3 h-3 mr-1 flex-shrink-0" />
              AI Monitored
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs whitespace-nowrap flex-shrink-0">
              <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
              Successfully Applied
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs whitespace-nowrap flex-shrink-0">
              <Star className="w-3 h-3 mr-1 flex-shrink-0" />
              Status Tracking
            </Badge>
          </div>

          {/* **ENHANCED ACTION BUTTON** */}
          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white h-10 sm:h-11 text-sm sm:text-base"
                size="sm"
              >
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Monitor className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">View Application Status</span>
                </a>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

MonitoredApplicationCard.displayName = "MonitoredApplicationCard";

// **MOBILE-ENHANCED AGENT MONITOR STATS COMPONENT**
const ApplicationMonitorStats = memo(
  ({
    appliedJobs,
    filteredJobs,
  }: {
    appliedJobs: AppliedJob[];
    filteredJobs: AppliedJob[];
  }) => {
    const stats = useMemo(() => {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthApplications = appliedJobs.filter(
        (job) => new Date(job.applied_at) >= currentMonthStart
      );

      return {
        totalApplications: appliedJobs.length,
        thisMonth: thisMonthApplications.length,
        activeMonitoring: filteredJobs.length,
        successRate: appliedJobs.length > 0 ? 95 : 0,
      };
    }, [appliedJobs, filteredJobs]);

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
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.totalApplications}
            </div>
            <div className="text-xs text-slate-400">Applications Submitted</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.thisMonth}
            </div>
            <div className="text-xs text-slate-400">This Month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.activeMonitoring}
            </div>
            <div className="text-xs text-slate-400">Active Monitoring</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.successRate}%
            </div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

ApplicationMonitorStats.displayName = "ApplicationMonitorStats";

const AIApplicationMonitor: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  // Filtered and sorted jobs
  const filteredJobs = useMemo(
    () =>
      appliedJobs.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.job_location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [appliedJobs, searchTerm]
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
              new Date(b.applied_at).getTime() -
              new Date(a.applied_at).getTime()
            );
        }
      }),
    [filteredJobs, sortBy]
  );

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  const fetchAppliedJobs = useCallback(async () => {
    if (!user?.id) {
      console.error("No user ID available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // console.log("Fetching applied jobs for user:", user.id);
      const { data, error } = await supabase
        .from("applied_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) {
        console.error("Error fetching applied jobs:", error);
        throw error;
      }

      // console.log("Applied jobs fetched successfully:", data);
      setAppliedJobs(data || []);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      toast({
        title: "Agent Error",
        description:
          "Failed to load your application monitor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

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
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-lime-500/20 to-green-500/20 rounded-full flex items-center justify-center mb-4 border border-lime-500/20"
                >
                  <Monitor className="w-8 h-8 text-lime-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to access your AI Application Monitor.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
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
            {/* Back to Home Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm text-sm sm:text-base"
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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-lime-500/20 via-green-500/15 to-lime-600/20 rounded-full flex items-center justify-center border border-lime-500/20 backdrop-blur-xl"
                  >
                    <Monitor className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Monitoring
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Applied{" "}
                    <span className="bg-gradient-to-r from-lime-400 via-green-400 to-lime-500 bg-clip-text text-transparent">
                      Jobs
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
                      <span className="text-lime-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent application monitoring system tracking
                      every submission
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Monitor, track, and manage the status of all your job
                      applications with AI-powered insights
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Monitor Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Monitor,
                    title: "Status Monitoring",
                    desc: "AI tracks every application",
                  },
                  {
                    icon: Activity,
                    title: "Real-time Updates",
                    desc: "Live application status",
                  },
                  {
                    icon: CheckCircle,
                    title: "Success Tracking",
                    desc: "Monitor application outcomes",
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
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-lime-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Application Monitor Stats */}
            <ApplicationMonitorStats
              appliedJobs={appliedJobs}
              filteredJobs={filteredJobs}
            />

            {/* Search and Filter Controls */}
            {appliedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Search monitored applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-sm sm:text-base"
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

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchAppliedJobs}
                        className="px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh monitor</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {loading ? (
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
                        className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-lime-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-lime-500/20"
                      >
                        <Monitor className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {searchTerm
                          ? "No Matching Applications"
                          : "Your Monitor Awaits"}
                      </h3>

                      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {searchTerm
                          ? `No applications found matching "${searchTerm}". Try a different search term.`
                          : "You haven't applied to any jobs yet. Start applying and let your AI monitor track your progress!"}
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
                            className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Discover Jobs to Apply
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
                    <MonitoredApplicationCard
                      key={job.id}
                      job={job}
                      index={index}
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
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-lime-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      Keep the momentum going!
                    </h3>
                    <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">
                      Let your AI agents help you discover, apply, and monitor
                      more opportunities
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/job-discovery")}
                        className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Job Discovery Agent
                      </Button>
                      <Button
                        onClick={() => navigate("/application-automation")}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Application Automation Agent
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

export default AIApplicationMonitor;
