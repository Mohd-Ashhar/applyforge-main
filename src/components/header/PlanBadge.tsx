import React, { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star, Bot, Sparkles, Rocket } from "lucide-react";
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
  agents: number; // **NEW: Added agents limit**
}

interface PlanLimitsConfig {
  Starter: PlanLimits;
  Pro: PlanLimits;
  Advanced: PlanLimits;
}

interface PlanBadgeProps {
  plan: string;
  usage?: Usage;
  planLimitsConfig?: PlanLimitsConfig;
  feature?: keyof PlanLimits;
  showLimit?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  variant?: "default" | "outline" | "subtle";
  className?: string;
}

// **UPDATED: New AI Agent focused plan configurations**
const PLAN_CONFIGS = {
  Advanced: {
    gradient: "from-purple-500 via-pink-500 to-purple-600",
    shadow: "shadow-purple-500/25 hover:shadow-purple-500/40",
    icon: Crown,
    description: "Best AI - Maximum career impact",
    glow: "shadow-purple-400/20",
    badge: "Best AI",
    agentCount: "6+",
  },
  Pro: {
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    shadow: "shadow-blue-500/25 hover:shadow-blue-500/40",
    icon: Bot,
    description: "Most Popular - Professional results",
    glow: "shadow-blue-400/20",
    badge: "Most Popular",
    agentCount: "6",
  },
  Starter: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    shadow: "shadow-slate-500/20 hover:shadow-slate-500/30",
    icon: Zap,
    description: "Basic AI Models - Get started free",
    glow: "shadow-slate-400/20",
    badge: "Free",
    agentCount: "3",
  },
} as const;

// **UPDATED: New plan limits configuration based on AI agent pricing**
const defaultPlanLimitsConfig: PlanLimitsConfig = {
  Starter: {
    resumeChecks: 3,
    coverLetters: 3,
    jobApplications: 3,
    atsScans: 3,
    agents: 3,
  },
  Pro: {
    resumeChecks: 25,
    coverLetters: 25,
    jobApplications: 25,
    atsScans: 25,
    agents: 25,
  },
  Advanced: {
    resumeChecks: 999,
    coverLetters: 999,
    jobApplications: 999,
    atsScans: 999,
    agents: 999,
  },
};

// **NEW: Helper function to map legacy plan names to new names**
const mapLegacyPlanName = (plan: string): string => {
  const planMap: Record<string, string> = {
    Free: "Starter",
    Basic: "Pro",
    Pro: "Advanced",
    // Support both legacy and new names
    Starter: "Starter",
    Advanced: "Advanced",
  };
  return planMap[plan] || plan;
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
    // **UPDATED: Map legacy plan names to new names**
    const normalizedPlan = useMemo(() => mapLegacyPlanName(plan), [plan]);

    // **IMPLEMENTED: Your getLimit logic with new plan names**
    const getLimit = useMemo(() => {
      return (feature: keyof PlanLimits): number => {
        if (!usage) return 0;
        const planType = mapLegacyPlanName(
          usage.plan_type
        ) as keyof PlanLimitsConfig;
        const planLimits = planLimitsConfig[planType] || planLimitsConfig.Pro;
        return planLimits[feature] || 0;
      };
    }, [usage, planLimitsConfig]);

    // **UPDATED: Use normalized plan name**
    const planConfig = useMemo(() => {
      return (
        PLAN_CONFIGS[normalizedPlan as keyof typeof PLAN_CONFIGS] ||
        PLAN_CONFIGS.Starter
      );
    }, [normalizedPlan]);

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

    // **UPDATED: Variant styles with new plan names**
    const variantStyles = useMemo(() => {
      if (variant === "outline") {
        return `bg-transparent border-2 border-current text-${
          normalizedPlan === "Advanced"
            ? "purple"
            : normalizedPlan === "Pro"
            ? "blue"
            : "slate"
        }-400 hover:bg-current/10`;
      }
      if (variant === "subtle") {
        return `bg-${
          normalizedPlan === "Advanced"
            ? "purple"
            : normalizedPlan === "Pro"
            ? "blue"
            : "slate"
        }-500/10 text-${
          normalizedPlan === "Advanced"
            ? "purple"
            : normalizedPlan === "Pro"
            ? "blue"
            : "slate"
        }-400 border border-${
          normalizedPlan === "Advanced"
            ? "purple"
            : normalizedPlan === "Pro"
            ? "blue"
            : "slate"
        }-500/20`;
      }
      return `bg-gradient-to-r ${planConfig.gradient} text-white border-0 shadow-lg ${planConfig.shadow}`;
    }, [variant, normalizedPlan, planConfig]);

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
        title={`${normalizedPlan} Plan - ${planConfig.description}${
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
            {normalizedPlan}
            {size === "md" || size === "lg" ? " Plan" : ""}
          </span>

          {/* **UPDATED: Optional limit display** */}
          {showLimit && currentLimit !== null && (
            <span className="ml-1.5 text-xs opacity-90 font-normal">
              ({currentLimit === 999 ? "∞" : currentLimit})
            </span>
          )}
        </div>

        {/* **NEW: Popular badge for Pro plan** */}
        {normalizedPlan === "Pro" && size !== "xs" && (
          <div className="absolute -top-1 -right-1"></div>
        )}

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
