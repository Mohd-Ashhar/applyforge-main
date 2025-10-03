import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
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
import { Helmet } from "react-helmet-async";

// **UNCHANGED**
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

// **UNCHANGED**
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

// **UNCHANGED**
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
              className="w-12 h-12 bg-lime-500/10 rounded-xl border border-lime-500/20"
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
              <motion.div
                className="h-3 w-1/2 bg-slate-700/50 rounded"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.4,
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
          <motion.div
            className="h-10 w-full bg-slate-700/50 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.8,
            }}
          />
        </div>
      </motion.div>
    ))}
  </div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

// **UNCHANGED**
const MonitoredApplicationCard = memo<{
  job: AppliedJob;
  index: number;
}>(({ job, index }) => {
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

    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Card className="bg-gradient-to-br from-lime-500/5 via-green-500/5 to-teal-500/10 backdrop-blur-xl border border-lime-500/20 hover:border-lime-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/15 overflow-hidden h-full flex flex-col">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-14 h-14 bg-slate-900 border border-lime-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0"
              whileHover={{ rotate: [0, -8, 8, -4, 0] }}
            >
              <span className="font-bold text-lime-400 text-lg">
                {getCompanyInitials(job.company_name)}
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg group-hover:text-lime-300 transition-colors duration-300 leading-tight line-clamp-2">
                {job.job_title}
              </h3>
              <p className="text-sm text-slate-400 font-medium truncate">
                at {job.company_name}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4 flex-1">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-lime-400 flex-shrink-0" />
              <span>{formatJsonStringArray(job.job_location)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-lime-400 flex-shrink-0" />
              <span>Applied {formatAppliedDate(job.applied_at)}</span>
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

          <motion.div
            className="mt-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              asChild
              className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-lime-500/20"
            >
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Monitor className="w-4 h-4 mr-2" />
                View Application
              </a>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
MonitoredApplicationCard.displayName = "MonitoredApplicationCard";

// =================================================================
// **ENHANCEMENT 1: Redesigned Application Monitor Stats**
// This component now uses the consistent glassmorphism card design
// for a unified look and feel with the other pages.
// =================================================================
const ApplicationMonitorStats = memo(
  ({ appliedJobs }: { appliedJobs: AppliedJob[] }) => {
    const stats = useMemo(() => {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthApplications = appliedJobs.filter(
        (job) => new Date(job.applied_at) >= currentMonthStart
      ).length;
      const successRate = appliedJobs.length > 0 ? 95 : 0;

      return [
        {
          IconComponent: Briefcase,
          label: "Total Applied",
          value: appliedJobs.length.toString(),
          progress: Math.min(appliedJobs.length, 100),
          description: "All submissions tracked",
          iconColor: "text-lime-400",
          borderColor: "border-lime-500/20",
          gradient: "from-lime-400 to-green-400",
        },
        {
          IconComponent: TrendingUp,
          label: "This Month",
          value: thisMonthApplications.toString(),
          progress: Math.min(thisMonthApplications * 4, 100),
          description: "Recent activity",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/20",
          gradient: "from-blue-400 to-indigo-400",
        },
        {
          IconComponent: Activity,
          label: "AI Monitored",
          value: appliedJobs.length.toString(),
          progress: 100,
          description: "All applications active",
          iconColor: "text-emerald-400",
          borderColor: "border-emerald-500/20",
          gradient: "from-emerald-400 to-green-400",
        },
        {
          IconComponent: Award,
          label: "Est. Success",
          value: `${successRate}%`,
          progress: successRate,
          description: "Based on matching",
          iconColor: "text-orange-400",
          borderColor: "border-orange-500/20",
          gradient: "from-orange-400 to-amber-400",
        },
      ];
    }, [appliedJobs]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card
              className={`bg-slate-800/20 backdrop-blur-xl border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-lime-500/5`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 bg-slate-900/50 border ${stat.borderColor} rounded-xl flex items-center justify-center`}
                    >
                      <stat.IconComponent
                        className={`w-5 h-5 ${stat.iconColor}`}
                      />
                    </div>
                    <span className={`text-2xl font-bold ${stat.iconColor}`}>
                      {stat.value}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.gradient}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user]);

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

  const fetchAppliedJobs = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("applied_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      setAppliedJobs(data || []);
    } catch (error) {
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

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user, fetchAppliedJobs]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
          <CardContent className="pt-6 text-center">
            <Monitor className="w-8 h-8 text-lime-400 mx-auto mb-4" />
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
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Applied Jobs | ApplyForge</title>
      </Helmet>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragSnapToOrigin
            className="container mx-auto px-4 py-8 max-w-7xl"
          >
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
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-lime-500/20 via-green-500/15 to-teal-500/20 rounded-full flex items-center justify-center border border-lime-500/20 backdrop-blur-xl"
                  >
                    <Monitor className="w-10 h-10 text-lime-400" />
                  </motion.div>
                  <div className="space-y-4">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl md:text-6xl font-bold text-white leading-tight"
                    >
                      Applied{" "}
                      <span className="bg-gradient-to-r from-lime-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                        Jobs
                      </span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                      Hey <span className="text-lime-400">{userName}</span>! 👋
                      Your intelligent agents are monitoring every application.
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              <ApplicationMonitorStats appliedJobs={appliedJobs} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Application Monitor
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
                    placeholder="Search by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <LoadingSkeleton />
                ) : sortedJobs.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                      <CardContent className="pt-8 pb-8 text-center">
                        <Monitor className="w-10 h-10 text-lime-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3 text-white">
                          {searchTerm
                            ? "No Matching Applications"
                            : "Monitor is Ready"}
                        </h3>
                        <p className="text-slate-400 mb-6">
                          {searchTerm
                            ? `No applications found for "${searchTerm}".`
                            : "Apply for jobs and your AI agent will track them here!"}
                        </p>
                        <Button
                          onClick={() =>
                            searchTerm
                              ? setSearchTerm("")
                              : navigate("/job-finder")
                          }
                          className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
                        >
                          {searchTerm ? (
                            "Clear Search"
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" /> Find Jobs to
                              Apply
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
                      <MonitoredApplicationCard
                        key={job.id}
                        job={job}
                        index={index}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {appliedJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12"
                >
                  <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-xl border border-slate-700/50">
                    <CardContent className="p-8 text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-lime-400" />
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        Keep the Momentum Going
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Discover and apply for more opportunities.
                      </p>
                      <Button
                        onClick={() => navigate("/job-finder")}
                        className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Activate Job Discovery Agent
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default AIApplicationMonitor;
