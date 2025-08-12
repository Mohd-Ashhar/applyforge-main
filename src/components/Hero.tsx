import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "🧠", label: "Resume Optimization Agent" },
  { icon: "✅", label: "ATS Screening Agent" },
  { icon: "✍️", label: "Cover Letter Crafting Agent" },
  { icon: "🔎", label: "Job Discovery Agent" },
];

const TRUST_ICONS = [
  { icon: Bot, label: "AI-Powered", color: "text-blue-400" },
  { icon: Sparkles, label: "Optimized by LLMs", color: "text-purple-400" },
  { icon: Zap, label: "Blazing Fast", color: "text-yellow-400" },
];

const Hero = memo(() => {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    navigate("/tailored-resumes");
  }, [navigate]);

  const handleDemo = useCallback(() => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-background to-purple-900/80 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-20%] top-[-20%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute right-[-20%] top-1/2 w-[50vw] h-[50vw] bg-purple-600/15 rounded-full blur-[80px]" />
      </div>

      <motion.div
        className="container mx-auto px-4 text-center relative z-10 pt-24 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {/* Social Proof */}
        {/* Will Implement in Future */}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-bold text-3xl sm:text-5xl lg:text-6xl mb-6 leading-tight bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent"
        >
          Get Interviews{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            3x
          </span>{" "}
          Faster with Smart{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Tools
        </motion.h1>

        {/* Enhanced Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Optimize resumes, beat ATS systems, craft cover letters, and find your
          dream job, all{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            in seconds
          </span>{" "}
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-8"
        >
          {TRUST_ICONS.map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1 bg-background/20 rounded-lg border border-white/10"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-md sm:max-w-none mx-auto"
        >
          <Button
            size="lg"
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all group"
          >
            Start Optimizing
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleDemo}
            className="px-8 py-4 border-2 border-white/30 bg-background/90 rounded-2xl hover:border-blue-400/60 group"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            See How It Works
          </Button>
        </motion.div>

        {/* Minimalistic Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
        >
          {FEATURES.map(({ icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 px-3 py-2 bg-background/60 border border-white/15 rounded-full hover:border-blue-400/50 hover:bg-background/70 transition-all group cursor-default"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <span className="text-xs font-medium text-slate-200 whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
