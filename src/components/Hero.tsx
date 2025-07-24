import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: "✨", label: "AI Resume Tailor" },
  { icon: "🎯", label: "ATS Score Checker" },
  { icon: "📝", label: "Cover Letter Gen" },
  { icon: "🔍", label: "Smart Job Finder" },
];

// Define itemVariants for staggered feature animation
const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/ats-checker");
    } else {
      navigate("/auth");
    }
  };

  const handleWatchDemo = () => {
    if (!user) {
      navigate("/auth");
    } else {
      // show demo for authenticated users
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-background to-purple-900/80 overflow-hidden">
      {/* Blurry aesthetic backgrounds */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
      >
        <div className="absolute left-[-10%] top-[-15%] w-[40vw] h-[40vw] bg-appforge-blue/25 rounded-full blur-[120px]" />
        <div className="absolute right-[-10%] top-1/2 w-[32vw] h-[32vw] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute right-0 bottom-[-10%] w-[22vw] h-[14vw] bg-blue-500/30 rounded-bl-[100vw] blur-2xl" />
      </motion.div>

      <div className="container mx-auto px-4 text-center relative z-10 pt-16 md:pt-8">
        {/* Social Proof Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: "easeInOut" }}
          className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-background/70 backdrop-blur border border-white/20 shadow-lg mb-10 mt-10"
          style={{ boxShadow: "0 4px 28px 0 rgba(80,150,255,.10)" }}
        >
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current drop-shadow"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground tracking-wider">
            Trusted by 10,000+ job seekers
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20, letterSpacing: "-0.045em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
          transition={{ delay: 0.22, duration: 0.7, ease: "easeInOut" }}
          className="font-bold text-4xl xs:text-5xl sm:text-6xl md:text-7xl mb-6 leading-none bg-gradient-to-br from-white via-white/90 to-blue-300/80 bg-clip-text text-transparent drop-shadow-md"
        >
          Get Interviews Faster with Smart{" "}
          <span className="inline-block bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
            AI-Powered
          </span>{" "}
          Tools
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl sm:max-w-3xl mx-auto backdrop-blur"
        >
          Boost your resume, beat the ATS, and get job-matching done for you—
          <span className="font-semibold text-appforge-blue">instantly</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col xs:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            className="relative px-8 py-4 text-lg font-semibold bg-gradient-to-br from-appforge-blue/90 to-blue-500 shadow-xl shadow-appforge-blue/20 text-white rounded-xl group transition-all hover:shadow-2xl hover:from-blue-700 hover:to-purple-500 focus:ring-2 focus:ring-blue-300"
            onClick={handleGetStarted}
          >
            <span className="relative z-10">
              {user ? "Check ATS Now" : "Get Started Free"}
            </span>
            <ArrowRight className="ml-3 w-5 h-5 transition-transform transform group-hover:translate-x-1.5 duration-200" />
            <span className="absolute left-0 top-0 w-full h-full rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleWatchDemo}
            className="border-2 border-white/30 bg-background/80 hover:border-appforge-blue/60 transition-colors px-8 py-4 rounded-xl text-lg focus:ring-2 focus:ring-blue-300 shadow-md flex items-center"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Watch Demo</span>
          </Button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial="initial"
          animate="animate"
        >
          {features.map(({ icon, label }, index) => (
            <motion.div
              key={label}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: 0.6 + index * 0.07,
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-background/60 border border-white/15 shadow backdrop-blur rounded-full text-sm font-medium text-slate-200 hover:border-appforge-blue/60 cursor-pointer select-none transition"
              style={{ minWidth: 140, justifyContent: "center" }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
