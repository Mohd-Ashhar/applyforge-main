import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  PenSquare,
  Search,
  Shield,
  Zap,
  Bot,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Mail,
  Trophy,
  Target,
  Star,
  Flame,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "@/components/header/UserAvatar";
import DashboardHeader from "@/components/DashboardHeader";
import UsageStatsCard from "@/components/UsageStatsCard";

// **ENHANCED FEATURE CARDS DATA WITH REORDERING AND RECOMMENDATIONS**
const DASHBOARD_FEATURES = [
  {
    id: "ats-checker",
    icon: Shield,
    title: "ATS Resume Check",
    description: "Check your resume's ATS score and optimize instantly.",
    path: "/ats-checker",
    implemented: true,
    gradient: "from-green-500/20 to-emerald-600/30",
    iconColor: "text-green-400",
    borderColor: "border-green-500/30",
    hoverColor: "hover:border-green-400/60",
    bgGradient: "bg-gradient-to-br from-green-500/10 to-emerald-600/10",
    features: ["ATS Score Analysis", "Keyword Detection", "Format Tips"],
    recommended: true,
    priority: 1,
  },
  {
    id: "ai-resume-tailor",
    icon: FileText,
    title: "AI Resume Tailor",
    description: "Tailor resumes to job descriptions using advanced AI.",
    path: "/ai-resume-tailor",
    implemented: true,
    gradient: "from-blue-500/20 to-indigo-600/30",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    hoverColor: "hover:border-blue-400/60",
    bgGradient: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10",
    features: ["Smart Keywords", "Role Tailoring", "Instant Download"],
    priority: 2,
  },
  {
    id: "cover-letter-generator",
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate personalized, professional cover letters instantly.",
    path: "/cover-letter-generator",
    implemented: true,
    gradient: "from-purple-500/20 to-pink-600/30",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    hoverColor: "hover:border-purple-400/60",
    bgGradient: "bg-gradient-to-br from-purple-500/10 to-pink-600/10",
    features: ["Multiple Tones", "Templates", "Quick Export"],
    priority: 3,
  },
    {
    id: "job-finder",
    icon: Search,
    title: "Job Finder",
    description: "Discover jobs with smart filtering and real-time updates.",
    path: "/job-finder",
    implemented: true,
    gradient: "from-emerald-500/20 to-cyan-400/30",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    hoverColor: "hover:border-emerald-400/60",
    bgGradient: "bg-gradient-to-br from-emerald-500/10 to-cyan-400/10",
    features: ["Smart Filters", "Real-time Updates", "Save & Track"],
    priority: 4,
  },
  {
    id: "one-click-tailor",
    icon: Zap,
    title: "One-Click Tailor",
    description: "Quick resume tailoring directly from job listings.",
    path: "/one-click-tailoring",
    implemented: true,
    gradient: "from-orange-500/20 to-yellow-500/30",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    hoverColor: "hover:border-orange-400/60",
    bgGradient: "bg-gradient-to-br from-orange-500/10 to-yellow-500/10",
    features: ["Instant Processing", "Seamless Integration", "Time Saving"],
    priority: 5,
  },
  {
    id: "auto-apply-agent",
    icon: Bot,
    title: "Auto-Apply Agent",
    description: "Automated job applications while you sleep.",
    path: "/auto-apply-agent",
    implemented: false,
    gradient: "from-gray-500/20 to-gray-600/30",
    iconColor: "text-gray-400",
    borderColor: "border-gray-500/30",
    hoverColor: "hover:border-gray-400/50",
    bgGradient: "bg-gradient-to-br from-gray-500/10 to-gray-600/10",
    features: ["24/7 Applications", "Smart Filtering", "Auto Tracking"],
    comingSoon: true,
    priority: 6,
  },
] as const;

// **ENHANCED STATS WITH PROGRESS INDICATORS**
const QUICK_STATS = [
  {
    id: "response-rate",
    title: "Response Rate",
    value: "23%",
    change: "+12%",
    changeValue: 12,
    positive: true,
    icon: TrendingUp,
    progress: 23,
    target: 30,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    progressColor: "bg-green-500",
  },
  {
    id: "applications-sent",
    title: "Applications Sent",
    value: "47",
    change: "+8",
    changeValue: 8,
    positive: true,
    icon: Users,
    progress: 47,
    target: 50,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    progressColor: "bg-blue-500",
  },
  {
    id: "avg-response-time",
    title: "Avg Response Time",
    value: "3.2 days",
    change: "-1.1 days",
    changeValue: -1.1,
    positive: true,
    icon: Clock,
    progress: 68, // Lower is better, so inverted
    target: 100,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    progressColor: "bg-purple-500",
  },
] as const;

// **ENHANCED FEATURE CARD COMPONENT WITH ALL IMPROVEMENTS**
const EnhancedFeatureCard = memo(
  ({
    feature,
    onFeatureClick,
  }: {
    feature: (typeof DASHBOARD_FEATURES)[number];
    onFeatureClick: (path?: string, implemented?: boolean) => void;
  }) => {
    const Icon = feature.icon;

    const handleClick = useCallback(() => {
      onFeatureClick(feature.path, feature.implemented);
    }, [feature.path, feature.implemented, onFeatureClick]);

    return (
      <Card
        className={`relative ${feature.bgGradient} backdrop-blur-sm border ${
          feature.borderColor
        } ${
          feature.hoverColor
        } transition-all duration-300 cursor-pointer h-full group hover:shadow-2xl hover:shadow-blue-500/20 ${
          feature.recommended ? "ring-2 ring-yellow-400/30" : ""
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-4 md:p-6">
          {/* ENHANCED: Recommended Badge */}
          {feature.recommended && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
            >
              ⭐ Recommended
            </motion.div>
          )}

          {/* Coming Soon Badge */}
          {feature.comingSoon && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 text-xs bg-gray-500/20 text-gray-400 border-gray-500/30 font-semibold"
            >
              Coming Soon
            </Badge>
          )}

          {/* ENHANCED: Icon with Animation and Glow */}
          <div className="relative mb-4 md:mb-6">
            <motion.div
              className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} border ${feature.borderColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}
              whileHover={{
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 },
              }}
            >
              <Icon className={`w-6 h-6 md:w-8 md:h-8 ${feature.iconColor}`} />
            </motion.div>

            {/* Glow effect on hover */}
            <div
              className={`absolute inset-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}
            />
          </div>

          {/* ENHANCED: Content with Better Typography */}
          <div className="space-y-3 md:space-y-4">
            <div>
              <h3 className="font-bold text-white mb-2 text-lg md:text-xl lg:text-2xl group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* ENHANCED: Feature List with Better Mobile Layout */}
            <div className="space-y-1 md:space-y-2">
              {feature.features.map((feat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-2 text-xs md:text-sm text-slate-300"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${feature.iconColor.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />
                  <span>{feat}</span>
                </motion.div>
              ))}
            </div>

            {/* ENHANCED: Action Button with Gradient */}
            <div className="pt-2">
              <motion.div
                className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-blue-400 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <span className="font-medium">
                  {feature.comingSoon ? "Notify Me" : "Get Started"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

// **ENHANCED STATS COMPONENT WITH PROGRESS BARS**
const EnhancedQuickStats = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
    {QUICK_STATS.map((stat, index) => (
      <motion.div
        key={stat.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="bg-background/60 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {/* ENHANCED: Better Typography Hierarchy */}
                <p className="text-sm md:text-base text-muted-foreground mb-2 font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>

                {/* ENHANCED: Change Indicator with Animation */}
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.positive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {stat.positive ? "↗" : "↘"}
                    <span>{stat.change}</span>
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <motion.div
                  className={`p-3 rounded-xl ${stat.bgColor} mb-2`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon
                    className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`}
                  />
                </motion.div>
              </div>
            </div>

            {/* ENHANCED: Progress Bar with Animation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{stat.progress}% of target</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              >
                <Progress value={stat.progress} className="h-2" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
));

// **GAMIFICATION COMPONENT**
const EngagementSection = memo(() => {
  const [completedResumes, setCompletedResumes] = useState(3);
  const [streakDays, setStreakDays] = useState(4);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
        <CardContent className="p-6 md:p-8 text-center">
          {/* Streak Section */}
          <div className="mb-6">
            <motion.div
              className="flex items-center justify-center gap-2 mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              <span className="text-2xl md:text-3xl font-bold text-white">
                {streakDays} Day Streak!
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm md:text-base">
              You've been active for {streakDays} days in a row. Keep it up! 🔥
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              <span className="text-lg md:text-xl font-semibold text-white">
                Weekly Progress
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              You've optimized{" "}
              <span className="font-bold text-blue-400">
                {completedResumes}
              </span>{" "}
              resumes this week!
            </p>

            {/* Progress to Badge */}
            <div className="bg-background/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">
                  Progress to Badge
                </span>
                <span className="text-sm text-muted-foreground">
                  {completedResumes}/5
                </span>
              </div>
              <Progress value={(completedResumes / 5) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete {5 - completedResumes} more to earn your{" "}
                <span className="text-yellow-400 font-semibold">
                  Resume Master 🎖
                </span>{" "}
                badge!
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate("/ats-checker")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 text-base md:text-lg"
            >
              <Target className="w-4 h-4 mr-2" />
              Continue Your Journey
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// **MAIN DASHBOARD COMPONENT**
const Dashboard = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // **OPTIMIZED: Calculate greeting once per session**
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // **OPTIMIZED: Stable user name**
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  // **ENHANCED: Sort features by priority**
  const sortedFeatures = useMemo(() => {
    return [...DASHBOARD_FEATURES].sort((a, b) => a.priority - b.priority);
  }, []);

  // **OPTIMIZED: Stable feature click handler**
  const handleFeatureClick = useCallback(
    (path?: string, implemented = false) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!implemented) {
        toast({
          title: "Coming Soon! 🚀",
          description:
            "This feature is currently under development. We'll notify you when it's ready!",
          duration: 3000,
        });
        return;
      }

      if (path) {
        navigate(path);
      }
    },
    [user, navigate, toast]
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* **HEADER** */}
        <DashboardHeader />

        {/* **MAIN CONTENT** */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* **ENHANCED WELCOME SECTION** */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <UserAvatar
                user={user}
                size="lg"
                variant="premium"
                showOnlineIndicator
              />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {greeting}, {userName}! 👋
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl px-4">
                  Ready to advance your career today?
                </p>
              </div>
            </motion.div>
          </div>

          {/* **ENHANCED QUICK STATS** */}
          <EnhancedQuickStats />

          {/* **MAIN CONTENT AREA** */}
          <div className="max-w-7xl mx-auto">
            {/* **ENHANCED FEATURES SECTION** */}
            <div className="mb-8">
              <div className="text-center mb-6 md:mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
                >
                  Core Features
                </motion.h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
                  Essential tools for your job search success
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sortedFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <EnhancedFeatureCard
                      feature={feature}
                      onFeatureClick={handleFeatureClick}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* **ENHANCED ENGAGEMENT SECTION** */}
            <EngagementSection />

            {/* **ENHANCED USER USAGE CARD** */}
            <div className="mb-8">
              <Suspense
                fallback={
                  <Card className="bg-background/60 backdrop-blur-sm border border-white/10">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
                      />
                      <p className="text-muted-foreground mt-3">
                        Loading usage data...
                      </p>
                    </CardContent>
                  </Card>
                }
              >
                <UsageStatsCard />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
