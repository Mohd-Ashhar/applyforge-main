import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText,
  PenSquare,
  Search,
  Shield,
  Zap,
  Bot,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Mail,
  Trophy,
  Target,
  Star,
  Flame,
  Award,
  Calendar,
  CheckCircle,
  BarChart3,
  Activity,
  Sparkles,
  Plus,
  Eye,
  Brain,
  Rocket,
  Globe,
  ChevronRight,
  RefreshCw,
  Bookmark,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "@/components/header/UserAvatar";
import DashboardHeader from "@/components/DashboardHeader";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { supabase } from "@/integrations/supabase/client";

// **REDESIGNED AGENT-FOCUSED FEATURES - MOBILE-ENHANCED**
const AI_AGENTS = [
  {
    id: "ats-screening-agent",
    icon: Shield,
    title: "ATS Screening Agent",
    subtitle: "Resume Analysis & Optimization",
    path: "/ats-checker",
    implemented: true,
    gradient: "from-emerald-500/20 via-green-500/15 to-teal-500/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    hoverColor: "hover:border-emerald-400/40",
    bgGradient:
      "bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/10",
    features: [
      "ATS Score Analysis",
      "Keyword Optimization",
      "Format Validation",
    ],
    metrics: "98% Success Rate",
    priority: 1,
  },
  {
    id: "resume-optimization-agent",
    icon: FileText,
    title: "Resume Optimization Agent",
    subtitle: "AI-Powered Resume Tailoring",
    path: "/ai-resume-tailor",
    implemented: true,
    gradient: "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    hoverColor: "hover:border-blue-400/40",
    bgGradient:
      "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10",
    features: ["Smart Keywords", "Role Matching", "Industry Alignment"],
    metrics: "3x Faster Processing",
    priority: 2,
  },
  {
    id: "cover-letter-crafting-agent",
    icon: Mail,
    title: "Cover Letter Crafting Agent",
    subtitle: "Personalized Letter Generation",
    path: "/cover-letter-generator",
    implemented: true,
    gradient: "from-purple-500/20 via-pink-500/15 to-rose-500/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    hoverColor: "hover:border-purple-400/40",
    bgGradient:
      "bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/10",
    features: ["Tone Adaptation", "Company Research", "Personal Branding"],
    metrics: "85% Response Rate",
    priority: 3,
  },
  {
    id: "job-discovery-agent",
    icon: Search,
    title: "Job Discovery Agent",
    subtitle: "Smart Job Matching & Tracking",
    path: "/job-finder",
    implemented: true,
    gradient: "from-cyan-500/20 via-teal-500/15 to-emerald-500/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    hoverColor: "hover:border-cyan-400/40",
    bgGradient:
      "bg-gradient-to-br from-cyan-500/5 via-teal-500/5 to-emerald-500/10",
    features: ["Smart Filtering", "Real-time Updates", "Job Tracking"],
    metrics: "50+ New Jobs Daily",
    priority: 4,
  },
  {
    id: "instant-tailoring-agent",
    icon: Zap,
    title: "Instant Tailoring Agent",
    subtitle: "One-Click Resume Optimization",
    path: "/one-click-tailoring",
    implemented: true,
    gradient: "from-orange-500/20 via-amber-500/15 to-yellow-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    hoverColor: "hover:border-orange-400/40",
    bgGradient:
      "bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/10",
    features: ["Instant Processing", "Batch Operations", "Time Optimization"],
    metrics: "< 30 Seconds",
    priority: 5,
  },
  {
    id: "auto-apply-agent",
    icon: Bot,
    title: "Auto-Apply Agent",
    subtitle: "24/7 Application Automation",
    path: "/auto-apply-agent",
    implemented: false,
    gradient: "from-slate-500/20 via-gray-500/15 to-zinc-500/20",
    iconColor: "text-slate-400",
    borderColor: "border-slate-500/20",
    hoverColor: "hover:border-slate-400/40",
    bgGradient:
      "bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/10",
    features: ["24/7 Operation", "Smart Filtering", "Application Tracking"],
    metrics: "Coming Soon",
    comingSoon: true,
    priority: 6,
  },
] as const;

// **MOBILE-ENHANCED LIVE ANALYTICS HOOK**
const useAppliedJobsCount = () => {
  const { user } = useAuth();
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppliedJobsCount = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { count, error } = await supabase
        .from("applied_jobs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) throw error;
      setAppliedJobsCount(count || 0);
    } catch (error) {
      console.error("Error fetching applied jobs count:", error);
      setAppliedJobsCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppliedJobsCount();
  }, [fetchAppliedJobsCount]);

  return { appliedJobsCount, isLoading, refreshCount: fetchAppliedJobsCount };
};

// **NEW: MOBILE ANALYTICS SUMMARY COMPONENT**
const AnalyticsSummary = memo(() => {
  const { usage, limits } = useUsageTracking();
  const { appliedJobsCount } = useAppliedJobsCount();

  const resume = usage?.resume_tailors_used ?? 0;
  const resumeMax = limits?.resume_tailors_used ?? 50;
  const letters = usage?.cover_letters_used ?? 0;
  const lettersMax = limits?.cover_letters_used ?? 50;

  return (
    <Link
      to="/usage"
      className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-600/60 bg-slate-700/40 text-xs font-medium text-slate-200 backdrop-blur focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-background"
      aria-label="View detailed usage statistics"
    >
      {resume}/{resumeMax} resumes • {letters}/{lettersMax} letters • {appliedJobsCount} jobs
      <ChevronRight className="w-3 h-3 shrink-0" />
    </Link>
  );
});

AnalyticsSummary.displayName = "AnalyticsSummary";

// **FULLY MOBILE-ENHANCED AI AGENT CARD**
const AIAgentCard = memo<{
  agent: (typeof AI_AGENTS)[number];
  onAgentActivate: (path?: string, implemented?: boolean) => void;
}>(({ agent, onAgentActivate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = agent.icon;

  const handleActivate = useCallback(() => {
    onAgentActivate(agent.path, agent.implemented);
  }, [agent.path, agent.implemented, onAgentActivate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group h-full"
    >
      <Card
        className={`relative ${agent.bgGradient} backdrop-blur-xl border ${agent.borderColor} ${agent.hoverColor} transition-all duration-500 cursor-pointer h-full group hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-background`}
        onClick={handleActivate}
        onKeyUp={(e) => e.key === "Enter" && handleActivate()}
        tabIndex={0}
        role="button"
        aria-label={`Activate ${agent.title}`}
      >
        {/* Coming Soon Badge */}
        {agent.comingSoon && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
            <Badge
              variant="secondary"
              className="text-xs bg-slate-500/20 text-slate-300 border-slate-500/30 font-medium backdrop-blur-sm"
            >
              Coming Soon
            </Badge>
          </div>
        )}

        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
          {/* **MOBILE-ENHANCED Agent Icon & Header** */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <motion.div
              className={`relative w-12 h-12 sm:w-14 sm:h-14 ${agent.bgGradient} border ${agent.borderColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg flex-shrink-0`}
              whileHover={{
                rotate: [0, -8, 8, -4, 0],
                transition: { duration: 0.6 },
              }}
            >
              <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${agent.iconColor}`} />

              {/* Glow effect */}
              <div
                className={`absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${agent.gradient} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight mb-1 line-clamp-2">
                {agent.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mb-2 line-clamp-1">
                {agent.subtitle}
              </p>
              <div className="flex items-center gap-2">
                <div
                  aria-label="live metric indicator"
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${agent.iconColor.replace(
                    "text-",
                    "bg-"
                  )} animate-pulse flex-shrink-0`}
                />
                <span className="text-xs text-slate-300 font-medium truncate">
                  {agent.metrics}
                </span>
              </div>
            </div>
          </div>

          {/* **MOBILE-ENHANCED Agent Capabilities** */}
          <div className="mb-4 sm:mb-6 flex-1">
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              {agent.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300"
                >
                  <div
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${agent.iconColor.replace(
                      "text-",
                      "bg-"
                    )} flex-shrink-0`}
                  />
                  <span className="truncate">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* **MOBILE-ENHANCED Activation Button** */}
          <motion.div
            className={`flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl ${agent.bgGradient} border ${agent.borderColor} group-hover:border-opacity-60 group-hover:bg-gradient-to-r group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300`}
            whileHover={{ x: 5 }}
          >
            <span className="font-medium text-white group-hover:text-blue-200 text-xs sm:text-sm truncate transition-colors duration-300">
              {agent.comingSoon ? "Get Notified" : "Activate Agent"}
            </span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

AIAgentCard.displayName = "AIAgentCard";

// **ENHANCED: MOBILE-ENHANCED LIVE ANALYTICS CARDS**
const LiveAnalyticsCards = memo<{ className?: string }>(({ className = "" }) => {
  const {
    usage,
    limits,
    isLoading: usageLoading,
    refreshUsage,
  } = useUsageTracking();
  const {
    appliedJobsCount,
    isLoading: jobsLoading,
    refreshCount,
  } = useAppliedJobsCount();
  const { toast } = useToast();

  // Calculate live metrics
  const liveMetrics = useMemo(() => {
    const resumeOptimized = usage?.resume_tailors_used || 0;
    const coverLettersCrafted = usage?.cover_letters_used || 0;
    const jobsApplied = appliedJobsCount;

    // Calculate progress percentages based on limits
    const resumeLimit = limits?.resume_tailors_used || 50;
    const coverLetterLimit = limits?.cover_letters_used || 50;

    const resumeProgress =
      resumeLimit > 0
        ? Math.min((resumeOptimized / resumeLimit) * 100, 100)
        : 0;
    const coverLetterProgress =
      coverLetterLimit > 0
        ? Math.min((coverLettersCrafted / coverLetterLimit) * 100, 100)
        : 0;
    const jobsProgress = Math.min((jobsApplied / 100) * 100, 100); // Assuming 100 as target

    return {
      resumeOptimized,
      coverLettersCrafted,
      jobsApplied,
      resumeProgress,
      coverLetterProgress,
      jobsProgress,
      resumeLimit,
      coverLetterLimit,
    };
  }, [usage, limits, appliedJobsCount]);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refreshUsage(), refreshCount()]);
      toast({
        title: "Analytics Refreshed",
        description: "Your live data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    }
  }, [refreshUsage, refreshCount, toast]);

  if (usageLoading || jobsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 ${className}`}
      >
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            role="status"
            aria-label="Loading analytics data"
            className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-6 sm:h-8 w-12 sm:w-16 bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-700 rounded-xl animate-pulse" />
              </div>
              <div className="h-2 w-full bg-slate-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`mb-8 sm:mb-12 ${className}`}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
        >
          Live Analytics
        </motion.h2>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm h-9 sm:h-10"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Refresh live data</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Resume Optimized Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1">
                    Resume Optimized
                  </p>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span aria-live="polite" className="text-2xl sm:text-3xl font-bold text-white">
                      {liveMetrics.resumeOptimized}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      of {liveMetrics.resumeLimit}
                    </span>
                  </div>
                </div>

                <motion.div
                  className="p-2 sm:p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 whitespace-nowrap"
                >
                  ↗
                  <span className="truncate">
                    {liveMetrics.resumeOptimized} this period
                  </span>
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Usage Progress</span>
                  <span>{Math.round(liveMetrics.resumeProgress)}%</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Progress
                    value={liveMetrics.resumeProgress}
                    className="h-2 bg-slate-700/50"
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cover Letter Crafted Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1">
                    Cover Letter Crafted
                  </p>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span aria-live="polite" className="text-2xl sm:text-3xl font-bold text-white">
                      {liveMetrics.coverLettersCrafted}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      of {liveMetrics.coverLetterLimit}
                    </span>
                  </div>
                </div>

                <motion.div
                  className="p-2 sm:p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 whitespace-nowrap"
                >
                  ↗
                  <span className="truncate">
                    {liveMetrics.coverLettersCrafted} created
                  </span>
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Usage Progress</span>
                  <span>{Math.round(liveMetrics.coverLetterProgress)}%</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <Progress
                    value={liveMetrics.coverLetterProgress}
                    className="h-2 bg-slate-700/50"
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Applied Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1">
                    Jobs Applied
                  </p>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span aria-live="polite" className="text-2xl sm:text-3xl font-bold text-white">
                      {liveMetrics.jobsApplied}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate">
                      total applications
                    </span>
                  </div>
                </div>

                <motion.div
                  className="p-2 sm:p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 whitespace-nowrap"
                >
                  ↗<span className="truncate">Active job search</span>
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Application Activity</span>
                  <span className="truncate">
                    Tracking {liveMetrics.jobsApplied} applications
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Progress
                    value={Math.min(liveMetrics.jobsApplied * 2, 100)} // Visual progress
                    className="h-2 bg-slate-700/50"
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
});

LiveAnalyticsCards.displayName = "LiveAnalyticsCards";

// **MOBILE-ENHANCED CAREER ACCELERATION HUB**
const RedesignedAchievementSection = memo(() => {
  const navigate = useNavigate();

  const progressMetrics = [
    {
      icon: BarChart3,
      title: "Weekly Progress",
      value: "72%",
      description: "Goal completion rate",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Flame,
      title: "Activity Streak",
      value: "5 Days",
      description: "Consecutive active days",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      icon: Trophy,
      title: "Next Milestone",
      value: "Resume Master",
      description: "80% complete",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-8 sm:mb-12"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
        >
          Career Progress Hub
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto"
        >
          Track your achievements and accelerate your career journey
        </motion.p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {progressMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`${metric.bgColor} backdrop-blur-xl border ${metric.borderColor} hover:border-opacity-60 hover:shadow-xl transition-all duration-300 group`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <motion.div
                    className={`p-2 sm:p-3 rounded-xl ${metric.bgColor} border ${metric.borderColor} flex-shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <metric.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`}
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base sm:text-lg truncate">
                      {metric.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 truncate">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {metric.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* **COMPLETELY FIXED: Mobile-Friendly Dual CTAs** */}
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs"
          >
            <Button
              onClick={() => navigate("/saved-jobs")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 sm:px-6 py-3 text-sm sm:text-base h-11 sm:h-12 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="truncate">Continue Progress</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs"
          >
            <Button
              onClick={() => navigate("/job-finder")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold backdrop-blur-sm h-11 sm:h-12 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="truncate">Discover Opportunities</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

RedesignedAchievementSection.displayName = "RedesignedAchievementSection";

// **MOBILE-ENHANCED READY TO ACCELERATE SECTION**
const RedesignedCallToAction = memo(() => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "ATS Optimization",
      description: "98% success rate",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: Zap,
      title: "Instant Tailoring",
      description: "Under 30 seconds",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Briefcase,
      title: "Smart Tracking",
      description: "Seamless management",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="text-center"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
        >
          Ready to Accelerate?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto"
        >
          Join thousands of professionals landing their dream jobs 3x faster
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`${feature.bgColor} backdrop-blur-xl border ${feature.borderColor} hover:border-opacity-60 hover:shadow-xl transition-all duration-300 group`}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} border ${feature.borderColor} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`}
                  />
                </motion.div>
                <h3 className="font-semibold text-white text-base sm:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Single CTA */}
      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => navigate("/ats-checker")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg h-11 sm:h-12 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="truncate">Get Started</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
});

RedesignedCallToAction.displayName = "RedesignedCallToAction";

// **MAIN MOBILE-ENHANCED DASHBOARD COMPONENT**
const Dashboard = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // **OPTIMIZED: Calculate greeting once per session**
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // **OPTIMIZED: Stable user name**
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0]
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  // **ENHANCED: Sort agents by priority**
  const sortedAgents = useMemo(() => {
    return [...AI_AGENTS].sort((a, b) => a.priority - b.priority);
  }, []);

  // **OPTIMIZED: Stable agent activation handler**
  const handleAgentActivate = useCallback(
    (path?: string, implemented = false) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!implemented) {
        toast({
          title: "Agent Coming Soon! 🚀",
          description:
            "This AI agent is currently being developed. We'll notify you when it's ready to deploy!",
          duration: 3000,
        });
        return;
      }

      if (path) {
        navigate(path);
      }
    },
    [user, navigate, toast]
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 sm:space-y-12"
          >
            {/* **MOBILE-ENHANCED Hero Welcome Section** */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-4 sm:gap-6"
              >
                <UserAvatar
                  user={user}
                  size="lg"
                  variant="premium"
                  showOnlineIndicator
                  aria-label={user ? `${userName} is online` : 'User online'}
                />

                <div className="space-y-3 sm:space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    {greeting},{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {userName}
                    </span>
                    ! 👋
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                  >
                    Your AI agents are ready to accelerate your career journey.
                    <br />
                    <span className="text-blue-400 font-medium">
                      Let's land your dream job 3x faster.
                    </span>
                  </motion.p>

                  {/* **NEW: Mobile Analytics Summary** */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <AnalyticsSummary />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* **ENHANCED: Live Analytics Section - Desktop Only** */}
            <LiveAnalyticsCards className="hidden sm:block" />

            {/* **MOBILE-ENHANCED AI Agents Section** */}
            <div>
              <div className="text-center mb-8 sm:mb-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
                >
                  Your AI Agents
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto"
                >
                  Intelligent agents working autonomously to optimize your
                  applications, bypass ATS barriers, and discover opportunities
                  in seconds.
                </motion.p>
              </div>

              {/* **ENHANCED: Better responsive grid** */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {sortedAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                  >
                    <AIAgentCard
                      agent={agent}
                      onAgentActivate={handleAgentActivate}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Career Progress Hub */}
            <RedesignedAchievementSection />

            {/* Ready to Accelerate Section */}
            <RedesignedCallToAction />
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
