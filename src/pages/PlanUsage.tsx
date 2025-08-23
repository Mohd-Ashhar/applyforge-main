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
  type LucideIcon,
} from "lucide-react";
import { useUsageTracking, type UsageType } from "@/hooks/useUsageTracking";
import PlanBadge from "@/components/header/PlanBadge";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

// **TYPES & INTERFACES**
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
  color: string;
  bgGradient: string;
  borderColor: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
}

// **PLAN CONFIGURATION**
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

// **USAGE ITEMS CONFIGURATION**
const getUsageItems = (usage: any): UsageItem[] => [
  {
    label: "Resume Tailors",
    description: "AI-powered resume optimization",
    used: usage.resume_tailors_used || 0,
    limit: getPlanLimit(usage.plan_type, "resume_tailors_used"),
    IconComponent: Target,
    isUnused: (usage.resume_tailors_used || 0) === 0,
    usageType: "resume_tailors_used",
    gradient: "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgGradient:
      "bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10",
  },
  {
    label: "Cover Letters",
    description: "Personalized cover letter generation",
    used: usage.cover_letters_used || 0,
    limit: getPlanLimit(usage.plan_type, "cover_letters_used"),
    IconComponent: FileText,
    isUnused: (usage.cover_letters_used || 0) === 0,
    usageType: "cover_letters_used",
    gradient: "from-purple-500/20 via-pink-500/15 to-rose-500/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgGradient:
      "bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/10",
  },
  {
    label: "Job Searches",
    description: "Smart job discovery and matching",
    used: usage.job_searches_used || 0,
    limit: getPlanLimit(usage.plan_type, "job_searches_used"),
    IconComponent: Search,
    isUnused: (usage.job_searches_used || 0) === 0,
    usageType: "job_searches_used",
    gradient: "from-cyan-500/20 via-teal-500/15 to-emerald-500/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    bgGradient:
      "bg-gradient-to-br from-cyan-500/5 via-teal-500/5 to-emerald-500/10",
  },
  {
    label: "Instant Generations",
    description: "Instant resumes & cover letters",
    used: usage.one_click_tailors_used || 0,
    limit: getPlanLimit(usage.plan_type, "one_click_tailors_used"),
    IconComponent: Zap,
    isUnused: (usage.one_click_tailors_used || 0) === 0,
    usageType: "one_click_tailors_used",
    gradient: "from-orange-500/20 via-amber-500/15 to-yellow-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgGradient:
      "bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/10",
  },
  {
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

// **ANIMATIONS**
const subtleTransition = (duration: number, delay = 0): Transition => ({
  duration,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeInOut",
  delay,
});

// **MOBILE-ENHANCED LOADING SKELETON**
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

// **MOBILE-ENHANCED PROGRESS BAR COMPONENT**
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
    const [isHovered, setIsHovered] = useState(false);

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

    const getStatusIcon = useCallback((): JSX.Element => {
      if (isOverLimit)
        return (
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
        );
      if (isAtLimit)
        return (
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
        );
      if (isUnused)
        return (
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
        );
      return (
        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
      );
    }, [isOverLimit, isAtLimit, isUnused]);

    const getStatusText = useCallback((): string => {
      if (isOverLimit) return "Over Limit";
      if (isAtLimit) return "At Capacity";
      if (isUnused) return "Try it!";
      return "Active";
    }, [isOverLimit, isAtLimit, isUnused]);

    const bonusUsage = isOverLimit ? used - limit : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.01 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group h-full"
      >
        <Card
          className={`${bgGradient} backdrop-blur-xl border ${borderColor} hover:border-opacity-60 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden relative`}
        >
          {/* Try This Badge */}
          {isUnused && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Badge className="text-[10px] sm:text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 font-medium px-1.5 py-0.5">
                  Try This
                </Badge>
              </motion.div>
            </div>
          )}

          <CardContent className="p-3 sm:p-4 md:p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
              <motion.div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${bgGradient} border ${borderColor} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm flex-shrink-0`}
                whileHover={{
                  rotate: [0, -4, 4, -2, 0],
                  transition: { duration: 0.4 },
                }}
              >
                <IconComponent
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${iconColor}`}
                />

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r ${gradient} rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`}
                />
              </motion.div>

              <div className="flex flex-col items-end ml-2">
                {getStatusIcon()}
                <motion.span
                  key={`${used}-${limit}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xs sm:text-sm font-bold text-white mt-1"
                >
                  {used}
                  {bonusUsage > 0 && (
                    <span className="text-slate-400 text-[10px] sm:text-xs ml-1">
                      (+{bonusUsage})
                    </span>
                  )}
                  <span className="text-slate-400 mx-0.5">/</span>
                  {limit === -1 ? (
                    <InfinityIcon className="w-3 h-3 sm:w-4 sm:h-4 inline text-emerald-400" />
                  ) : (
                    limit
                  )}
                </motion.span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mb-3 sm:mb-4 flex-1">
              <h3 className="font-bold text-white text-sm sm:text-base md:text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight mb-1">
                {label}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                {description}
              </p>
            </div>

            {/* Progress Bar */}
            {limit !== -1 && (
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <div className="h-1.5 sm:h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(animatedValue, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span
                    className={`${
                      isOverLimit || isAtLimit
                        ? "text-orange-400"
                        : isUnused
                        ? "text-slate-400"
                        : "text-emerald-400"
                    } flex items-center gap-1`}
                  >
                    {getStatusText()}
                  </span>
                  <span className="text-slate-400 truncate ml-2">
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

// **MOBILE-ENHANCED USAGE SUMMARY STATS COMPONENT**
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
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/20",
        };
      if (hasAtLimit)
        return {
          icon: AlertCircle,
          color: "text-orange-400",
          label: "At Capacity",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/20",
        };
      return {
        icon: CheckCircle,
        color: "text-emerald-400",
        label: "Healthy",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      };
    }, [hasOverLimit, hasAtLimit]);

    const statusConfig = getStatusConfig();

    const stats = useMemo(
      () => [
        {
          icon: TrendingUp,
          title: "Total Usage",
          value: totalUsed.toString(),
          description: "Actions this month",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
        },
        {
          icon: Target,
          title: "Avg Utilization",
          value: planType === "Pro" ? "∞" : `${averageUsage}%`,
          description: "Of plan limits",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/20",
        },
        {
          icon: Activity,
          title: "Active Features",
          value: `${activeFeatures}/5`,
          description: "Features in use",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10",
          borderColor: "border-cyan-500/20",
        },
        {
          icon: statusConfig.icon,
          title: "Status",
          value: statusConfig.label,
          description: "Account health",
          color: statusConfig.color,
          bgColor: statusConfig.bgColor,
          borderColor: statusConfig.borderColor,
        },
      ],
      [totalUsed, planType, averageUsage, activeFeatures, statusConfig]
    );

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 group`}
            >
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <motion.div
                    className={`p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl ${stat.bgColor} border ${stat.borderColor}`}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <stat.icon
                      className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${stat.color}`}
                    />
                  </motion.div>
                  <span
                    className={`text-sm sm:text-lg md:text-2xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-xs sm:text-sm mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
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

// **MOBILE-ENHANCED PLAN COMPARISON COMPONENT**
const PlanComparison = memo<{ currentPlan: string }>(({ currentPlan }) => {
  const navigate = useNavigate();

  const plans: PlanFeature[] = useMemo(
    () => [
      {
        name: "Free",
        limits: "Limited usage",
        price: "$0",
        color: "text-slate-300",
        bgGradient: "bg-gradient-to-br from-slate-500/5 to-gray-500/10",
        borderColor: "border-slate-500/20",
        features: ["3 uses per feature", "Basic support", "Core functionality"],
        isCurrentPlan: currentPlan === "Free",
      },
      {
        name: "Basic",
        limits: "Extended limits",
        price: "$9.99",
        color: "text-blue-400",
        bgGradient: "bg-gradient-to-br from-blue-500/5 to-indigo-500/10",
        borderColor: "border-blue-500/20",
        features: [
          "25 uses per feature",
          "Email support",
          "Priority processing",
          "Advanced analytics",
        ],
        isCurrentPlan: currentPlan === "Basic",
      },
      {
        name: "Pro",
        limits: "Unlimited",
        price: "$19.99",
        color: "text-emerald-400",
        bgGradient: "bg-gradient-to-br from-emerald-500/5 to-teal-500/10",
        borderColor: "border-emerald-500/20",
        features: [
          "Unlimited usage",
          "Premium support",
          "All features",
          "API access",
          "Custom integrations",
        ],
        isPopular: true,
        isCurrentPlan: currentPlan === "Pro",
      },
    ],
    [currentPlan]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 sm:mb-12 px-2 sm:px-0"
    >
      <div className="text-center mb-6 sm:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4"
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Unlock your career potential with the right plan for your needs
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group h-full"
          >
            <Card
              className={`${plan.bgGradient} backdrop-blur-xl border ${
                plan.borderColor
              } ${
                plan.isCurrentPlan
                  ? "border-emerald-400/60"
                  : "hover:border-opacity-60"
              } transition-all duration-300 h-full group hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden relative`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 font-medium text-[10px] sm:text-xs px-1.5 py-0.5">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.isCurrentPlan && (
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-10">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-medium text-[10px] sm:text-xs px-1.5 py-0.5">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    Current
                  </Badge>
                </div>
              )}

              <CardContent className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl font-bold ${plan.color} mb-1 sm:mb-2`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    {plan.limits}
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {plan.price}
                    {plan.name !== "Free" && (
                      <span className="text-xs sm:text-sm text-slate-400 font-normal">
                        /month
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-4 sm:mb-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * featureIndex }}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.isCurrentPlan ? (
                    <Button
                      variant="outline"
                      className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs sm:text-sm py-2 sm:py-3 h-9 sm:h-10 md:h-11"
                      disabled
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Current Plan</span>
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          : "bg-slate-700 hover:bg-slate-600"
                      } text-white font-semibold text-xs sm:text-sm py-2 sm:py-3 h-9 sm:h-10 md:h-11`}
                      onClick={() => navigate("/pricing")}
                    >
                      <span className="truncate">
                        {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                      </span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 flex-shrink-0" />
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

PlanComparison.displayName = "PlanComparison";

// **MOBILE-ENHANCED MAIN PLAN & USAGE PAGE COMPONENT**
const PlanUsagePage = () => {
  const { user } = useAuth();
  const { usage, isLoading, refreshUsage } = useUsageTracking();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sortedItems, setSortedItems] = useState<UsageItem[]>([]);

  // Calculate user name for greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  // Process usage items
  useEffect(() => {
    if (usage) {
      const usageItems = getUsageItems(usage);
      const sorted = [...usageItems].sort((a, b) => b.used - a.used);
      setSortedItems(sorted);
    }
  }, [usage]);

  // Enhanced refresh handler
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
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
            <UsageLoadingSkeleton />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  if (!usage) return null;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8 lg:space-y-12"
          >
            {/* Back to Dashboard Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 sm:px-0"
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

            {/* MOBILE-ENHANCED Hero Section */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-4 sm:gap-6"
              >
                <div className="space-y-3 sm:space-y-4 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
                      Plan & Usage
                    </h1>

                    {/* Badges and Controls - Mobile Stacked */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                      <PlanBadge
                        plan={usage.plan_type}
                        usage={usage}
                        animated
                        className="text-xs sm:text-sm"
                      />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRefresh}
                              disabled={isLoading}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-9 sm:h-10"
                            >
                              <RefreshCw
                                className={`w-4 h-4 ${
                                  isLoading ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isLoading ? "Refreshing..." : "Refresh usage data"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 px-4 sm:px-0"
                  >
                    <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      Hey{" "}
                      <span className="text-blue-400 font-medium">
                        {userName}
                      </span>
                      ! Monitor your feature usage and manage your subscription
                      plan.
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Track your monthly limits and upgrade when you're ready
                      for more.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Usage Summary Stats */}
            <UsageSummaryStats
              usageItems={sortedItems}
              planType={usage.plan_type}
              totalUsed={totalUsed}
            />

            {/* Usage Details Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 px-2 sm:px-0">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-0"
                >
                  Feature Usage
                </motion.h2>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Current billing period</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
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

            {/* Upgrade CTA */}
            {needsUpgrade && hasLimitReached && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-2 sm:px-0"
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="p-2 sm:p-3 md:p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                      >
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" />
                      </motion.div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                      Ready to Unlock More?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                      You've reached your current plan limits. Upgrade to Pro
                      for unlimited access to all features and accelerate your
                      career journey.
                    </p>

                    <Link to="/pricing">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg h-10 sm:h-11 md:h-12">
                          <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                          <span className="truncate">Upgrade to Pro</span>
                          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Plan Comparison */}
            <PlanComparison currentPlan={usage.plan_type} />
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PlanUsagePage;
