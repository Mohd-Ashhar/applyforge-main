import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Infinity,
  Eye,
  AlertCircle,
  FileText,
  Search,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";
import { useUsageTracking, type UsageType } from "@/hooks/useUsageTracking"; // **IMPORTED CENTRALIZED HOOK**
import PlanBadge from "./header/PlanBadge"; // **IMPORTED CENTRALIZED COMPONENT**
import { Link } from "react-router-dom";

// **SIMPLIFIED: Removed duplicate types - using hook's types**
interface UsageItem {
  label: string;
  used: number;
  limit: number;
  IconComponent: LucideIcon;
  isUnused?: boolean;
  usageType: UsageType; // **ADDED: Reference to hook's usage type**
}

interface EnhancedProgressBarProps {
  value: number;
  used: number;
  limit: number;
  label: string;
  isAtLimit: boolean;
  isOverLimit: boolean;
  isUnused: boolean;
  IconComponent: LucideIcon;
}

interface UsageSummaryStatsProps {
  usageItems: UsageItem[];
  planType: string;
}

// **SIMPLIFIED: Using centralized plan limits from hook**
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

// Subtle animations
const subtleTransition = (duration: number, delay = 0): Transition => ({
  duration,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeInOut",
  delay,
});

// Loading Skeleton using your existing styles
const UsageLoadingSkeleton: React.FC = () => (
  <Card className="glass animate-fade-in">
    <CardHeader className="pb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <motion.div
            className="h-5 w-40 bg-white/10 rounded-md"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={subtleTransition(2)}
          />
          <motion.div
            className="h-4 w-60 bg-white/5 rounded-md"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={subtleTransition(2, 0.3)}
          />
        </div>
        <motion.div
          className="h-7 w-20 bg-white/10 rounded-full"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={subtleTransition(2, 0.5)}
        />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {/* Summary Stats Skeleton */}
        <div className="grid grid-cols-3 gap-4 p-4 glass rounded-lg">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="text-center">
              <motion.div
                className="h-4 w-16 bg-white/10 rounded mx-auto mb-2"
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={subtleTransition(2, index * 0.2)}
              />
              <motion.div
                className="h-6 w-12 bg-white/15 rounded mx-auto"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={subtleTransition(2, index * 0.2 + 0.1)}
              />
            </div>
          ))}
        </div>

        {/* Progress Bars Skeleton */}
        {Array.from({ length: 5 }, (_, index) => (
          <motion.div
            key={index}
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg" />
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
              <div className="h-4 w-16 bg-white/5 rounded" />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full" />
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Enhanced Progress Bar Component
const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
  value,
  used,
  limit,
  label,
  isAtLimit,
  isOverLimit,
  isUnused,
  IconComponent,
}) => {
  const [animatedValue, setAnimatedValue] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getProgressColor = (): string => {
    if (isOverLimit) return "from-orange-400 to-red-400";
    if (isAtLimit) return "from-orange-400 to-orange-500";
    if (value > 80) return "from-yellow-400 to-orange-400";
    return "from-appforge-blue to-purple-500";
  };

  const getStatusIcon = (): JSX.Element => {
    if (isOverLimit)
      return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    if (isAtLimit) return <AlertCircle className="w-4 h-4 text-orange-400" />;
    if (isUnused) return <Clock className="w-4 h-4 text-muted-foreground" />;
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  };

  const getStatusText = (): string => {
    if (isOverLimit) return "Usage Exceeded";
    if (isAtLimit) return "At Capacity";
    if (isUnused) return "Unused";
    return "Active";
  };

  const getStatusColor = (): string => {
    if (isOverLimit) return "text-orange-400";
    if (isAtLimit) return "text-orange-400";
    if (isUnused) return "text-muted-foreground";
    return "text-green-400";
  };

  // Calculate bonus usage for exceeded limits
  const bonusUsage = isOverLimit ? used - limit : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-appforge-blue/20">
            <IconComponent className="w-4 h-4 text-appforge-blue" />
          </div>
          <span className="text-sm font-medium">{label}</span>

          {/* "Try This" badge for unused features */}
          {isUnused && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="bg-appforge-blue/20 text-appforge-blue text-xs px-2 py-0.5 ml-2 rounded-full">
                Try this
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <motion.span
            key={`${used}-${limit}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-medium"
          >
            {used}
            {bonusUsage > 0 && (
              <span className="text-muted-foreground text-xs ml-1">
                (+{bonusUsage} bonus)
              </span>
            )}
            <span className="text-muted-foreground mx-1">/</span>
            {limit === -1 ? (
              <Infinity className="w-4 h-4 inline text-green-400" />
            ) : (
              limit
            )}
          </motion.span>
        </div>
      </div>

      {/* Progress Bar */}
      {limit !== -1 && (
        <>
          <div className="relative">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getProgressColor()}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(animatedValue, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Status Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className={getStatusColor()}>{getStatusText()}</span>
            <span className="text-muted-foreground">
              {limit - used > 0 ? `${limit - used} remaining` : "No remaining"}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Usage Summary Stats using your design system
const UsageSummaryStats: React.FC<UsageSummaryStatsProps> = ({
  usageItems,
  planType,
}) => {
  const totalUsed = usageItems.reduce((sum, item) => sum + item.used, 0);
  const validItems = usageItems.filter(
    (item) => item.limit !== -1 && item.used > 0
  );
  const averageUsage =
    validItems.length > 0
      ? Math.round(
          validItems.reduce(
            (sum, item) => sum + Math.min((item.used / item.limit) * 100, 100),
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

  const getStatusConfig = () => {
    if (hasOverLimit)
      return {
        icon: AlertTriangle,
        color: "text-orange-400",
        label: "Usage Exceeded",
      };
    if (hasAtLimit)
      return {
        icon: AlertCircle,
        color: "text-orange-400",
        label: "At Capacity",
      };
    return {
      icon: CheckCircle,
      color: "text-green-400",
      label: "Good Standing",
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-3 gap-6 p-4 glass rounded-lg"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-appforge-blue" />
          <span className="text-xs text-muted-foreground">Total Uses</span>
        </div>
        <div className="text-xl font-bold gradient-text">{totalUsed}</div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Target className="w-3.5 h-3.5 text-appforge-blue" />
          <span className="text-xs text-muted-foreground">Avg Usage</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Average percentage of your limits used across all features
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-xl font-bold gradient-text">
          {planType === "Pro" ? "∞" : `${averageUsage}%`}
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <statusConfig.icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Status</span>
        </div>
        <div className={`text-xl font-bold ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
      </div>
    </motion.div>
  );
};

const UsageStatsCard: React.FC = () => {
  // **USING CENTRALIZED HOOK**
  const { usage, isLoading, checkUsageLimit } = useUsageTracking();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [sortedItems, setSortedItems] = useState<UsageItem[]>([]);

  const getProgressValue = (used: number, limit: number): number => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  useEffect(() => {
    if (usage) {
      const usageItems: UsageItem[] = [
        {
          label: "Resume Tailors Used",
          used: usage.resume_tailors_used || 0,
          limit: getPlanLimit(usage.plan_type, "resume_tailors_used"),
          IconComponent: Target,
          isUnused: (usage.resume_tailors_used || 0) === 0,
          usageType: "resume_tailors_used",
        },
        {
          label: "Cover Letters Used",
          used: usage.cover_letters_used || 0,
          limit: getPlanLimit(usage.plan_type, "cover_letters_used"),
          IconComponent: FileText,
          isUnused: (usage.cover_letters_used || 0) === 0,
          usageType: "cover_letters_used",
        },
        {
          label: "Job Searches Used",
          used: usage.job_searches_used || 0,
          limit: getPlanLimit(usage.plan_type, "job_searches_used"),
          IconComponent: Search,
          isUnused: (usage.job_searches_used || 0) === 0,
          usageType: "job_searches_used",
        },
        {
          label: "Instant Generation Used",
          used: usage.one_click_tailors_used || 0,
          limit: getPlanLimit(usage.plan_type, "one_click_tailors_used"),
          IconComponent: Zap,
          isUnused: (usage.one_click_tailors_used || 0) === 0,
          usageType: "one_click_tailors_used",
        },
        {
          label: "ATS Checks Used",
          used: usage.ats_checks_used || 0,
          limit: getPlanLimit(usage.plan_type, "ats_checks_used"),
          IconComponent: Shield,
          isUnused: (usage.ats_checks_used || 0) === 0,
          usageType: "ats_checks_used",
        },
      ];

      // Sort by usage (most used first)
      const sorted = [...usageItems].sort((a, b) => b.used - a.used);
      setSortedItems(sorted);
    }
  }, [usage]);

  if (isLoading) {
    return <UsageLoadingSkeleton />;
  }

  if (!usage) return null;

  const hasLimitReached = sortedItems.some(
    (item) => item.limit !== -1 && item.used >= item.limit
  );

  const needsUpgrade = usage.plan_type !== "Pro";

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl mx-auto animate-fade-in"
      >
        <Card className="glass overflow-hidden">
          {/* Header */}
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-4 h-4 text-appforge-blue" />
                  Your Monthly Usage
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Track your feature usage for the current billing period
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Track your feature usage for the current billing period
                </CardDescription>
              </div>
              {/* **USING CENTRALIZED PLANBADGE** */}
              <PlanBadge plan={usage.plan_type} usage={usage} animated />
            </div>

            <UsageSummaryStats
              usageItems={sortedItems}
              planType={usage.plan_type}
            />
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Usage Items */}
            <div className="space-y-4">
              {sortedItems.map((item, index) => {
                const isAtLimit = item.limit !== -1 && item.used >= item.limit;
                const isOverLimit = item.limit !== -1 && item.used > item.limit;
                const progressValue = getProgressValue(item.used, item.limit);

                return (
                  <motion.div
                    key={`${item.label}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <EnhancedProgressBar
                      value={progressValue}
                      used={item.used}
                      limit={item.limit}
                      label={item.label}
                      isAtLimit={isAtLimit}
                      isOverLimit={isOverLimit}
                      isUnused={item.isUnused || false}
                      IconComponent={item.IconComponent}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Upgrade CTA - Only for non-Pro users with limits reached */}
            {needsUpgrade && hasLimitReached && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="glass rounded-xl p-6 border border-appforge-blue/20">
                  <div className="mb-4">
                    <div className="flex justify-center mb-3">
                      <div className="p-2 rounded-full bg-appforge-blue/20">
                        <ArrowUp className="w-6 h-6 text-appforge-blue" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold gradient-text mb-2">
                      Ready for more?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock unlimited access to continue creating without
                      limits
                    </p>
                  </div>

                  <Link to="/pricing">
                    <Button className="bg-appforge-blue hover:bg-appforge-blue/80 text-black font-semibold group">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Plan Comparison Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <Button
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
                className="border-2 border-white/20 hover:border-appforge-blue/50 group text-sm"
                size="sm"
              >
                <Eye className="w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform" />
                Show Plan Comparison
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Plan Comparison */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-xl p-4"
                >
                  <h4 className="font-medium mb-4 flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-appforge-blue" />
                    Plan Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        name: "Free",
                        limits: "Limited usage",
                        color: "text-muted-foreground",
                        features: ["Basic features", "Community support"],
                      },
                      {
                        name: "Basic",
                        limits: "Extended limits",
                        color: "gradient-text",
                        features: [
                          "More usage",
                          "Email support",
                          "Priority processing",
                        ],
                      },
                      {
                        name: "Pro",
                        limits: "Unlimited",
                        color: "text-appforge-blue",
                        features: [
                          "Unlimited usage",
                          "Premium support",
                          "All features",
                          "API access",
                        ],
                      },
                    ].map((plan, index) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg glass ${
                          usage.plan_type === plan.name
                            ? "border border-appforge-blue/50"
                            : "border border-white/10"
                        }`}
                      >
                        <div
                          className={`font-medium ${plan.color} mb-1 text-sm`}
                        >
                          {plan.name}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {plan.limits}
                        </div>
                        <ul className="text-xs space-y-1">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-2.5 h-2.5 text-green-400 flex-shrink-0" />
                              <span className="text-foreground/70">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default UsageStatsCard;
