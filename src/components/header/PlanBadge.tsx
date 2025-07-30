import React, { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

// **ADDED: Types for plan limits functionality**
interface Usage {
  plan_type: string;
  [key: string]: any;
}

interface PlanLimits {
  resumeChecks: number;
  coverLetters: number;
  jobApplications: number;
  atsScans: number;
}

interface PlanLimitsConfig {
  Free: PlanLimits;
  Basic: PlanLimits;
  Pro: PlanLimits;
}

interface PlanBadgeProps {
  plan: string;
  usage?: Usage; // **ADDED: Usage prop to get current plan data**
  planLimitsConfig?: PlanLimitsConfig; // **ADDED: Plan limits config**
  feature?: keyof PlanLimits; // **ADDED: Optional feature to show limit for**
  showLimit?: boolean; // **ADDED: Option to show/hide limit display**
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  variant?: "default" | "outline" | "subtle";
  className?: string;
}

// **UPDATED: Fixed CONFIGS reference**
const PLAN_CONFIGS = {
  Pro: {
    gradient: "from-green-500 via-emerald-500 to-green-600",
    shadow: "shadow-green-500/25 hover:shadow-green-500/40",
    icon: Crown,
    description: "Premium features",
    glow: "shadow-green-400/20",
  },
  Basic: {
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    shadow: "shadow-blue-500/25 hover:shadow-blue-500/40",
    icon: Star,
    description: "Essential features",
    glow: "shadow-blue-400/20",
  },
  Free: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    shadow: "shadow-slate-500/20 hover:shadow-slate-500/30",
    icon: Zap,
    description: "Basic features",
    glow: "shadow-slate-400/20",
  },
} as const;

// **ADDED: Default plan limits configuration**
const defaultPlanLimitsConfig: PlanLimitsConfig = {
  Free: {
    resumeChecks: 2,
    coverLetters: 1,
    jobApplications: 5,
    atsScans: 3,
  },
  Basic: {
    resumeChecks: 10,
    coverLetters: 5,
    jobApplications: 20,
    atsScans: 15,
  },
  Pro: {
    resumeChecks: 50,
    coverLetters: 25,
    jobApplications: 100,
    atsScans: 75,
  },
};

const PlanBadge = memo<PlanBadgeProps>(
  ({
    plan,
    usage,
    planLimitsConfig = defaultPlanLimitsConfig,
    feature,
    showLimit = false,
    size = "md",
    showIcon = true,
    animated = true,
    variant = "default",
    className = "",
  }) => {
    // **IMPLEMENTED: Your getLimit logic exactly as provided**
    const getLimit = useMemo(() => {
      return (feature: keyof PlanLimits): number => {
        if (!usage) return 0;
        const planType = usage.plan_type as keyof PlanLimitsConfig;
        const planLimits = planLimitsConfig[planType] || planLimitsConfig.Basic;
        return planLimits[feature] || 0;
      };
    }, [usage, planLimitsConfig]);

    // Memoized plan configuration
    const planConfig = useMemo(() => {
      return (
        PLAN_CONFIGS[plan as keyof typeof PLAN_CONFIGS] || PLAN_CONFIGS.Free
      );
    }, [plan]);

    // **ADDED: Get current feature limit if feature is specified**
    const currentLimit = useMemo(() => {
      if (!feature || !showLimit) return null;
      return getLimit(feature);
    }, [feature, showLimit, getLimit]);

    // Memoized size classes
    const sizeClasses = useMemo(
      () => ({
        xs: "text-xs px-2 py-0.5 h-5 gap-1",
        sm: "text-xs px-2.5 py-1 h-6 gap-1",
        md: "text-sm px-3 py-1.5 h-7 gap-1.5",
        lg: "text-sm px-4 py-2 h-8 gap-2",
      }),
      []
    );

    // Memoized icon size
    const iconSize = useMemo(
      () =>
        ({
          xs: "w-2.5 h-2.5",
          sm: "w-3 h-3",
          md: "w-3.5 h-3.5",
          lg: "w-4 h-4",
        }[size]),
      [size]
    );

    // Memoized variant styles
    const variantStyles = useMemo(() => {
      if (variant === "outline") {
        return `bg-transparent border-2 border-current text-${
          plan === "Pro" ? "green" : plan === "Basic" ? "blue" : "slate"
        }-400 hover:bg-current/10`;
      }
      if (variant === "subtle") {
        return `bg-${
          plan === "Pro" ? "green" : plan === "Basic" ? "blue" : "slate"
        }-500/10 text-${
          plan === "Pro" ? "green" : plan === "Basic" ? "blue" : "slate"
        }-400 border border-${
          plan === "Pro" ? "green" : plan === "Basic" ? "blue" : "slate"
        }-500/20`;
      }
      return `bg-gradient-to-r ${planConfig.gradient} text-white border-0 shadow-lg ${planConfig.shadow}`;
    }, [variant, plan, planConfig]);

    const Icon = planConfig.icon;

    const badgeContent = (
      <Badge
        className={`
        relative overflow-hidden transition-all duration-300 rounded-xl font-medium
        ${variantStyles}
        ${sizeClasses[size]}
        ${animated ? "hover:scale-105 active:scale-95" : ""}
        ${className}
      `}
        title={`${plan} Plan - ${planConfig.description}${
          currentLimit !== null
            ? ` | ${feature}: ${currentLimit} remaining`
            : ""
        }`}
      >
        {/* Background shine effect */}
        {variant === "default" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}

        {/* Content */}
        <div className="relative flex items-center z-10">
          {showIcon && (
            <Icon
              className={`${iconSize} shrink-0 ${
                animated
                  ? "group-hover:rotate-12 transition-transform duration-300"
                  : ""
              }`}
            />
          )}
          <span className="font-semibold">
            {plan}
            {size === "md" || size === "lg" ? " Plan" : ""}
          </span>

          {/* **ADDED: Optional limit display** */}
          {showLimit && currentLimit !== null && (
            <span className="ml-1.5 text-xs opacity-90 font-normal">
              ({currentLimit})
            </span>
          )}
        </div>

        {/* Glow effect */}
        {variant === "default" && (
          <div
            className={`absolute inset-0 rounded-xl blur-sm ${planConfig.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
          />
        )}
      </Badge>
    );

    return animated ? (
      <motion.div
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block group"
      >
        {badgeContent}
      </motion.div>
    ) : (
      <div className="inline-block group">{badgeContent}</div>
    );
  }
);

PlanBadge.displayName = "PlanBadge";

export default PlanBadge;
