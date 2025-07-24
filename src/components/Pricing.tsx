import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionPlan } from "@/services/paymentService";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee for all paid plans if you're not satisfied with our service.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, UPI, and bank transfers for Indian customers. International customers can pay via credit/debit cards.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
  },
];

// Animation variants
const fadeStagger = {
  show: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
};

// FAQ Item Component with Dynamic Accordion
const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="glass rounded-xl border border-white/10 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <motion.button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <h4 className="font-semibold text-lg text-slate-100 pr-4">
          {faq.question}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-blue-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-6 pb-6"
            >
              <div className="border-t border-white/10 pt-4">
                <p className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Pricing = () => {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { processPayment, isProcessing } = usePayment();
  const { user } = useAuth();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    await processPayment(plan);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const plans = [
    {
      name: "Free" as SubscriptionPlan,
      priceINR: "₹0",
      priceUSD: "$0",
      period: "forever",
      description: "Perfect for trying out ApplyForge",
      icon: <Zap className="w-7 h-7" />,
      iconBg: "from-blue-400 to-blue-600",
      features: [
        "2 resume tailoring per month",
        "Basic ATS checker",
        "1 cover letter generation",
        "Job search access",
        "Community support",
      ],
      limitations: [
        "Limited templates",
        "No priority support",
        "Basic features only",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Basic" as SubscriptionPlan,
      priceINR: "₹199",
      priceUSD: "$2.99",
      period: "per month",
      description: "Most popular choice for active job seekers",
      icon: <Crown className="w-7 h-7" />,
      iconBg: "from-blue-500 to-blue-800",
      features: [
        "Unlimited resume tailoring",
        "Advanced ATS analysis",
        "Unlimited cover letters",
        "Priority job matching",
        "All resume templates",
        "Email support",
        "Export in multiple formats",
        "Resume storage & history",
      ],
      cta: "Start Free Trial",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Pro" as SubscriptionPlan,
      priceINR: "₹499",
      priceUSD: "$7.99",
      period: "per month",
      description: "Best value for serious professionals",
      icon: <Rocket className="w-7 h-7" />,
      iconBg: "from-green-400 to-green-600",
      features: [
        "Everything in Basic",
        "Auto-Apply Agent (Coming Soon)",
        "Interview Preparation AI",
        "Salary Negotiation Assistant",
        "Personal Career Coach AI",
        "Advanced Analytics & Insights",
        "1-on-1 Career Consultation",
        "LinkedIn Profile Optimization",
      ],
      cta: "Start Free Trial",
      highlight: false,
      badge: "Best Value",
    },
  ];

  const PricingCard = ({ plan, index }) => {
    const baseRing = plan.highlight
      ? "ring-2 ring-appforge-blue/30 border-appforge-blue/50"
      : plan.badge === "Best Value"
      ? "ring-4 ring-green-500/50 border-green-500/50"
      : "border-white/10";

    const hoverTransform =
      plan.name === "Pro"
        ? { scale: 1.12, y: -12, boxShadow: "0 16px 64px rgba(34,197,94,0.6)" }
        : plan.highlight
        ? { scale: 1.07, y: -8, boxShadow: "0 8px 48px rgba(24,118,242,0.3)" }
        : { scale: 1.03, y: -6, boxShadow: "0 5px 24px rgba(80,150,255,0.08)" };

    const badgeClass = plan.highlight
      ? "bg-appforge-blue text-black border border-appforge-blue/20"
      : plan.badge === "Best Value"
      ? "bg-green-500 text-white border border-green-500/30"
      : "";

    const iconBgClass = {
      Free: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
      Basic: "bg-gradient-to-br from-blue-500 to-blue-800 text-white",
      Pro: "bg-gradient-to-br from-green-400 to-green-600 text-white",
    }[plan.name];

    return (
      <motion.div
        variants={cardVariants}
        whileHover={hoverTransform}
        className="transition-transform"
      >
        <Card
          className={`relative glass bg-background/75 backdrop-blur shadow-xl overflow-hidden ${baseRing} rounded-2xl p-6 md:p-8 flex flex-col h-full`}
        >
          {plan.badge && (
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${badgeClass}`}
            >
              {plan.badge}
            </div>
          )}

          <div
            className={`${iconBgClass} mb-6 mx-auto p-4 rounded-xl shadow-md flex justify-center items-center w-fit group-hover:scale-110 transition-transform duration-200`}
          >
            {plan.icon}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-1">{plan.name}</h3>
            <p className="text-muted-foreground text-sm md:text-base mb-2">
              {plan.description}
            </p>
            <div className="mb-2">
              <span className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {currency === "INR" ? plan.priceINR : plan.priceUSD}
              </span>
              <span className="text-muted-foreground ml-2 text-sm md:text-base font-medium">
                / {plan.period}
              </span>
            </div>
          </div>

          <ul className="space-y-2 mb-6 md:mb-8 flex-1">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {plan.limitations?.map((lim, idx) => (
              <li key={idx} className="flex items-center gap-2 opacity-50">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500/30 block"></span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {lim}
                </span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            onClick={() => handleSubscribe(plan.name)}
            disabled={isProcessing}
            className={`w-full font-bold tracking-wide rounded-xl shadow-md text-sm md:text-base py-3 ${
              plan.name === "Pro"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : plan.highlight
                ? "bg-appforge-blue hover:bg-appforge-blue/90 text-black"
                : plan.badge === "Best Value"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/20"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              plan.cta
            )}
          </Button>
        </Card>
      </motion.div>
    );
  };

  return (
    <section id="pricing" className="py-24 relative bg-background">
      {/* Background accent */}
      <span className="pointer-events-none absolute -left-40 top-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute right-0 top-0 w-80 h-56 bg-green-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-appforge-blue bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your job search goals. Start free, upgrade
            when ready.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant={currency === "INR" ? "default" : "outline"}
              onClick={() => setCurrency("INR")}
              size="sm"
              className="transition-all"
            >
              India (₹)
            </Button>
            <Button
              variant={currency === "USD" ? "default" : "outline"}
              onClick={() => setCurrency("USD")}
              size="sm"
              className="transition-all"
            >
              International ($)
            </Button>
          </div>
        </motion.header>

        {/* Desktop Pricing Grid */}
        <motion.div
          className="hidden md:grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
          variants={fadeStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </motion.div>

        {/* Mobile Horizontal Scrolling Carousel */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Scroll hint text */}
            <p className="text-center text-muted-foreground text-sm mb-4">
              ← Swipe to see all plans →
            </p>

            {/* Horizontal scrolling container */}
            <div
              className="overflow-x-auto pb-4 -mx-4 px-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Hide scrollbar */}
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="flex gap-6 w-max">
                {plans.map((plan, index) => (
                  <div
                    key={plan.name}
                    className="w-80 flex-shrink-0"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <PricingCard plan={plan} index={index} />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {plans.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-white/30" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Animated FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          viewport={{ once: true, margin: "-70px" }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h3
              className="text-3xl font-bold text-slate-100 mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Get answers to common questions about our pricing and features
            </motion.p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <FAQItem
                key={idx}
                faq={faq}
                index={idx}
                isOpen={openFAQ === idx}
                onToggle={() => toggleFAQ(idx)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
