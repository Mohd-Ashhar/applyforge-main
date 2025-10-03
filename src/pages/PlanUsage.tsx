import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
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
  BarChart3,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Info,
  Calendar,
  Target,
  Award,
  ArrowRight,
  Clock,
  Shield,
  Infinity as InfinityIcon,
  Eye,
  AlertCircle,
  FileText,
  Search,
  ArrowUp,
  RefreshCw,
  Star,
  Crown,
  Sparkles,
  TrendingDown,
  Activity,
  Users,
  ChevronRight,
  Flame,
  Home,
  Mail, // CORRECTED: Imported Mail icon
  type LucideIcon,
} from "lucide-react";
import { useUsageTracking, type UsageType } from "@/hooks/useUsageTracking";
import PlanBadge from "@/components/header/PlanBadge";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// **TYPES & INTERFACES (UNCHANGED)**
interface UsageItem {
  label: string;
  used: number;
  limit: number;
  IconComponent: LucideIcon;
  isUnused?: boolean;
  usageType: UsageType;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
  bgGradient: string;
}

interface EnhancedProgressBarProps {
  value: number;
  used: number;
  limit: number;
  label: string;
  description: string;
  isAtLimit: boolean;
  isOverLimit: boolean;
  isUnused: boolean;
  IconComponent: LucideIcon;
  gradient: string;
  iconColor: string;
  borderColor: string;
  bgGradient: string;
}

interface UsageSummaryStatsProps {
  usageItems: UsageItem[];
  planType: string;
  totalUsed: number;
}

interface PlanFeature {
  name: string;
  limits: string;
  price: string;
  IconComponent: LucideIcon;
  color: string;
  bgGradient: string;
  borderColor: string;
  gradient: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
}

// **PLAN CONFIGURATION (UNCHANGED)**
const getPlanLimit = (planType: string, usageType: UsageType): number => {
  const limits = {
    Free: {
      resume_tailors_used: 3,
      cover_letters_used: 3,
      job_searches_used: 3,
      one_click_tailors_used: 3,
      ats_checks_used: 3,
    },
    Basic: {
      resume_tailors_used: 25,
      cover_letters_used: 25,
      job_searches_used: 25,
      one_click_tailors_used: 25,
      ats_checks_used: 25,
    },
    Pro: {
      resume_tailors_used: -1,
      cover_letters_used: -1,
      job_searches_used: -1,
      one_click_tailors_used: -1,
      ats_checks_used: -1,
    },
  };

  const planLimits = limits[planType as keyof typeof limits] || limits["Free"];
  return planLimits[usageType];
};

// **USAGE ITEMS CONFIGURATION (NOW FULLY CORRECTED)**
const getUsageItems = (usage: any): UsageItem[] => [
  {
    // Corresponds to "Resume Tailoring Agent" in Dashboard.tsx
    label: "Resume Tailors",
    description: "AI-powered resume optimization",
    used: usage.resume_tailors_used || 0,
    limit: getPlanLimit(usage.plan_type, "resume_tailors_used"),
    IconComponent: FileText, // CORRECTED: Was Target, now FileText to match dashboard
    isUnused: (usage.resume_tailors_used || 0) === 0,
    usageType: "resume_tailors_used",
    gradient: "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgGradient:
      "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10",
  },
  {
    // Corresponds to "Cover Letter Crafting Agent" in Dashboard.tsx
    label: "Cover Letters",
    description: "Personalized cover letter generation",
    used: usage.cover_letters_used || 0,
    limit: getPlanLimit(usage.plan_type, "cover_letters_used"),
    IconComponent: Mail, // CORRECTED: Was FileText, now Mail to match dashboard
    isUnused: (usage.cover_letters_used || 0) === 0,
    usageType: "cover_letters_used",
    gradient: "from-purple-500/20 via-pink-500/15 to-rose-500/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgGradient:
      "bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/10",
  },
  {
    // Corresponds to "Job Discovery Agent" in Dashboard.tsx
    label: "Job Searches",
    description: "Smart job discovery and matching",
    used: usage.job_searches_used || 0,
    limit: getPlanLimit(usage.plan_type, "job_searches_used"),
    IconComponent: Search,
    isUnused: (usage.job_searches_used || 0) === 0,
    usageType: "job_searches_used",
    // CORRECTED: Colors updated to orange/yellow to match dashboard
    gradient: "from-orange-500/20 via-amber-500/15 to-yellow-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgGradient:
      "bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/10",
  },
  {
    // Corresponds to "Instant Generation Agent" in Dashboard.tsx
    label: "Instant Generations",
    description: "Instant resumes & cover letters",
    used: usage.one_click_tailors_used || 0,
    limit: getPlanLimit(usage.plan_type, "one_click_tailors_used"),
    IconComponent: Zap,
    isUnused: (usage.one_click_tailors_used || 0) === 0,
    usageType: "one_click_tailors_used",
    // CORRECTED: Colors updated to rose/red to match dashboard
    gradient: "from-rose-500/20 via-red-500/15 to-orange-500/20",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/20",
    bgGradient:
      "bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10",
  },
  {
    // Corresponds to "ATS Screening Agent" in Dashboard.tsx
    label: "ATS Checks",
    description: "Resume analysis & scoring",
    used: usage.ats_checks_used || 0,
    limit: getPlanLimit(usage.plan_type, "ats_checks_used"),
    IconComponent: Shield,
    isUnused: (usage.ats_checks_used || 0) === 0,
    usageType: "ats_checks_used",
    gradient: "from-emerald-500/20 via-green-500/15 to-teal-500/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgGradient:
      "bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/10",
  },
];

// ... (The rest of the file is unchanged as its logic and structure were already correct)

// **ANIMATIONS (UNCHANGED)**
const subtleTransition = (duration: number, delay = 0): Transition => ({
  duration,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeInOut",
  delay,
});

// **LOADING SKELETON (UNCHANGED)**
const UsageLoadingSkeleton = memo(() => (
  <div className="space-y-4 sm:space-y-6 px-2">
    {/* Header Skeleton */}
    <div className="text-center space-y-3 sm:space-y-4">
      <motion.div
        className="h-5 w-28 sm:h-6 sm:w-32 md:h-8 md:w-48 bg-slate-700/30 rounded-lg mx-auto"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={subtleTransition(2)}
      />
      <motion.div
        className="h-3 w-48 sm:h-3 sm:w-64 md:h-4 md:w-96 bg-slate-700/20 rounded mx-auto"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={subtleTransition(2, 0.2)}
      />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Card
          key={index}
          className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50"
        >
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <motion.div
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-slate-700/30 rounded-lg sm:rounded-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={subtleTransition(2, index * 0.1)}
              />
              <motion.div
                className="h-4 w-8 sm:h-5 sm:w-12 md:h-6 md:w-16 bg-slate-700/20 rounded"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={subtleTransition(2, index * 0.1 + 0.1)}
              />
            </div>
            <motion.div
              className="h-3 w-12 sm:h-3 sm:w-16 md:h-4 md:w-24 bg-slate-700/30 rounded mb-2"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={subtleTransition(2, index * 0.1 + 0.2)}
            />
            <motion.div
              className="h-1 sm:h-1.5 w-full bg-slate-700/20 rounded-full"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={subtleTransition(2, index * 0.1 + 0.3)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
));

UsageLoadingSkeleton.displayName = "UsageLoadingSkeleton";

// **FEATURE USAGE CARD (UNCHANGED)**
const EnhancedProgressBar = memo<EnhancedProgressBarProps>(
  ({
    value,
    used,
    limit,
    label,
    description,
    isAtLimit,
    isOverLimit,
    isUnused,
    IconComponent,
    gradient,
    iconColor,
    borderColor,
    bgGradient,
  }) => {
    const [animatedValue, setAnimatedValue] = useState<number>(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }, [value]);

    const getProgressColor = useCallback((): string => {
      if (isOverLimit) return "from-orange-400 to-red-400";
      if (isAtLimit) return "from-orange-400 to-orange-500";
      if (value > 80) return "from-yellow-400 to-orange-400";
      return gradient.replace(/\/20|\/15|\/10/g, "");
    }, [isOverLimit, isAtLimit, value, gradient]);

    const getStatusText = useCallback((): string => {
      if (isOverLimit) return "Over Limit";
      if (isAtLimit) return "At Capacity";
      if (isUnused) return "Try it!";
      return "Active";
    }, [isOverLimit, isAtLimit, isUnused]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.01 }}
        className="group h-full"
      >
        <Card
          className={`${bgGradient} backdrop-blur-xl border ${borderColor} hover:border-opacity-60 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden relative`}
        >
          {isUnused && (
            <div className="absolute top-3 right-3 z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 font-medium">
                  Try This
                </Badge>
              </motion.div>
            </div>
          )}
          <CardContent className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className={`w-12 h-12 ${bgGradient} border ${borderColor} rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm flex-shrink-0`}
                whileHover={{
                  rotate: [0, -4, 4, -2, 0],
                  transition: { duration: 0.4 },
                }}
              >
                <IconComponent className={`w-6 h-6 ${iconColor}`} />
                <div
                  className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`}
                />
              </motion.div>

              <div className="flex flex-col items-end ml-2">
                <span className="text-sm font-bold text-white">
                  {used}
                  <span className="text-slate-400 mx-0.5">/</span>
                  {limit === -1 ? (
                    <InfinityIcon className="w-4 h-4 inline text-emerald-400" />
                  ) : (
                    limit
                  )}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {getStatusText()}
                </span>
              </div>
            </div>
            <div className="mb-4 flex-1">
              <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight mb-1">
                {label}
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                {description}
              </p>
            </div>
            {limit !== -1 && (
              <div className="space-y-2">
                <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(animatedValue, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{Math.round(value)}% Utilized</span>
                  <span>
                    {limit - used > 0 ? `${limit - used} left` : "No remaining"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);
EnhancedProgressBar.displayName = "EnhancedProgressBar";

// **USAGE SUMMARY STATS COMPONENT (UNCHANGED)**
const UsageSummaryStats = memo<UsageSummaryStatsProps>(
  ({ usageItems, planType, totalUsed }) => {
    const validItems = usageItems.filter((item) => item.limit !== -1);
    const averageUsage =
      validItems.length > 0
        ? Math.round(
            validItems.reduce(
              (sum, item) =>
                sum + Math.min((item.used / item.limit) * 100, 100),
              0
            ) / validItems.length
          )
        : 0;
    const hasOverLimit = usageItems.some(
      (item) => item.limit !== -1 && item.used > item.limit
    );
    const hasAtLimit = usageItems.some(
      (item) => item.limit !== -1 && item.used >= item.limit
    );
    const activeFeatures = usageItems.filter((item) => item.used > 0).length;

    const getStatusConfig = useCallback(() => {
      if (hasOverLimit)
        return {
          icon: AlertTriangle,
          color: "text-orange-400",
          label: "Over Limits",
          borderColor: "border-orange-500/20",
          gradient: "from-orange-400 to-red-400",
        };
      if (hasAtLimit)
        return {
          icon: AlertCircle,
          color: "text-orange-400",
          label: "At Capacity",
          borderColor: "border-orange-500/20",
          gradient: "from-yellow-400 to-orange-400",
        };
      return {
        icon: CheckCircle,
        color: "text-emerald-400",
        label: "Healthy",
        borderColor: "border-emerald-500/20",
        gradient: "from-emerald-400 to-green-400",
      };
    }, [hasOverLimit, hasAtLimit]);

    const statusConfig = getStatusConfig();
    const stats = useMemo(
      () => [
        {
          IconComponent: TrendingUp,
          label: "Total Usage",
          value: totalUsed.toString(),
          progress: Math.min(totalUsed, 100),
          description: "Actions this month",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/20",
          gradient: "from-blue-400 to-indigo-400",
        },
        {
          IconComponent: Target,
          label: "Avg Utilization",
          value: planType === "Pro" ? "∞" : `${averageUsage}%`,
          progress: planType === "Pro" ? 100 : averageUsage,
          description: "Of plan limits",
          iconColor: "text-purple-400",
          borderColor: "border-purple-500/20",
          gradient: "from-purple-400 to-pink-400",
        },
        {
          IconComponent: Activity,
          label: "Active Features",
          value: `${activeFeatures}/5`,
          progress: (activeFeatures / 5) * 100,
          description: "Features in use",
          iconColor: "text-cyan-400",
          borderColor: "border-cyan-500/20",
          gradient: "from-cyan-400 to-teal-400",
        },
        {
          IconComponent: statusConfig.icon,
          label: "Status",
          value: statusConfig.label,
          progress: 100,
          description: "Account health",
          iconColor: statusConfig.color,
          borderColor: statusConfig.borderColor,
          gradient: statusConfig.gradient,
        },
      ],
      [totalUsed, planType, averageUsage, activeFeatures, statusConfig]
    );

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
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
    );
  }
);
UsageSummaryStats.displayName = "UsageSummaryStats";

// **MAIN PAGE COMPONENT (UNCHANGED)**
const PlanUsagePage = () => {
  const { user } = useAuth();
  const { usage, isLoading, refreshUsage } = useUsageTracking();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sortedItems, setSortedItems] = useState<UsageItem[]>([]);

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    if (usage) {
      const usageItems = getUsageItems(usage);
      const sorted = [...usageItems].sort((a, b) => b.used - a.used);
      setSortedItems(sorted);
    }
  }, [usage]);

  const handleRefresh = useCallback(async () => {
    const startTime = performance.now();
    try {
      await refreshUsage();
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      toast({
        title: "Usage Data Refreshed",
        description: `Your plan and usage data has been updated in ${duration}ms.`,
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh usage data. Please try again.",
        variant: "destructive",
      });
    }
  }, [refreshUsage, toast]);

  const totalUsed = useMemo(
    () => sortedItems.reduce((sum, item) => sum + item.used, 0),
    [sortedItems]
  );

  const hasLimitReached = useMemo(
    () =>
      sortedItems.some((item) => item.limit !== -1 && item.used >= item.limit),
    [sortedItems]
  );

  const needsUpgrade = usage?.plan_type !== "Pro";

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>My Plan & Usage | ApplyForge</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <DashboardHeader />
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
              <UsageLoadingSkeleton />
            </div>
          </div>
        </TooltipProvider>
      </>
    );
  }

  if (!usage) return null;

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
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex justify-center mb-4">
                  <PlanBadge plan={usage.plan_type} usage={usage} animated />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Plan & Usage
                </h1>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                  Hey{" "}
                  <span className="text-blue-400 font-medium">{userName}</span>!
                  Track your monthly limits and upgrade when you're ready for
                  more.
                </p>
              </motion.div>
            </div>

            <UsageSummaryStats
              usageItems={sortedItems}
              planType={usage.plan_type}
              totalUsed={totalUsed}
            />

            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Feature Usage</h2>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Current billing period</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((item, index) => {
                  const isAtLimit =
                    item.limit !== -1 && item.used >= item.limit;
                  const isOverLimit =
                    item.limit !== -1 && item.used > item.limit;
                  const progressValue =
                    item.limit === -1
                      ? 0
                      : Math.min((item.used / item.limit) * 100, 100);

                  return (
                    <motion.div
                      key={`${item.label}-${index}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <EnhancedProgressBar
                        value={progressValue}
                        used={item.used}
                        limit={item.limit}
                        label={item.label}
                        description={item.description}
                        isAtLimit={isAtLimit}
                        isOverLimit={isOverLimit}
                        isUnused={item.isUnused || false}
                        IconComponent={item.IconComponent}
                        gradient={item.gradient}
                        iconColor={item.iconColor}
                        borderColor={item.borderColor}
                        bgGradient={item.bgGradient}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PlanUsagePage;
