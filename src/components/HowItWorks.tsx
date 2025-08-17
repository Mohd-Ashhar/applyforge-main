import React, { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Bot,
  Brain,
  Zap,
  Rocket,
  type LucideIcon,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, type Variants } from "framer-motion";

// ---- Types ----
interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  step: string;
  iconBg: string;
  agentType: string;
}

interface StepCardProps {
  step: Step;
  isMobile?: boolean;
}

interface CTASectionProps {
  onGetStarted: () => void;
}

// ---- Constants ----
const STEPS: readonly Step[] = [
  {
    icon: Bot,
    title: "Activate Your Agents",
    description:
      "Your AI workforce analyzes your experience and prepares for autonomous operation.",
    step: "01",
    iconBg: "from-blue-500 to-blue-400",
    agentType: "Analysis Agent",
  },
  {
    icon: Brain,
    title: "Agents Decode Opportunity",
    description:
      "Multiple AI agents simultaneously analyze requirements and identify optimization targets.",
    step: "02",
    iconBg: "from-indigo-600 to-blue-400",
    agentType: "Research Agent",
  },
  {
    icon: Zap,
    title: "Agents Optimize Everything",
    description:
      "Your workforce creates ATS-perfect resumes and cover letters while you watch.",
    step: "03",
    iconBg: "from-green-500 to-blue-400",
    agentType: "Optimization Agent",
  },
  {
    icon: Rocket,
    title: "Agents Deploy Applications",
    description:
      "Your AI team submits optimized applications instantly, maximizing interview potential.",
    step: "04",
    iconBg: "from-purple-400 to-blue-400",
    agentType: "Deployment Agent",
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ---- Step Card ----
const StepCard = memo<StepCardProps>(function StepCard({
  step,
  isMobile = false,
}) {
  const Icon = step.icon;
  return (
    <motion.div
      variants={itemVariants}
      className={`
        relative 
        ${isMobile ? "w-[85vw] max-w-xs flex-none" : ""}
      `}
    >
      <Card
        className="
          relative
          bg-background/90 backdrop-blur-sm
          border border-white/10 
          rounded-2xl p-5 md:p-6 
          text-center h-full 
          hover:shadow-xl hover:shadow-blue-500/10 
          transition-all duration-300 
          hover:border-blue-400/30
          shadow-lg shadow-black/5
        "
      >
        {/* Agent Status Indicator */}
        {/* <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-600/20 border border-green-400/30 rounded-full px-2 py-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-300 font-medium">Active</span>
        </div> */}

        <div
          className={
            isMobile
              ? "relative mb-4 z-10"
              : "absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          }
        >
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white/20 shadow-lg mx-auto">
            {step.step}
          </div>
        </div>

        {/* Agent Type Badge */}
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
            {step.agentType}
          </span>
        </div>

        <div
          className={`
            w-12 h-12 md:w-14 md:h-14 
            mx-auto mb-4 
            rounded-xl 
            bg-gradient-to-br ${step.iconBg} 
            flex items-center justify-center 
            text-white shadow-lg
            relative z-10
          `}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div
          className={`relative z-10 ${
            isMobile ? "flex-1 flex flex-col justify-center" : ""
          }`}
        >
          <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-blue-200 leading-tight">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
            {step.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
});

// ---- Agent Collaboration Indicator ----
// const AgentCollaboration = memo(function AgentCollaboration() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//       viewport={{ once: true }}
//       className="text-center mb-8 md:mb-12"
//     >
//       <div className="bg-background/60 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <Activity className="w-4 h-4 text-blue-400" />
//           <h4 className="text-sm md:text-base font-semibold text-blue-300">
//             Your Agents Work Together
//           </h4>
//         </div>
//         <p className="text-xs md:text-sm text-muted-foreground">
//           While one agent analyzes job requirements, another optimizes your
//           resume, and a third crafts your cover letter - all simultaneously.
//         </p>
//       </div>
//     </motion.div>
//   );
// });

// ---- CTA ----
const CTASection = memo<CTASectionProps>(function CTASection({ onGetStarted }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center mt-4"
    >
      <Card
        className="
          relative
          bg-background/90 backdrop-blur-sm
          border border-white/10 
          rounded-2xl
          p-4 sm:p-5 md:p-8
          hover:border-blue-400/30 
          transition-all duration-300
          shadow-lg shadow-black/5
        "
      >
        {/* <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">
          Deploy Your{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Agent Workforce
          </span>{" "}
          Today
        </h3> */}
        <h3 className="text-base sm:text-lg text-muted-foreground  md:text-l font-bold mb-2 sm:mb-3 md:mb-4">
          Join{" "}
          <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ApplyForge
          </span>{" "}
          and let intelligent agents accelerate your career.
        </h3>

        <button
          onClick={onGetStarted}
          className="
            w-full sm:w-auto
            bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700
            text-white font-bold
            px-4 sm:px-6 md:px-8
            py-2 sm:py-2.5 md:py-4
            rounded-xl
            text-sm sm:text-base md:text-lg
            shadow-lg hover:shadow-blue-400/30
            transition-all duration-200
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            active:scale-95
          "
        >
          Activate My Agents
        </button>
      </Card>
    </motion.div>
  );
});

// ---- MAIN SECTION ----
const HowItWorks = memo(function HowItWorks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = useCallback(() => {
    if (user) {
      navigate("/ats-checker");
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <section
      id="how-it-works"
      className="
        relative
        py-16 sm:py-20 md:py-24
        bg-gradient-to-br from-background via-slate-900/70 to-blue-950/90
        overflow-hidden
        scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-24
        border-t border-white/5
      "
      style={{
        marginTop: "-1px", // Eliminate any gap
        zIndex: 1,
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-60px] top-[18%] w-36 h-36 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-44 h-28 bg-blue-800/20 rounded-2xl blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
              AI Agents
            </span>{" "}
            in Action
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto">
            Autonomous agents work 24/7 to accelerate your career in 4 seamless
            steps
          </p>
        </motion.div>

        {/* Agent Collaboration Indicator */}
        {/* <AgentCollaboration /> */}

        {/* DESKTOP: Inline steps */}
        <div className="hidden lg:block relative mb-12 md:mb-16">
          <div className="absolute top-[120px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent z-0" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10"
          >
            {STEPS.map((step) => (
              <StepCard key={step.step} step={step} isMobile={false} />
            ))}
          </motion.div>
        </div>

        {/* MOBILE/TABLET: Horizontal scroll steps */}
        <div className="lg:hidden mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <p className="text-center text-muted-foreground text-xs mb-5">
              ← Swipe to see your agent workflow →
            </p>

            {/* Scroll Container */}
            <div
              className="
                overflow-x-auto 
                overscroll-x-contain
                w-full
                pb-2
                -mx-4
                px-4
              "
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-4 w-max"
              >
                {STEPS.map((step) => (
                  <div key={step.step} className="h-80">
                    <StepCard step={step} isMobile={true} />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10">
          <CTASection onGetStarted={handleGetStarted} />
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;
