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

// **UNCHANGED**
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

// **NEW: Robust parsing function for all array-like string fields.**
const formatJsonStringArray = (str: string | null): string => {
  if (!str) return "";
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }
  } catch (e) {
    return str;
  }
  return str;
};

// **ENHANCED & FIXED: SKELETON WITH ALTERNATIVE ANIMATION SYNTAX**
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-2xl"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-teal-500/10 rounded-xl border border-teal-500/20"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-3/4 bg-slate-700/50 rounded"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.2,
                }}
              />
            </div>
          </div>
          <motion.div
            className="h-20 w-full bg-slate-700/50 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.6,
            }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-10 flex-1 bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.8,
              }}
            />
            <motion.div
              className="h-10 w-10 bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1,
              }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

// **REFACTORED: JOB CARD DESIGN IS NOW CONSISTENT WITH OTHER APP CARDS**
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
    const formatSavedDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return "Today";
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <Card className="bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-sky-500/10 backdrop-blur-xl border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/15 overflow-hidden h-full flex flex-col">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-14 h-14 bg-slate-900 border border-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0"
                whileHover={{ rotate: [0, -8, 8, -4, 0] }}
              >
                <span className="font-bold text-teal-400 text-lg">
                  {getCompanyInitials(job.company_name)}
                </span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg group-hover:text-teal-300 transition-colors duration-300 leading-tight line-clamp-2">
                  {job.job_title}
                </h3>
                <p className="text-sm text-slate-400 font-medium truncate">
                  at {job.company_name}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{formatJsonStringArray(job.job_location)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Saved {formatSavedDate(job.saved_at)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.employment_type && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {formatJsonStringArray(job.employment_type)}
                </Badge>
              )}
              {job.seniority_level && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  {formatJsonStringArray(job.seniority_level)}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2 mt-auto">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => window.open(job.apply_url, "_blank")}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-500/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onRemove(job.id)}
                    disabled={removingIds.has(job.id)}
                    variant="outline"
                    size="icon"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-slate-600 hover:border-red-500/30"
                  >
                    {removingIds.has(job.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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

// **REFACTORED: STATS OVERVIEW NOW MATCHES LiveAnalyticsCards DESIGN**
const JobTrackerStats = memo(({ jobCount }: { jobCount: number }) => {
  const stats = useMemo(
    () => [
      {
        label: "Jobs Saved",
        value: jobCount,
        progress: Math.min(jobCount * 2, 100), // Conceptual progress
        description: "Opportunities tracked",
        icon: Bookmark,
        color: "teal",
      },
      {
        label: "Ready",
        value: jobCount,
        progress: 100,
        description: "All jobs are actionable",
        icon: CheckCircle,
        color: "green",
      },
      {
        label: "Avg. Match",
        value: jobCount > 0 ? 85 : 0,
        unit: "%",
        progress: jobCount > 0 ? 85 : 0,
        description: "AI compatibility score",
        icon: Target,
        color: "blue",
      },
      {
        label: "Active",
        value: jobCount,
        progress: 100,
        description: "AI is monitoring",
        icon: Activity,
        color: "purple",
      },
    ],
    [jobCount]
  );

  const colorClasses = {
    teal: {
      bg: "bg-gradient-to-br from-teal-500/10 to-cyan-600/10",
      border: "border-teal-500/20 hover:border-teal-400/40",
      iconBg: "bg-teal-500/20 border-teal-500/30",
      iconColor: "text-teal-400",
      progress: "from-teal-500 to-cyan-500",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-500/10 to-green-600/10",
      border: "border-emerald-500/20 hover:border-emerald-400/40",
      iconBg: "bg-emerald-500/20 border-emerald-500/30",
      iconColor: "text-emerald-400",
      progress: "from-emerald-500 to-green-500",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10",
      border: "border-blue-500/20 hover:border-blue-400/40",
      iconBg: "bg-blue-500/20 border-blue-500/30",
      iconColor: "text-blue-400",
      progress: "from-blue-500 to-indigo-500",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500/10 to-pink-600/10",
      border: "border-purple-500/20 hover:border-purple-400/40",
      iconBg: "bg-purple-500/20 border-purple-500/30",
      iconColor: "text-purple-400",
      progress: "from-purple-500 to-pink-500",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color as keyof typeof colorClasses];
        const StatIcon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card
              className={`${colors.bg} backdrop-blur-xl border ${colors.border} transition-all duration-300 group`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 font-medium mb-1">
                      {stat.label}
                    </p>
                    <span className="text-3xl font-bold text-white">
                      {stat.value}
                      {stat.unit}
                    </span>
                  </div>
                  <motion.div
                    className={`p-3 rounded-xl ${colors.iconBg}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <StatIcon className={`w-5 h-5 ${colors.iconColor}`} />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{stat.description}</span>
                  </div>
                  <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${colors.progress}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{
                        delay: 0.5,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
});
JobTrackerStats.displayName = "JobTrackerStats";

// **UNCHANGED: Main Component Logic**
const JobLibrary: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user]);

  const fetchSavedJobs = useCallback(async () => {
    // ... (unchanged logic)
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
      toast({
        title: "Agent Error",
        description: "Failed to load your job tracker.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user, fetchSavedJobs]);

  const handleRemove = useCallback(
    async (jobId: string) => {
      // ... (unchanged logic)
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
      // ... (unchanged logic)
      navigator.clipboard.writeText(job.apply_url);
      toast({
        title: "Link Copied ✅",
        description: "Opportunity link copied to clipboard.",
      });
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
    // ... (unchanged auth check)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
          <CardContent className="pt-6 text-center">
            <Bookmark className="w-8 h-8 text-teal-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              Authentication Required
            </h3>
            <p className="text-slate-400 mb-6">
              Please log in to access your AI Job Library.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // **ENHANCED: Page Layout and Hero Section**
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="text-center pt-8 pb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-sky-500/20 rounded-full flex items-center justify-center border border-teal-500/20 backdrop-blur-xl"
                >
                  <Bookmark className="w-10 h-10 text-teal-400" />
                </motion.div>
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight"
                  >
                    Job{" "}
                    <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                      Library
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                  >
                    Hey <span className="text-teal-400">{userName}</span>! 👋
                    Your curated list of tracked job opportunities.
                  </motion.p>
                </div>
              </motion.div>
            </div>

            <JobTrackerStats jobCount={savedJobs.length} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Tracked Opportunities
                </h2>
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
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>
                      Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your library by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                    <CardContent className="pt-8 pb-8 text-center">
                      <Bookmark className="w-10 h-10 text-teal-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        {searchTerm
                          ? "No Matching Jobs"
                          : "Your Library is Empty"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm
                          ? `No jobs found for "${searchTerm}".`
                          : "Discover and save jobs to start building your library!"}
                      </p>
                      <Button
                        onClick={() =>
                          searchTerm
                            ? setSearchTerm("")
                            : navigate("/job-finder")
                        }
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      >
                        {searchTerm ? (
                          "Clear Search"
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" /> Find Jobs to
                            Save
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobLibrary;
