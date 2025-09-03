import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Check,
  Loader2,
  ChevronDown,
  Brain,
  Cpu,
  Sparkles,
  Bot,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionPlan } from "@/services/paymentService";
import { motion, AnimatePresence, Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface FAQItem {
  question: string;
  answer: string;
}

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
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const faqData: FAQItem[] = [
  {
    question: "How many AI agents do I get with each plan?",
    answer:
      "Starter gives you 3 basic agents, Professional unlocks 6 advanced agents, and Career Accelerator provides access to all 6 agents plus premium autonomous features with state-of-the-art intelligence.",
  },
  {
    question: "Can I cancel my agent subscription anytime?",
    answer:
      "Yes, you can cancel anytime. Your AI agents will continue working until the end of your billing period, ensuring you get maximum value from your agent workforce.",
  },
  {
    question: "Do you offer yearly discounts on agent subscriptions?",
    answer:
      "Yes! Save 25% when you choose annual agent deployment. All AI agents remain fully active with the same autonomous capabilities – you just pay less per month with yearly commitment.",
  },
  {
    question: "Do you offer refunds if my agents don't perform well?",
    answer:
      "We offer a 7-day money-back guarantee for all paid agent plans if you're not satisfied with your AI workforce performance.",
  },
  {
    question: "How do AI agents improve with each tier?",
    answer:
      "Higher tiers deploy more intelligent agents with better autonomous decision-making, faster processing, and advanced learning capabilities. Career Accelerator agents include custom training based on your specific career goals.",
  },
  {
    question: "What makes your AI agents different from regular AI tools?",
    answer:
      "Our agents work autonomously 24/7, learn from your preferences, collaborate with each other, and make intelligent decisions without constant input. They're like having a personal career team that never sleeps.",
  },
];

const PRICING_DATA: Record<"INR" | "USD", Record<string, PricingData>> = {
  INR: {
    Free: { monthly: 0, yearly: 0 },
    Basic: { monthly: 399, yearly: 3591, yearlyMonthly: 299 },
    Pro: { monthly: 999, yearly: 8991, yearlyMonthly: 749 },
  },
  USD: {
    Free: { monthly: 0, yearly: 0 },
    Basic: { monthly: 15, yearly: 135, yearlyMonthly: 11 },
    Pro: { monthly: 35, yearly: 315, yearlyMonthly: 26 },
  },
};

/* ------------------------------------------------------------------ */
/* Region detection hook                                               */
/* ------------------------------------------------------------------ */

const useRegionDetection = () => {
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
/* Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/* FAQ Accordion                                                       */
/* ------------------------------------------------------------------ */

interface FAQItemProps {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent = memo<FAQItemProps>(
  ({ faq, index, isOpen, onToggle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      viewport={{ once: true }}
      className="glass rounded-xl border border-white/10 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h4 className="font-semibold text-base sm:text-lg text-slate-100 pr-4">
          {faq.question}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="border-t border-white/10 pt-4">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
);

FAQItemComponent.displayName = "FAQItemComponent";

/* ------------------------------------------------------------------ */
/* Pricing card                                                        */
/* ------------------------------------------------------------------ */

interface PricingCardProps {
  plan: PlanData;
  index: number;
  onClick: () => void;
  isProcessing: boolean;
  formatPrice: (p: number) => string;
  isMobile?: boolean;
}

const PricingCard = memo<PricingCardProps>(
  ({ plan, index, onClick, isProcessing, formatPrice, isMobile = false }) => {
    const baseRing = plan.highlight
      ? "border-2 border-appforge-blue"
      : plan.badge === "Best AI"
      ? "border-2 border-purple-500"
      : "border border-white/10";

    const hoverTransform =
      plan.name === "Pro"
        ? { scale: 1.05, y: -8, boxShadow: "0 16px 64px rgba(168,85,247,0.4)" }
        : plan.highlight
        ? { scale: 1.05, y: -8, boxShadow: "0 8px 48px rgba(24,118,242,0.3)" }
        : { scale: 1.03, y: -6, boxShadow: "0 5px 24px rgba(80,150,255,0.08)" };

    const badgeClass = plan.highlight
      ? "bg-appforge-blue text-black border border-appforge-blue/20"
      : plan.badge === "Best AI"
      ? "bg-purple-500 text-white border border-purple-500/30"
      : "";

    const iconBg = {
      Free: "bg-gradient-to-br from-gray-400 to-gray-600",
      Basic: "bg-gradient-to-br from-blue-500 to-blue-800",
      Pro: "bg-gradient-to-br from-purple-500 to-pink-600",
    }[plan.name] as string;

    return (
      <motion.div
        variants={cardVariants}
        whileHover={!isMobile ? hoverTransform : undefined}
      >
        <Card
          className={`relative glass bg-background/75 backdrop-blur shadow-xl overflow-hidden ${baseRing} rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col h-full`}
        >
          {plan.badge && (
            <div
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-md ${badgeClass}`}
            >
              {plan.badge}
            </div>
          )}

          <div
            className={`${iconBg} text-white mb-4 sm:mb-6 mx-auto p-3 sm:p-4 rounded-xl shadow-md flex justify-center items-center`}
          >
            {plan.icon}
          </div>

          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
              {plan.displayName}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-green-400 font-medium">
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
                    {formatPrice(plan.monthlyEquivalent)}/month when billed
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

          {/* Features */}
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

          <Button
            size="lg"
            disabled={isProcessing}
            onClick={onClick}
            className={`w-full font-bold tracking-wide rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm md:text-base ${
              plan.name === "Pro"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                : plan.highlight
                ? "bg-appforge-blue hover:bg-appforge-blue/90 text-black"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/20"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                Activating Agents…
              </>
            ) : (
              plan.cta
            )}
          </Button>
        </Card>
      </motion.div>
    );
  }
);

PricingCard.displayName = "PricingCard";

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const Pricing: React.FC = () => {
  /* region / currency */
  const { detectedCurrency, isLoading } = useRegionDetection();
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  /* billing toggle */
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly"
  );

  /* FAQ accordion */
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  /* payment */
  const { processPayment, isProcessing } = usePayment();
  const { user } = useAuth();

  /* set user currency once region is known */
  useEffect(() => {
    if (!isLoading) setCurrency(detectedCurrency);
  }, [detectedCurrency, isLoading]);

  /* helpers */
  const handleSubscribe = useCallback(
    async (plan: SubscriptionPlan) => {
      if (!user) {
        window.location.href = "/auth";
        return;
      }
      await processPayment(plan, currency, billingPeriod);
    },
    [user, processPayment, currency, billingPeriod]
  );

  const toggleFAQ = useCallback(
    (i: number) => setOpenFAQ(openFAQ === i ? null : i),
    [openFAQ]
  );

  const formatPrice = useCallback(
    (p: number) =>
      p === 0
        ? currency === "INR"
          ? "₹0"
          : "$0"
        : currency === "INR"
        ? `₹${p.toLocaleString()}`
        : `$${p}`,
    [currency]
  );

  /* plans */
  const plans = useMemo<PlanData[]>(() => {
    const cs = currency === "INR" ? "₹" : "$";

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
          "Advanced templates only",
          "Basic AI accuracy",
        ],
        cta: "Start with AI Free",
        highlight: false,
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
      },
    ];
  }, [currency, billingPeriod]);

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <section className="py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 md:py-24 relative bg-background isolate scroll-mt-20 md:scroll-mt-16"
    >
      {/* background blobs */}
      <span className="pointer-events-none absolute -left-40 top-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute right-0 top-0 w-80 h-56 bg-purple-500/10 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        {/* header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16 pt-8 md:pt-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm sm:text-base">
              AI-Powered Career Transformation
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI-Enhanced
            </span>{" "}
            Pricing
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            From foundational AI to advanced intelligence – choose your career
            acceleration level.
          </p>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {detectedCurrency === "INR" && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currency === "INR" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrency("INR")}
                >
                  India (₹)
                </Button>
                <Button
                  variant={currency === "USD" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrency("USD")}
                >
                  International ($)
                </Button>
              </div>
            )}

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

        {/* ------------------------------------------------------------ */}
        {/* Pricing cards                                                */}
        {/* ------------------------------------------------------------ */}

        <motion.div
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-10 max-w-7xl mx-auto"
          variants={fadeStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          key={`${currency}-${billingPeriod}`}
        >
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={i}
              onClick={() => handleSubscribe(plan.name)}
              isProcessing={isProcessing}
              formatPrice={formatPrice}
            />
          ))}
        </motion.div>

        <div className="md:hidden mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-center text-muted-foreground text-sm mb-6 px-4">
              ← Swipe to see all agent plans →
            </p>

            <div className="overflow-x-auto pb-8 px-4 scroll-px-4 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div
                className="flex gap-4"
                style={{ scrollSnapType: "x proximity" }}
              >
                {plans.map((plan, i) => (
                  <div
                    key={plan.name}
                    className="w-[85vw] max-w-sm flex-shrink-0"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <PricingCard
                      plan={plan}
                      index={i}
                      onClick={() => handleSubscribe(plan.name)}
                      isProcessing={isProcessing}
                      formatPrice={formatPrice}
                      isMobile={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Value proposition box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              🚀 Experience the Future of Job Applications
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Every plan includes AI-powered features. Higher tiers unlock more
              advanced AI models with better accuracy, faster processing, and
              deeper personalization for maximum career impact.
            </p>
            {billingPeriod === "yearly" && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                🎉 Save 25 % with annual agent deployment!
              </div>
            )}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Get answers about our AI agent workforce and pricing
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqData.map((f, i) => (
              <FAQItemComponent
                key={i}
                faq={f}
                index={i}
                isOpen={openFAQ === i}
                onToggle={() => toggleFAQ(i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
