import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Loader2,
  Bot,
  Cpu,
  Sparkles,
  ArrowLeft,
  Users,
  Crown,
  AlertCircle,
} from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageTracking } from "@/hooks/useUsageTracking"; // **NEW: Import usage tracking**
import { useToast } from "@/hooks/use-toast"; // **NEW: Import toast for messaging**
import { SubscriptionPlan } from "@/services/paymentService";
import { motion, Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface PricingData {
  monthly: number;
  yearly: number;
  yearlyMonthly?: number;
}

interface PlanData {
  name: SubscriptionPlan;
  displayName: string;
  price: number;
  originalPrice: number | null;
  monthlyEquivalent: number | null;
  savings: string | null;
  period: string;
  description: string;
  agentCount: string;
  icon: React.ReactElement;
  features: string[];
  limitations?: string[];
  cta: string;
  highlight: boolean;
  badge?: string;
  isCurrentPlan?: boolean; // **NEW: Track if this is user's current plan**
  canUpgrade?: boolean; // **NEW: Track if user can upgrade to this plan**
}

/* ------------------------------------------------------------------ */
/* Price table                                                         */
/* ------------------------------------------------------------------ */

const PRICING_DATA: Record<"INR" | "USD", Record<string, PricingData>> = {
  INR: {
    Free: { monthly: 0, yearly: 0 },
    Basic: { monthly: 399, yearly: 3591, yearlyMonthly: 299 }, // 25 % off
    Pro: { monthly: 999, yearly: 8991, yearlyMonthly: 749 }, // 25 % off
  },
  USD: {
    Free: { monthly: 0, yearly: 0 },
    Basic: { monthly: 15, yearly: 135, yearlyMonthly: 11 }, // 25 % off
    Pro: { monthly: 35, yearly: 315, yearlyMonthly: 26 }, // 25 % off
  },
};

/* ------------------------------------------------------------------ */
/* Region detection                                                    */
/* ------------------------------------------------------------------ */

interface RegionDetection {
  detectedCurrency: "INR" | "USD";
  isLoading: boolean;
}

const useRegionDetection = (): RegionDetection => {
  const [detectedCurrency, setDetectedCurrency] = useState<"INR" | "USD">(
    "INR"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detect = async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes("Asia/Kolkata") || tz.includes("Asia/Calcutta")) {
          setDetectedCurrency("INR");
          return;
        }
        const locale = navigator.language || "en-US";
        if (locale.includes("hi") || locale === "en-IN") {
          setDetectedCurrency("INR");
          return;
        }
        setDetectedCurrency("USD");
      } finally {
        setIsLoading(false);
      }
    };
    detect();
  }, []);

  return { detectedCurrency, isLoading };
};

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const fadeStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 1 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut", opacity: { duration: 0.25 } },
  },
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const Pricing: React.FC = () => {
  /* currency / auth / payment ---------------------------------------------- */
  const { detectedCurrency, isLoading } = useRegionDetection();
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly"
  );

  const { processPayment, isProcessing } = usePayment();
  const { user } = useAuth();

  // **NEW: Get user's current plan**
  const { usage, isLoading: isUsageLoading } = useUsageTracking();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) setCurrency(detectedCurrency);
  }, [detectedCurrency, isLoading]);

  // **NEW: Enhanced subscribe handler with plan validation**
  const handleSubscribe = useCallback(
    async (
      plan: SubscriptionPlan,
      isCurrentPlan: boolean,
      canUpgrade: boolean
    ) => {
      if (!user) {
        window.location.href = "/auth";
        return;
      }

      // **NEW: Prevent buying same plan**
      if (isCurrentPlan) {
        toast({
          title: "This is your current plan! 📋",
          description:
            "You're already on this plan. Consider upgrading to a higher tier for more features.",
          duration: 4000,
        });
        return;
      }

      // **NEW: Prevent downgrading**
      if (!canUpgrade) {
        toast({
          title: "Cannot downgrade plan ⬇️",
          description:
            "You can only upgrade to higher plans. Contact support if you need to change your current plan.",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      await processPayment(plan);
    },
    [user, processPayment, toast]
  );

  // **NEW: Get plan hierarchy for upgrade logic**
  const getPlanHierarchy = useCallback((planName: string): number => {
    const hierarchy = { Free: 0, Basic: 1, Pro: 2 };
    return hierarchy[planName as keyof typeof hierarchy] || 0;
  }, []);

  /* Plans ------------------------------------------------------------------- */
  const plans = useMemo<PlanData[]>(() => {
    const cs = currency === "INR" ? "₹" : "$";
    const currentPlan = usage?.plan_type || "Free";
    const currentPlanHierarchy = getPlanHierarchy(currentPlan);

    return [
      {
        name: "Free",
        displayName: "AI Agent Starter",
        price: PRICING_DATA[currency].Free[billingPeriod],
        originalPrice: null,
        monthlyEquivalent: null,
        savings: null,
        period: billingPeriod === "yearly" ? "per year" : "per month",
        description: "Powered by foundational AI models",
        agentCount: "Basic AI Models",
        icon: <Bot className="w-6 h-6 sm:w-7 sm:h-7" />,
        features: [
          "AI ATS Resume Scanner (5/month)",
          "AI Resume Optimizer (5/month)",
          "AI Cover Letter Assistant (5/month)",
          "Smart Job Discovery (5/month)",
          "AI Writing Quality Score",
          "Community AI Templates (10+)",
          "Basic grammar & formatting checks",
        ],
        limitations: [
          "Limited processing speed",
          "Standard templates only",
          "Basic AI accuracy",
        ],
        cta: "Start with AI Free",
        highlight: false,
        isCurrentPlan: currentPlan === "Free",
        canUpgrade: getPlanHierarchy("Free") > currentPlanHierarchy,
      },
      {
        name: "Basic",
        displayName: "AI Professional",
        price: PRICING_DATA[currency].Basic[billingPeriod],
        originalPrice:
          billingPeriod === "yearly"
            ? PRICING_DATA[currency].Basic.monthly * 12
            : null,
        monthlyEquivalent:
          billingPeriod === "yearly"
            ? PRICING_DATA[currency].Basic.yearlyMonthly || 0
            : null,
        savings:
          billingPeriod === "yearly"
            ? `${cs}${
                PRICING_DATA[currency].Basic.monthly * 12 -
                PRICING_DATA[currency].Basic.yearly
              }`
            : null,
        period: billingPeriod === "yearly" ? "per year" : "per month",
        description: "Enhanced with mid-tier AI for professional results",
        agentCount: "GPT-4 Class AI",
        icon: <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />,
        features: [
          "Advanced ATS Analyzer (25/month)",
          "Smart Resume Tailor (25/month)",
          "Intelligent Cover Letter Generator (25/month)",
          "AI Job Matching Engine (25/month)",
          "One-Click AI Application (15/month)",
          "AI Interview Prep (10 questions/month)",
          "Skills Gap AI Analysis",
          "Premium AI Templates (50+)",
          "Advanced LLM processing",
        ],
        cta: "Upgrade to AI Pro",
        highlight: true,
        badge: "Most Popular",
        isCurrentPlan: currentPlan === "Basic",
        canUpgrade: getPlanHierarchy("Basic") > currentPlanHierarchy,
      },
      {
        name: "Pro",
        displayName: "AI Career Accelerator",
        price: PRICING_DATA[currency].Pro[billingPeriod],
        originalPrice:
          billingPeriod === "yearly"
            ? PRICING_DATA[currency].Pro.monthly * 12
            : null,
        monthlyEquivalent:
          billingPeriod === "yearly"
            ? PRICING_DATA[currency].Pro.yearlyMonthly || 0
            : null,
        savings:
          billingPeriod === "yearly"
            ? `${cs}${
                PRICING_DATA[currency].Pro.monthly * 12 -
                PRICING_DATA[currency].Pro.yearly
              }`
            : null,
        period: billingPeriod === "yearly" ? "per year" : "per month",
        description: "Fueled by cutting-edge AI for maximum career impact",
        agentCount: "GPT-5 Class AI",
        icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />,
        features: [
          "Unlimited AI Tools (state-of-the-art models)",
          "Hyper-Personalized Resume AI",
          "Advanced Cover Letter AI",
          "Predictive Job Matching",
          "One-Click AI Mastery (unlimited)",
          "Auto Apply AI Agent (75/month)",
          "AI Career Coach (weekly insights)",
          "Advanced AI Analytics",
          "Custom AI Training",
          "Priority AI Processing",
        ],
        cta: "Go AI Advanced",
        highlight: false,
        badge: "Best AI",
        isCurrentPlan: currentPlan === "Pro",
        canUpgrade: getPlanHierarchy("Pro") > currentPlanHierarchy,
      },
    ];
  }, [currency, billingPeriod, usage, getPlanHierarchy]);

  /* Helpers ----------------------------------------------------------------- */
  const formatPrice = useCallback(
    (price: number) =>
      price === 0
        ? currency === "INR"
          ? "₹0"
          : "$0"
        : currency === "INR"
        ? `₹${price.toLocaleString()}`
        : `$${price}`,
    [currency]
  );

  /* ------------------------------------------------------------------ */
  /* PricingCard                                                         */
  /* ------------------------------------------------------------------ */

  interface PricingCardProps {
    plan: PlanData;
    index: number;
  }

  const PricingCard: React.FC<PricingCardProps> = React.memo(({ plan }) => {
    // **ENHANCED: Dynamic ring based on current plan status**
    const baseRing = plan.isCurrentPlan
      ? "ring-2 ring-green-500/60 border-green-500/50" // Current plan gets green ring
      : plan.highlight
      ? "ring-2 ring-appforge-blue/50 border-appforge-blue/50"
      : plan.badge === "Best AI"
      ? "ring-2 ring-purple-500/80 border-purple-500/60"
      : "border-white/10";

    /* Only the target values go in whileHover ------------------------ */
    const hoverTarget = { y: -6, scale: 1.02 } as const;

    // **ENHANCED: Dynamic badge styling**
    const badgeClass = plan.isCurrentPlan
      ? "bg-green-500 text-white border border-green-500/30"
      : plan.highlight
      ? "bg-appforge-blue text-black border border-appforge-blue/20"
      : plan.badge === "Best AI"
      ? "bg-purple-500 text-white border border-purple-500/30"
      : "";

    const iconBg = {
      Free: "bg-gradient-to-br from-gray-400 to-gray-600",
      Basic: "bg-gradient-to-br from-blue-500 to-blue-800",
      Pro: "bg-gradient-to-br from-purple-500 to-pink-600",
    }[plan.name] as string;

    // **ENHANCED: Handle click with validation**
    const handleClick = () =>
      handleSubscribe(
        plan.name,
        plan.isCurrentPlan || false,
        plan.canUpgrade || false
      );

    // **NEW: Get button styling and text based on plan status**
    const getButtonConfig = () => {
      if (plan.isCurrentPlan) {
        return {
          className:
            "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30",
          text: "✓ Current Plan",
          disabled: false,
        };
      }

      if (!plan.canUpgrade) {
        return {
          className:
            "bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed",
          text: "Cannot Downgrade",
          disabled: true,
        };
      }

      // Default upgrade styling
      if (plan.name === "Pro") {
        return {
          className:
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
          text: plan.cta,
          disabled: false,
        };
      } else if (plan.highlight) {
        return {
          className: "bg-appforge-blue hover:bg-appforge-blue/90 text-black",
          text: plan.cta,
          disabled: false,
        };
      } else {
        return {
          className:
            "bg-white/5 hover:bg-white/10 text-white border border-white/20",
          text: plan.cta,
          disabled: false,
        };
      }
    };

    const buttonConfig = getButtonConfig();

    return (
      <motion.div
        variants={cardVariants}
        whileHover={hoverTarget}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="transition-transform will-change-transform"
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          isolation: "isolate",
        }}
      >
        <Card
          className={`relative glass bg-background/75 backdrop-blur-sm shadow-xl overflow-hidden ${baseRing} rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col h-full`}
        >
          {/* **ENHANCED: Multiple badges support** */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 z-10">
            {plan.isCurrentPlan && (
              <Badge className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Current Plan
              </Badge>
            )}
            {plan.badge && !plan.isCurrentPlan && (
              <Badge
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-md ${badgeClass}`}
              >
                {plan.badge}
              </Badge>
            )}
          </div>

          {/* Icon */}
          <div
            className={`${iconBg} text-white mb-4 sm:mb-6 mx-auto p-3 sm:p-4 rounded-xl shadow-md flex justify-center items-center`}
          >
            {plan.icon}
          </div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
              {plan.displayName}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  plan.isCurrentPlan ? "bg-green-400" : "bg-green-400"
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  plan.isCurrentPlan ? "text-green-400" : "text-green-400"
                }`}
              >
                {plan.agentCount}
              </span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-3">
              {plan.description}
            </p>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {formatPrice(plan.price)}
                </span>
                {plan.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(plan.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium">
                / {plan.period}
              </span>

              {plan.monthlyEquivalent && (
                <div className="mt-2">
                  <div className="text-green-400 text-xs font-medium">
                    {formatPrice(plan.monthlyEquivalent)} / month when billed
                    annually
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-xs font-medium">
                      Save {plan.savings} per year! 🎉
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feature list */}
          <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8 flex-1">
            {plan.features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base"
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mt-0.5" />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
            {plan.limitations?.map((l, i) => (
              <li
                key={`lim-${i}`}
                className="flex items-start gap-2 sm:gap-3 opacity-50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500/30 mt-1.5" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  {l}
                </span>
              </li>
            ))}
          </ul>

          {/* **ENHANCED: Dynamic CTA button** */}
          <Button
            size="lg"
            disabled={isProcessing || buttonConfig.disabled}
            onClick={handleClick}
            className={`w-full font-bold tracking-wide rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm md:text-base ${buttonConfig.className}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                Activating Agents…
              </>
            ) : (
              buttonConfig.text
            )}
          </Button>
        </Card>
      </motion.div>
    );
  });
  PricingCard.displayName = "PricingCard";

  /* ------------------------------------------------------------------ */
  /* Loading state                                                       */
  /* ------------------------------------------------------------------ */

  if (isLoading || isUsageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading agent plans…</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div
      className="min-h-screen bg-background overflow-hidden"
      style={{ contain: "layout style paint", willChange: "auto" }}
    >
      {/* background blobs */}
      <span className="pointer-events-none absolute -left-40 top-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute right-0 top-0 w-80 h-56 bg-purple-500/10 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 relative z-10">
        {/* nav */}
        <div className="mb-8">
          <Link to="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm sm:text-base">
              Deploy Your AI Agent Workforce
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Agent Plan
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Deploy intelligent agents to accelerate your career while you focus
            on interviews.
          </p>

          {/* **NEW: Current plan indicator** */}
          {usage?.plan_type && usage.plan_type !== "Free" && (
            <div className="mb-6">
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Currently on {usage.plan_type} Plan
              </Badge>
            </div>
          )}

          {/* toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={currency === "INR" ? "default" : "outline"}
                onClick={() => setCurrency("INR")}
                size="sm"
              >
                India (₹)
              </Button>
              <Button
                variant={currency === "USD" ? "default" : "outline"}
                onClick={() => setCurrency("USD")}
                size="sm"
              >
                International ($)
              </Button>
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === "yearly"
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                Yearly
                <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                  -25%
                </Badge>
              </button>
            </div>
          </div>
        </motion.header>

        {/* pricing grids ---------------------------------------------------- */}
        <div className="max-w-7xl mx-auto">
          {/* desktop */}
          <motion.div
            className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-10"
            variants={fadeStagger}
            initial="hidden"
            animate="show"
            key={`desktop-${currency}-${billingPeriod}`}
          >
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} index={i} />
            ))}
          </motion.div>

          {/* tablet */}
          <motion.div
            className="hidden md:grid lg:hidden md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            variants={fadeStagger}
            initial="hidden"
            animate="show"
            key={`tablet-${currency}-${billingPeriod}`}
          >
            {plans.slice(0, 2).map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} index={i} />
            ))}
            <div className="md:col-span-2 max-w-sm mx-auto">
              <PricingCard plan={plans[2]} index={2} />
            </div>
          </motion.div>

          {/* mobile carousel */}
          {/* mobile carousel */}
          <div className="md:hidden mt-8 sm:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-center text-muted-foreground text-sm mb-6 px-4">
                ← Swipe to see all agent plans →
              </p>
              <div className="overflow-x-auto pb-8 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div
                  className="flex gap-4 w-max"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {plans.map((plan, i) => (
                    <div
                      key={plan.name}
                      className="w-[85vw] max-w-sm flex-shrink-0"
                      style={{ scrollSnapAlign: "center" }}
                    >
                      <PricingCard plan={plan} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>{" "}
            {/* ✅ Corrected Closing Tag */}
          </div>

          {/* feature highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-16 sm:mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                🚀 Deploy Your AI Agent Workforce Today
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Every plan deploys intelligent agents that work 24/7. Higher
                tiers unlock more advanced agents with better autonomous
                decision-making, faster processing and deeper personalization
                for maximum career acceleration.
              </p>
              {billingPeriod === "yearly" && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                  🎉 Save 25% with annual agent deployment!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
