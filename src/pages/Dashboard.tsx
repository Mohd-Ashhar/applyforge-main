import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
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
  Cpu,
  LucideRocket,
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
  Lightbulb,
  Home,
  LayoutGrid,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "@/components/header/UserAvatar";
import DashboardHeader from "@/components/DashboardHeader";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

// **UNCHANGED: AGENT DEFINITIONS**
const AI_AGENTS = [
  // ... (Agent definitions are unchanged)
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
      "Missing Keyword Analysis",
      "Enhancement Guidance",
    ],
    metrics: "98% Success Rate",
    comingSoon: false,
    priority: 1,
  },
  {
    id: "resume-optimization-agent",
    icon: FileText,
    title: "Resume Tailoring Agent",
    subtitle: "AI-Powered Resume Tailoring",
    path: "/ai-resume-tailor",
    implemented: true,
    gradient: "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    hoverColor: "hover:border-blue-400/40",
    bgGradient:
      "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10",
    features: [
      "Smart Keywords Optimization",
      "Role Matching",
      "Industry Alignment",
    ],
    metrics: "95% ATS Score",
    comingSoon: false,
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
    features: ["Personalized Crafting", "Tone Adaptation", "Company Research"],
    metrics: "90% Response Rate",
    comingSoon: false,
    priority: 3,
  },
  {
    id: "job-discovery-agent",
    icon: Search,
    title: "Job Discovery Agent",
    subtitle: "Smart Job Matching & Tracking",
    path: "/job-finder",
    implemented: true,
    gradient: "from-orange-500/20 via-amber-500/15 to-yellow-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    hoverColor: "hover:border-orange-400/40",
    bgGradient:
      "bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/10",
    features: ["Smart Filtering", "Real-time Updates", "Fresh Opportunities"],
    metrics: "New Jobs Daily",
    comingSoon: false,
    priority: 4,
  },
  {
    id: "instant-tailoring-agent",
    icon: LucideRocket,
    title: "Instant Generation Agent",
    subtitle: "One-Click Resume Optimization",
    path: "/one-click-tailoring",
    implemented: true,
    gradient: "from-rose-500/20 via-red-500/15 to-orange-500/20",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/20",
    hoverColor: "hover:border-rose-400/40",
    bgGradient:
      "bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10",

    features: ["No Manual Input", "Time Optimization", "Instant Processing"],
    metrics: "Direct Generation",
    comingSoon: false,
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
];

// **UNCHANGED: fetchAppliedJobsCount and custom hook**
const fetchAppliedJobsCount = async (userId?: string): Promise<number> => {
  if (!userId) return 0;
  try {
    const { count, error } = await supabase
      .from("applied_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching applied jobs count:", error);
    return 0; // Return 0 on error
  }
};

type AppliedJobsCountOptions = Omit<
  UseQueryOptions<number>,
  "queryKey" | "queryFn" | "enabled" | "initialData"
>;

const useAppliedJobsCount = (options?: AppliedJobsCountOptions) => {
  const { user } = useAuth();
  const {
    data: appliedJobsCount,
    isLoading,
    refetch,
  } = useQuery<number>({
    queryKey: ["appliedJobsCount", user?.id],
    queryFn: () => fetchAppliedJobsCount(user?.id),
    enabled: !!user,
    initialData: 0,
    ...options,
  });
  return {
    appliedJobsCount: appliedJobsCount ?? 0,
    isLoading,
    refreshCount: refetch,
  };
};

const useCareerState = () => {
  // ... (unchanged)
  const [state] = useState({
    isLoading: false,
    resumeUploaded: true,
    optimizationsRun: 2,
    coverLettersCrafted: 0,
    lastAction: "OPTIMIZED_RESUME",
  });
  return state;
};

// **UNCHANGED: AI Agent Card Component with Dot Indicators**
const AIAgentCard = memo(
  ({
    agent,
    onAgentActivate,
  }: {
    agent: (typeof AI_AGENTS)[number];
    onAgentActivate: (path?: string, implemented?: boolean) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = agent.icon;

    const handleActivate = useCallback(() => {
      onAgentActivate(agent.path, agent.implemented);
    }, [agent.path, agent.implemented, onAgentActivate]);

    // **NEW: Function to get dot color based on agent status**
    const getDotColor = () => {
      if (agent.comingSoon) {
        return "bg-slate-400"; // Gray for coming soon
      }

      // Different colors for different agent types
      switch (agent.id) {
        case "ats-screening-agent":
          return "bg-emerald-400"; // Green for ATS
        case "resume-optimization-agent":
          return "bg-blue-400"; // Blue for resume optimization
        case "cover-letter-crafting-agent":
          return "bg-purple-400"; // Purple for cover letters
        case "job-discovery-agent":
          return "bg-orange-400"; // Orange for job discovery
        case "instant-tailoring-agent":
          return "bg-rose-400"; // Rose for instant generation
        default:
          return "bg-slate-400";
      }
    };

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
          className={`relative ${agent.bgGradient} backdrop-blur-xl border ${agent.borderColor} ${agent.hoverColor} transition-all duration-500 cursor-pointer h-full group hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden`}
          onClick={handleActivate}
        >
          {agent.comingSoon && (
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant="secondary"
                className="text-xs bg-slate-500/20 text-slate-300 border-slate-500/30 font-medium backdrop-blur-sm"
              >
                Coming Soon
              </Badge>
            </div>
          )}

          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className={`relative w-14 h-14 ${agent.bgGradient} border ${agent.borderColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg`}
                whileHover={{
                  rotate: [0, -8, 8, -4, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <Icon className={`w-7 h-7 ${agent.iconColor}`} />
                <div
                  className={`absolute inset-0 w-14 h-14 bg-gradient-to-r ${agent.gradient} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight mb-1">
                  {agent.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-2">
                  {agent.subtitle}
                </p>
                {/* **UPDATED: Added dot component to all agents** */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getDotColor()} ${
                      !agent.comingSoon ? "animate-pulse" : ""
                    } transition-colors duration-300`}
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    {agent.metrics}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-6 flex-1">
              <div className="grid grid-cols-1 gap-2">
                {agent.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${agent.iconColor.replace(
                        "text-",
                        "bg-"
                      )}`}
                    />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className={`flex items-center justify-between py-3 px-4 rounded-xl ${agent.bgGradient} border ${agent.borderColor} group-hover:border-opacity-60 transition-all duration-300`}
              whileHover={{ x: 5 }}
            >
              <span className="font-medium text-white text-sm">
                {agent.comingSoon ? "Get Notified" : "Activate Agent"}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AIAgentCard.displayName = "AIAgentCard";

// **UNCHANGED: LiveAnalyticsCards**
const LiveAnalyticsCards = memo(() => {
  const {
    usage,
    isLoading: usageLoading,
    refreshUsage,
  } = useUsageTracking({ refetchOnWindowFocus: false });

  const {
    appliedJobsCount,
    isLoading: jobsLoading,
    refreshCount,
  } = useAppliedJobsCount({ refetchOnWindowFocus: false });

  const { toast } = useToast();

  const agentMetrics = useMemo(() => {
    const totalAgentActions =
      (usage?.resume_tailors_used || 0) +
      (usage?.cover_letters_used || 0) +
      (usage?.job_searches_used || 0) +
      (usage?.one_click_tailors_used || 0) +
      (usage?.ats_checks_used || 0);

    const activeAgents = [
      (usage?.resume_tailors_used || 0) > 0,
      (usage?.cover_letters_used || 0) > 0,
      (usage?.job_searches_used || 0) > 0,
      (usage?.one_click_tailors_used || 0) > 0,
      (usage?.ats_checks_used || 0) > 0,
    ].filter(Boolean).length;

    const totalAgentsLive = AI_AGENTS.filter((a) => a.implemented).length;

    return {
      agentsLive: totalAgentsLive,
      agentsActive: activeAgents,
      agentActions: totalAgentActions,
    };
  }, [usage]);

  const stats = useMemo(
    () => [
      {
        IconComponent: Bot,
        label: "Agents Live",
        value: agentMetrics.agentsLive.toString(),
        progress: 100,
        description: "Total agents deployed",
        iconColor: "text-blue-400",
        borderColor: "border-blue-500/20",
        gradient: "from-blue-400 to-indigo-400",
      },
      {
        IconComponent: Sparkles,
        label: "Agents Active",
        value: `${agentMetrics.agentsActive}`,
        progress:
          agentMetrics.agentsLive > 0
            ? (agentMetrics.agentsActive / agentMetrics.agentsLive) * 100
            : 0,
        description: "Currently working for you",
        iconColor: "text-purple-400",
        borderColor: "border-purple-500/20",
        gradient: "from-purple-400 to-pink-400",
      },
      {
        IconComponent: Target,
        label: "Agent Actions",
        value: agentMetrics.agentActions.toString(),
        progress: Math.min(agentMetrics.agentActions, 100), // Visual cap at 100
        description: "Actions this month",
        iconColor: "text-emerald-400",
        borderColor: "border-emerald-500/20",
        gradient: "from-emerald-400 to-green-400",
      },
    ],
    [agentMetrics]
  );

  const handleRefresh = useCallback(async () => {
    // ... (unchanged)
    try {
      await Promise.all([refreshUsage(), refreshCount()]);
      toast({
        title: "Agent Analytics Refreshed",
        description: "Your live agent data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh agent analytics. Please try again.",
        variant: "destructive",
      });
    }
  }, [refreshUsage, refreshCount, toast]);

  if (usageLoading || jobsLoading) {
    // ... (unchanged skeleton)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-slate-700 rounded-xl animate-pulse" />
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
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Agent Analytics Live</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Refresh live agent data</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card
              className={`bg-slate-800/20 backdrop-blur-xl border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-blue-500/5`}
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
      </div>
    </motion.div>
  );
});
LiveAnalyticsCards.displayName = "LiveAnalyticsCards";

// =================================================================
// **FIXED: RedesignedCallToAction**
// 1. Removed the unnecessary background div that caused the blue tint.
//    The component now seamlessly blends with the page background.
// 2. Updated the grid to be fully responsive: 1 column on mobile,
//    2 on tablet, and 3 on desktop, preventing overflow.
// =================================================================
const RedesignedCallToAction = memo(() => {
  const navigate = useNavigate();
  const { usage } = useUsageTracking();

  const mapPlanName = (dbPlanName) => {
    const planMapping = {
      Free: "Starter",
      Basic: "Pro",
      Pro: "Advanced",
      Enterprise: "Advanced",
      null: "Starter",
      undefined: "Starter",
    };

    return planMapping[dbPlanName] || "Starter";
  };

  const rawPlan = usage?.plan_type;
  const currentPlan = mapPlanName(rawPlan);

  const planTiers = [
    {
      title: "AI Agent Starter",
      subtitle: "(Starter)",
      aiLabel: "Basic AI Models",
      description: "Powered by foundational AI models",
      color: "text-slate-400",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
      iconBg: "bg-slate-900",
      icon: Bot,
      badgeColor: "bg-emerald-500/20 text-emerald-400",
      planKey: "Starter",
    },
    {
      title: "AI Professional",
      subtitle: "(Pro)",
      aiLabel: "GPT-4 Class AI",
      description: "Enhanced with mid-tier AI for professional results",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      iconBg: "bg-slate-900",
      icon: Cpu,
      badgeColor: "bg-blue-500/20 text-blue-400",
      popular: true,
      planKey: "Pro",
    },
    {
      title: "AI Career Accelerator",
      subtitle: "(Advanced)",
      aiLabel: "GPT-5 Class AI",
      description: "Fueled by cutting-edge AI for maximum career impact",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      iconBg: "bg-slate-900",
      icon: Sparkles,
      badgeColor: "bg-purple-500/20 text-purple-400",
      premium: true,
      planKey: "Advanced",
    },
  ];

  const getUpgradeButton = () => {
    switch (currentPlan) {
      case "Starter":
        return {
          text: "🚀 Upgrade to AI Pro",
          className:
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25",
          path: "/pricing",
          enabled: true,
        };
      case "Pro":
        return {
          text: "⚡ Go AI Advanced",
          className:
            "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25",
          path: "/pricing",
          enabled: true,
        };
      case "Advanced":
        return {
          text: "✅ You're on the best plan!",
          className:
            "bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-75 cursor-not-allowed shadow-lg shadow-emerald-500/25",
          path: null,
          enabled: false,
        };
      default:
        return {
          text: "🚀 Upgrade to AI Pro",
          className:
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25",
          path: "/pricing",
          enabled: true,
        };
    }
  };

  const upgradeButton = getUpgradeButton();

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Upgrade Your AI Agents with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smarter Models
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock powerful AI models to enhance your application's and land
            your dream role faster.
          </motion.p>
        </div>

        {/* Plan cards with responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {planTiers.map((tier, index) => {
            const isCurrentPlan = tier.planKey === currentPlan;

            return (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="relative"
              >
                {/* Badges */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-blue-500 hover:bg-blue-500 text-white px-3 py-1 text-xs font-medium shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {tier.premium && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-purple-500 hover:bg-purple-500 text-white px-3 py-1 text-xs font-medium shadow-lg">
                      Best AI
                    </Badge>
                  </div>
                )}

                {/* Current plan indicator */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 z-10">
                    <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white px-2 py-1 text-xs font-medium shadow-lg">
                      Current
                    </Badge>
                  </div>
                )}

                <Card
                  className={`relative bg-slate-800/40 backdrop-blur-xl border transition-all duration-300 group h-full ${
                    isCurrentPlan
                      ? `ring-2 ring-emerald-500/50 ${tier.borderColor}`
                      : `${tier.borderColor} hover:border-opacity-80`
                  } ${tier.popular ? "ring-2 ring-blue-500/20" : ""} ${
                    tier.premium ? "ring-2 ring-purple-500/20" : ""
                  } hover:shadow-xl`}
                >
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 ${tier.iconBg} border ${tier.borderColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <tier.icon className={`w-8 h-8 ${tier.color}`} />
                    </motion.div>

                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="font-bold text-white text-xl mb-1">
                        {tier.title}
                      </h3>
                      <span className="text-sm text-slate-400 font-medium">
                        {tier.subtitle}
                      </span>
                    </div>

                    {/* AI model badge */}
                    <div
                      className={`text-xs px-3 py-2 rounded-full ${tier.bgColor} ${tier.color} border ${tier.borderColor} mb-4 font-semibold backdrop-blur-sm`}
                    >
                      {tier.aiLabel}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                      {tier.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA button */}
        <div className="text-center">
          <motion.div
            whileHover={{ scale: upgradeButton.enabled ? 1.05 : 1 }}
            whileTap={{ scale: upgradeButton.enabled ? 0.95 : 1 }}
          >
            <Button
              onClick={() =>
                upgradeButton.enabled &&
                upgradeButton.path &&
                navigate(upgradeButton.path)
              }
              size="lg"
              disabled={!upgradeButton.enabled}
              className={`${upgradeButton.className} text-white font-bold px-10 py-5 text-base rounded-full transition-all duration-300 relative overflow-hidden`}
            >
              {/* Shine effect */}
              {upgradeButton.enabled && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  animate={{
                    translateX: ["100%", "100%", "-100%", "-100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              )}
              <span className="relative">{upgradeButton.text}</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});
RedesignedCallToAction.displayName = "RedesignedCallToAction";

// **MAIN DASHBOARD COMPONENT**
const Dashboard = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const greeting = useMemo(() => {
    // ... (unchanged)
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const userName = useMemo(() => {
    // ... (unchanged)
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user]);

  const sortedAgents = useMemo(
    // ... (unchanged)
    () => [...AI_AGENTS].sort((a, b) => a.priority - b.priority),
    []
  );

  const handleAgentActivate = useCallback(
    // ... (unchanged)
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
      <Helmet>
        <title>Your Dashboard | ApplyForge</title>
      </Helmet>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
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
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center pt-8 pb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <UserAvatar
                  user={user}
                  size="lg"
                  variant="premium"
                  showOnlineIndicator
                />
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight"
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
                    className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                  >
                    Your AI agents are ready to accelerate your career journey.
                    <br />
                    <span className="text-blue-400 font-medium">
                      Let's land your dream job 3x faster.
                    </span>
                  </motion.p>
                </div>
              </motion.div>
            </div>

            <LiveAnalyticsCards />

            <div>
              <div className="text-center mb-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                  Your{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Agent
                  </span>{" "}
                  Team
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-slate-300 max-w-3xl mx-auto"
                >
                  Intelligent agents working autonomously to optimize your
                  applications and discover opportunities.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <RedesignedCallToAction />
          </motion.div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
