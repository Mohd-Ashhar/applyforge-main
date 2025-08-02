import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  FileText,
  PenSquare,
  Search,
  Shield,
  Zap,
  Bot,
  Crown,
  Sparkles,
  ArrowRight,
  Target,
  Mail,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useToast } from "@/hooks/use-toast";
import UsageStatsCard from "@/components/UsageStatsCard";
import UserAvatar from "@/components/header/UserAvatar";
import DashboardHeader from "@/components/DashboardHeader";

// **MINIMAL DARK FEATURE CARDS - MAINTAINING APPLYFORGE THEME**
const DASHBOARD_FEATURES = [
  {
    icon: Shield,
    title: "ATS Resume Check",
    description: "Scan resume for ATS compatibility",
    path: "/ats-checker",
    implemented: true,
    gradient: "from-green-500/20 to-emerald-600/20",
    iconColor: "text-green-400",
    borderColor: "border-green-500/20",
  },
  {
    icon: FileText,
    title: "AI Resume Tailor",
    description: "Customize resumes for job applications",
    path: "/ai-resume-tailor",
    implemented: true,
    gradient: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters",
    path: "/cover-letter-generator",
    implemented: true,
    gradient: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Search,
    title: "Job Finder",
    description: "Discover relevant job opportunities",
    path: "/job-finder",
    implemented: true,
    gradient: "from-emerald-500/20 to-cyan-400/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "One-Click Tailor",
    description: "Quick resume tailoring from job listings",
    path: "/one-click-tailoring",
    implemented: true,
    gradient: "from-orange-500/20 to-yellow-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20",
  },
  {
    icon: Bot,
    title: "Auto-Apply Agent",
    description: "Automated job applications",
    path: "/auto-apply-agent",
    implemented: false,
    gradient: "from-gray-500/20 to-gray-600/20",
    iconColor: "text-gray-400",
    borderColor: "border-gray-500/20",
    comingSoon: true,
  },
];

// **QUICK STATS - DARK THEME**
const QUICK_STATS = [
  {
    title: "Response Rate",
    value: "23%",
    change: "+12%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Applications Sent",
    value: "47",
    change: "+8",
    positive: true,
    icon: Users,
  },
  {
    title: "Avg Response Time",
    value: "3.2 days",
    change: "-1.1 days",
    positive: true,
    icon: Clock,
  },
];

// **MINIMAL DARK FEATURE CARD COMPONENT**
const MinimalDarkFeatureCard = memo(
  ({
    feature,
    onFeatureClick,
  }: {
    feature: (typeof DASHBOARD_FEATURES)[0];
    onFeatureClick: (path?: string, implemented?: boolean) => void;
  }) => {
    const Icon = feature.icon;

    const handleClick = useCallback(() => {
      onFeatureClick(feature.path, feature.implemented);
    }, [feature.path, feature.implemented, onFeatureClick]);

    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group"
      >
        <Card
          className={`relative bg-background/60 backdrop-blur-sm border ${feature.borderColor} hover:border-blue-400/40 transition-all duration-200 cursor-pointer h-full hover:bg-background/80`}
          onClick={handleClick}
        >
          <CardContent className="p-6">
            {/* Coming Soon Badge */}
            {feature.comingSoon && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 text-xs bg-purple-500/20 text-purple-400 border-purple-500/30"
              >
                Coming Soon
              </Badge>
            )}

            {/* Icon */}
            <div
              className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} border ${feature.borderColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
            >
              <Icon className={`w-6 h-6 ${feature.iconColor}`} />
            </div>

            {/* Content */}
            <h3 className="font-semibold text-white mb-2 text-lg group-hover:text-blue-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {feature.description}
            </p>

            {/* Action Indicator */}
            <div className="flex items-center text-sm text-muted-foreground group-hover:text-blue-400 transition-colors">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

// **QUICK STATS COMPONENT - DARK THEME**
const QuickStatsDark = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {QUICK_STATS.map((stat, index) => (
      <Card
        key={stat.title}
        className="bg-background/60 backdrop-blur-sm border border-white/10"
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
            <div className="text-right">
              <stat.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p
                className={`text-xs font-medium ${
                  stat.positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
));

// **MAIN DASHBOARD COMPONENT - CLEANED UP & CENTERED**
const Dashboard = memo(() => {
  const { user } = useAuth();
  const { usage, isLoading } = useUsageTracking();
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // **MEMOIZED GREETING**
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // **MEMOIZED USER NAME**
  const userName = useMemo(() => {
    return (
      user?.user_metadata?.full_name?.split(" ")[0] ||
      user?.email?.split("@")[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  // **FEATURE CLICK HANDLER**
  const handleFeatureClick = useCallback(
    (path?: string, implemented = false) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!implemented) {
        toast({
          title: "Coming Soon",
          description: "This feature is currently under development.",
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

  // **LOADING STATE - DARK THEME**
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* **HEADER** */}
        <DashboardHeader />

        {/* **MAIN CONTENT - CENTERED LAYOUT** */}
        <div className="container mx-auto px-4 py-8">
          {/* **WELCOME SECTION - SIMPLIFIED & CENTERED** */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-4">
              <UserAvatar
                user={user}
                size="lg"
                variant="premium"
                showOnlineIndicator
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {greeting}, {userName}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Ready to advance your career today?
                </p>
              </div>
            </div>
          </div>

          {/* **QUICK STATS** */}
          <QuickStatsDark />

          {/* **MAIN CONTENT AREA - CENTERED** */}
          <div className="max-w-6xl mx-auto">
            {/* **FEATURE CARDS SECTION** */}
            <div className="mb-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Core Features
                </h2>
                <p className="text-muted-foreground text-sm">
                  Essential tools for your job search success
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DASHBOARD_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MinimalDarkFeatureCard
                      feature={feature}
                      onFeatureClick={handleFeatureClick}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* **USAGE STATS - CENTERED** */}
            <div className="mb-8">
              <UsageStatsCard />
            </div>

            {/* **UPGRADE CTA - CENTERED & ONLY FOR FREE USERS** */}
            {usage?.plan_type === "Free" && (
              <div className="max-w-md mx-auto">
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-6 h-6 text-blue-400" />
                    </div>

                    <h3 className="font-semibold text-white mb-2">
                      Upgrade to Pro
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4">
                      Unlock unlimited access to all features and advanced
                      analytics.
                    </p>

                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      asChild
                    >
                      <Link to="/pricing">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
