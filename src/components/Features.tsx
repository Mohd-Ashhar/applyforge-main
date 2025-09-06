import React, { memo, useCallback, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Target,
  Mail,
  Search,
  LucideRocket,
  Bot,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, Variants } from "framer-motion";

// **OPTIMIZED: Shortened AI-first descriptions that fit perfectly in cards**
// **FIXED: Ultra-short descriptions and single-line benefits**
const FEATURES = [
  {
    icon: Target,
    iconBg: "from-blue-600/90 to-blue-400/70",
    title: "ATS Screening Agent",
    description:
      "Continuously monitors and search for optimization in your resume.",
    tagline: "Beat the Bots",
    label: "Most Popular",
    benefits: [
      "Autonomous ATS monitoring",
      "Intelligent gap detection & alerts",
      "Smart optimization recommendations",
    ],
    clickable: true,
    path: "/ats-checker",
    implemented: true,
  },
  {
    icon: FileText,
    iconBg: "from-blue-500/90 to-indigo-400/70",
    title: "Resume Tailoring Agent",
    description:
      "Automatically customizes your resume for each application, maximizing relevance.",
    tagline: "3x Interview Booster",
    benefits: [
      "Missing keywords detection",
      "Matches qualifications intelligently",
      "Delivers instant 95%+ ATS scores",
    ],
    clickable: true,
    path: "/ai-resume-tailor",
    implemented: true,
  },
  {
    icon: Mail,
    iconBg: "from-fuchsia-600/80 to-blue-400/50",
    title: "Cover Letter Crafting Agent",
    description:
      "Creates compelling, personalized cover letters in 30 seconds for any company.",
    tagline: "Story-Powered AI",
    benefits: [
      "Intelligent personalization engine",
      "50% higher response rate",
      "Crafted in 30 seconds autonomously",
    ],
    clickable: true,
    path: "/cover-letter-generator",
    implemented: true,
  },
  {
    icon: Search,
    iconBg: "from-emerald-500/90 to-cyan-400/70",
    title: "Job Discovery Agent",
    description:
      "Scans exclusive networks to find hidden opportunities before competitors see them.",
    tagline: "Opportunity Hunter",
    benefits: [
      "70% more opportunities",
      "Predicts perfect culture fit",
      "Finds roles 2-3 days earlier",
    ],
    clickable: true,
    path: "/job-finder",
    implemented: true,
  },
  {
    icon: LucideRocket,
    iconBg: "from-yellow-400/80 to-orange-500/60",
    title: "Instant Generation Agent",
    description:
      "Creates perfectly tailored applications in 30 seconds, 90% faster than manual.",
    tagline: "30-Second Applications",
    benefits: [
      "No manual effort needed",
      "No more copy-paste",
      "Generate direct from job listings",
    ],
    clickable: true,
    path: "/one-click-tailoring",
    implemented: true,
  },
  {
    icon: Bot,
    iconBg: "from-purple-500/90 to-indigo-600/60",
    title: "Auto-Apply Agent",
    description:
      "Applies to matched opportunities 24/7, managing deadlines so you never miss out.",
    tagline: "Never-Sleep Agent",
    label: "Coming Soon",
    benefits: [
      "Applies to 50+ jobs weekly",
      "Never misses deadlines again",
      "Focus on interviews only",
    ],
    comingSoon: true,
    clickable: true,
    path: "#",
    implemented: false,
  },
] as const;

// **ENHANCED: Success-focused stats with stronger proof points**
const STATS = [
  {
    value: "95%",
    label: "Agent Success Rate",
    from: "from-green-400",
    to: "to-green-500",
  },
  {
    value: "5x",
    label: "Interview Acceleration",
    from: "from-blue-400",
    to: "to-blue-600",
  },
  {
    value: "30sec",
    label: "Agent Activation",
    from: "from-purple-400",
    to: "to-pink-500",
  },
] as const;

// Simplified animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Optimized Feature Card with reduced complexity
const FeatureCard = memo(
  ({
    feature,
    onFeatureClick,
    isMobile = false,
  }: {
    feature: (typeof FEATURES)[number];
    onFeatureClick: (path: string, implemented: boolean) => void;
    isMobile?: boolean;
  }) => {
    const Icon = feature.icon;

    const handleClick = useCallback(() => {
      if (feature.clickable) {
        onFeatureClick(feature.path, feature.implemented);
      }
    }, [feature.clickable, feature.path, feature.implemented, onFeatureClick]);

    return (
      <motion.div
        variants={cardVariants}
        whileHover={
          !isMobile ? { y: -4, transition: { duration: 0.2 } } : undefined
        }
        className="group"
      >
        <Card
          className={`relative ${
            isMobile ? "p-5 w-80" : "p-6 md:p-8"
          } bg-background/85 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg ${
            feature.clickable
              ? "cursor-pointer active:scale-[0.98]"
              : "cursor-default"
          } ${isMobile ? "min-h-[350px] shrink-0" : ""}`}
          onClick={handleClick}
          tabIndex={feature.clickable ? 0 : -1}
          role={feature.clickable ? "button" : undefined}
        >
          {/* Coming Soon Badge */}
          {"comingSoon" in feature && feature.comingSoon && (
            <div className="absolute top-3 right-3 bg-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Coming Soon
            </div>
          )}

          {/* Icon */}
          <div
            className={`inline-flex ${isMobile ? "p-3" : "p-4 md:p-5"} ${
              isMobile ? "mb-4" : "mb-6 md:mb-8"
            } rounded-xl bg-gradient-to-br ${
              feature.iconBg
            } text-white transition-transform duration-200 group-hover:scale-105`}
          >
            <Icon
              className={`${isMobile ? "w-5 h-5" : "w-6 h-6 md:w-7 md:h-7"}`}
            />
          </div>

          {/* Title */}
          <h3
            className={`${
              isMobile ? "text-lg" : "text-xl md:text-2xl"
            } font-bold ${
              isMobile ? "mb-3" : "mb-4 md:mb-5"
            } leading-tight text-blue-200`}
          >
            {feature.title}
          </h3>

          {/* **FIXED: Shorter description with proper line limiting** */}
          <p
            className={`text-muted-foreground ${
              isMobile ? "mb-4 text-sm" : "mb-6 md:mb-8 text-sm md:text-base"
            } leading-relaxed line-clamp-2`}
          >
            {feature.description}
          </p>

          {/* Benefits */}
          <ul
            className={`${isMobile ? "space-y-2" : "space-y-2 md:space-y-3"}`}
          >
            {feature.benefits.map((benefit) => (
              <li
                key={benefit}
                className={`flex items-center gap-2 ${
                  isMobile ? "text-sm" : "text-sm md:text-base"
                } font-medium text-slate-300`}
              >
                <CheckCircle
                  className={`${
                    isMobile ? "w-4 h-4" : "w-4 h-4 md:w-5 md:h-5"
                  } text-green-400 shrink-0`}
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// Optimized Mobile Carousel with better performance
const MobileCarousel = memo(
  ({
    features,
    onFeatureClick,
  }: {
    features: typeof FEATURES;
    onFeatureClick: (path: string, implemented: boolean) => void;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>();
    const [isUserScrolling, setIsUserScrolling] = useState(false);

    useEffect(() => {
      const startAutoScroll = () => {
        intervalRef.current = setInterval(() => {
          if (!isUserScrolling && scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            const cardWidth = 320 + 16;

            if (scrollLeft >= maxScroll - 10) {
              scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              const nextScroll = scrollLeft + cardWidth;
              scrollRef.current.scrollTo({
                left: nextScroll,
                behavior: "smooth",
              });
            }
          }
        }, 4000);
      };

      startAutoScroll();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isUserScrolling]);

    const handleScrollStart = useCallback(() => {
      setIsUserScrolling(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, []);

    const handleScrollEnd = useCallback(() => {
      const timer = setTimeout(() => setIsUserScrolling(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="relative">
        <div
          ref={scrollRef}
          onTouchStart={handleScrollStart}
          onTouchEnd={handleScrollEnd}
          onMouseDown={handleScrollStart}
          onMouseUp={handleScrollEnd}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {features.map((feature) => (
            <div key={feature.title} className="snap-start">
              <FeatureCard
                feature={feature}
                onFeatureClick={onFeatureClick}
                isMobile={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);
MobileCarousel.displayName = "MobileCarousel";

// Simplified Stats Component
const StatsSection = memo(() => (
  <div className="mt-12 md:mt-20 bg-background/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 md:px-8 py-4 md:py-10">
    <div className="grid grid-cols-3 gap-4 md:gap-10 text-center">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center">
          <span
            className={`mb-1 md:mb-2 text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r ${stat.from} ${stat.to} bg-clip-text text-transparent`}
          >
            {stat.value}
          </span>
          <span className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  </div>
));
StatsSection.displayName = "StatsSection";

const Features = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFeatureClick = useCallback(
    (path: string, implemented = false) => {
      if (path === "#") {
        // Handle "Coming Soon" features without navigating
        toast({
          title: "Coming Soon! 🚀",
          description:
            "This revolutionary AI feature is launching soon. Be the first to experience job hunting on autopilot!",
          duration: 3000,
        });
        return;
      }

      if (!user) {
        navigate("/auth");
        return;
      }

      if (!implemented) {
        toast({
          title: "Coming Soon! 🚀",
          description:
            "This revolutionary AI feature is launching soon. Be the first to experience job hunting on autopilot!",
          duration: 3000,
        });
        return;
      }

      navigate(path);
    },
    [user, navigate, toast]
  );

  return (
    <section
      id="features"
      className="relative py-16 md:py-20 bg-gradient-to-br from-background via-slate-900/60 to-background overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-[8vw] w-52 h-52 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="absolute right-[10vw] bottom-[7vw] w-60 h-44 bg-purple-500/5 rounded-3xl blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Intelligent Agents Working for Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-4">
            Autonomous AI agents that work 24/7 to optimize applications,
            discover opportunities, and accelerate your career
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="block sm:hidden">
            <MobileCarousel
              features={FEATURES}
              onFeatureClick={handleFeatureClick}
            />
          </div>

          <div className="hidden sm:grid md:hidden grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                onFeatureClick={handleFeatureClick}
              />
            ))}
          </div>

          <div className="hidden md:grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                onFeatureClick={handleFeatureClick}
              />
            ))}
          </div>
        </motion.div>

        <StatsSection />
      </div>
    </section>
  );
});

Features.displayName = "Features";
export default Features;
