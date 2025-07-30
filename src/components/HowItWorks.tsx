import React, { memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Upload, Wand2, Download, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// ---- Constants ----
const STEPS = [
  {
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Upload your existing resume or create one using our templates. We support all major formats.",
    step: "01",
    iconBg: "from-blue-500 to-blue-400",
  },
  {
    icon: Wand2,
    title: "Paste Job Description",
    description:
      "Copy and paste the job description you want to apply for. Our AI analyzes the requirements.",
    step: "02",
    iconBg: "from-indigo-600 to-blue-400",
  },
  {
    icon: Download,
    title: "Get Tailored Resume",
    description:
      "Receive your optimized resume with improved ATS score and relevant keywords highlighted.",
    step: "03",
    iconBg: "from-green-500 to-blue-400",
  },
  {
    icon: Send,
    title: "Apply with Confidence",
    description:
      "Download your tailored resume and cover letter, then apply knowing you have the best chance.",
    step: "04",
    iconBg: "from-purple-400 to-blue-400",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ---- Step Card ----
const StepCard = memo(function StepCard({
  step,
  isMobile = false,
}: {
  step: (typeof STEPS)[0];
  isMobile?: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      variants={itemVariants}
      className={`relative ${isMobile ? "w-[85vw] max-w-xs shrink-0" : ""}`}
    >
      <Card className="bg-background/80 backdrop-blur border border-white/10 rounded-2xl p-5 md:p-6 text-center h-full hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-400/30">
        <div
          className={
            isMobile
              ? "relative mb-4"
              : "absolute -top-4 left-1/2 transform -translate-x-1/2"
          }
        >
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white/20 shadow-lg mx-auto">
            {step.step}
          </div>
        </div>
        <div
          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center text-white shadow-lg`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className={isMobile ? "flex-1 flex flex-col justify-center" : ""}>
          <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-white leading-tight">
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

// ---- CTA ----
const CTASection = memo(function CTASection({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="max-w-sm sm:max-w-md md:max-w-lg mx-auto text-center mt-4"
    >
      <Card
        // **Smaller paddings and tighter text spacing on mobile, spacious on desktop**
        className={`
          bg-background/85 backdrop-blur border border-white/10 rounded-2xl
          p-4 sm:p-5 md:p-8
          hover:border-blue-400/30 transition-all duration-300
        `}
      >
        <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">
          Ready to Transform Your Job Search?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-5">
          Join thousands using{" "}
          <span className="font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
            ApplyForge
          </span>
        </p>
        <button
          onClick={onGetStarted}
          className="
            w-full sm:w-auto
            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
            text-white font-bold
            px-4 sm:px-6 md:px-8
            py-2 sm:py-2.5 md:py-4
            rounded-xl
            text-sm sm:text-base md:text-lg
            shadow-lg hover:shadow-blue-400/30
            transition-all duration-200
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
          "
        >
          Start Your Free Trial
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
        relative py-20 md:py-24
        bg-gradient-to-br from-background via-slate-900/70 to-blue-950/90
        overflow-hidden scroll-mt-28 md:scroll-mt-32
        z-10
      "
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-60px] top-[18%] w-36 h-36 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-44 h-28 bg-blue-800/20 rounded-2xl blur-3xl" />
      </div>

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
            How{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
              ApplyForge
            </span>{" "}
            Works
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto">
            Go from resume upload to job application in just 4 simple steps
          </p>
        </motion.div>

        {/* DESKTOP: Inline steps */}
        <div className="hidden lg:block relative mb-12 md:mb-16">
          <div className="absolute top-[120px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-4 gap-6 lg:gap-8"
          >
            {STEPS.map((step, idx) => (
              <StepCard key={step.step} step={step} isMobile={false} />
            ))}
          </motion.div>
        </div>

        {/* MOBILE: Horizontal scroll steps */}
        <div className="lg:hidden mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-center text-muted-foreground text-xs mb-5">
              ← Swipe to see all steps →
            </p>
            <div
              className="overflow-x-auto w-full"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-4 pb-1"
              >
                {STEPS.map((step, idx) => (
                  <div key={step.step} className="h-80">
                    <StepCard step={step} index={idx} isMobile={true} />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <CTASection onGetStarted={handleGetStarted} />
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;
