import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  X,
  ChevronDown,
  Info,
  RefreshCw,
  Sparkles,
  Target,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  BadgeCheck,
  TrendingUp,
  Bot,
  Brain,
  Eye,
  Home,
  ChevronRight,
  Users,
  Activity,
  Crown,
  Settings,
  Radar,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RadarLocationInput from "@/components/RadarLocationInput";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";
import { Helmet } from "react-helmet-async";

const DiscoveryAgentLoadingOverlay = memo(
  ({ show, stage = 0 }: { show: boolean; stage?: number }) => {
    const agentMessages = [
      "🔌 Connecting to global job databases...",
      "🧠 Analyzing your search criteria...",
      "⚡ Discovering matching opportunities...",
      "🎯 Filtering results based on preferences...",
      "📊 Ranking best opportunities for you...",
      "✨ Preparing personalized job recommendations...",
    ];

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg bg-background/90 p-4"
          >
            <motion.div
              className="relative mb-6 sm:mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-yellow-500/20 border border-orange-500/20 flex items-center justify-center backdrop-blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Radar className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-orange-400" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-orange-400/30"
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.8, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-3 sm:space-y-4 max-w-sm sm:max-w-md"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Job Discovery Agent
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-orange-400 font-medium leading-relaxed">
                {agentMessages[stage] || agentMessages[0]}
              </p>

              <div className="space-y-2 sm:space-y-3">
                <Progress
                  value={(stage + 1) * 16.67}
                  className="w-full max-w-xs h-2 sm:h-3 bg-slate-700/50 mx-auto"
                />
                <p className="text-xs sm:text-sm text-slate-400">
                  {Math.round((stage + 1) * 16.67)}% Complete • Discovering with
                  AI precision
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                Searching across multiple trusted job sources
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
DiscoveryAgentLoadingOverlay.displayName = "DiscoveryAgentLoadingOverlay";

const MultiSelectDropdown = memo(
  ({
    options,
    selectedValues,
    onSelectionChange,
    placeholder,
    className = "",
    maxDisplayTags = 2,
  }: {
    options: { value: string; label: string }[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    placeholder: string;
    className?: string;
    maxDisplayTags?: number;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(
      (value: string) => {
        onSelectionChange(
          selectedValues.includes(value)
            ? selectedValues.filter((item) => item !== value)
            : [...selectedValues, value]
        );
      },
      [selectedValues, onSelectionChange]
    );

    const removeItem = useCallback(
      (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectionChange(
          selectedValues.filter((item) => item !== valueToRemove)
        );
      },
      [selectedValues, onSelectionChange]
    );

    const getSelectedLabels = useCallback(() => {
      return selectedValues
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean);
    }, [selectedValues, options]);

    return (
      <div className={`custom-multi-select ${className}`}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <motion.div
              className="flex min-h-10 sm:min-h-11 w-full items-center justify-between border-2 border-dashed rounded-xl border-slate-600 hover:border-orange-400/60 hover:bg-orange-500/5 bg-slate-800/50 px-3 py-2 text-sm cursor-pointer transition-all duration-300"
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-wrap gap-1 flex-1 items-center min-w-0">
                {selectedValues.length === 0 ? (
                  <span className="text-slate-400 text-sm">{placeholder}</span>
                ) : selectedValues.length <= maxDisplayTags ? (
                  getSelectedLabels().map((label, index) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {label}
                      </span>
                      <X
                        size={12}
                        className="ml-1 cursor-pointer opacity-70 hover:opacity-100 flex-shrink-0"
                        onClick={(e) => removeItem(selectedValues[index], e)}
                      />
                    </motion.span>
                  ))
                ) : (
                  <span className="text-orange-400 font-medium text-sm">
                    {selectedValues.length} selected
                  </span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
            </motion.div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 z-50" align="start">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={() => handleToggle(option.value)}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-sm truncate">{option.label}</span>
                </motion.div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
MultiSelectDropdown.displayName = "MultiSelectDropdown";

const JobDiscoveryAgent: React.FC = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [formValidation, setFormValidation] = useState({ jobTitle: true });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshUsage } = useUsageTracking();

  const userName = useMemo(
    () =>
      user
        ? user.user_metadata?.full_name?.split(" ")[0] ||
          user.email?.split("@")[0] ||
          "there"
        : "there",
    [user]
  );

  const jobTypeOptions = useMemo(
    () => [
      { value: "Full-time", label: "Full-time" },
      { value: "Part-time", label: "Part-time" },
      { value: "Contract", label: "Contract" },
      { value: "Internship", label: "Internship" },
    ],
    []
  );

  const experienceLevelOptions = useMemo(
    () => [
      { value: "Internship", label: "Internship" },
      { value: "Entry level", label: "Entry level" },
      { value: "Associate", label: "Associate" },
      { value: "Mid-Senior level", label: "Mid-Senior level" },
      { value: "Director", label: "Director" },
    ],
    []
  );

  const simulateLoadingStages = useCallback(() => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2000);
    });
  }, []);

  const getCurrentUserVersion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("version")
        .eq("user_id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.version || 0;
    } catch (error) {
      console.error("Error getting user version:", error);
      return 0;
    }
  };

  const loadAgentExample = useCallback(() => {
    setJobTitle("Senior Software Engineer");
    setJobTypes(["Full-time"]);
    setExperienceLevel(["Mid-Senior level"]);
    toast({ title: "Example Loaded! 🚀" });
  }, [toast]);

  const handleResetAgent = useCallback(() => {
    setJobTitle("");
    setSelectedLocations([]);
    setJobTypes([]);
    setExperienceLevel([]);
    setFormValidation({ jobTitle: true });
    toast({ title: "Agent Reset ✨" });
  }, [toast]);

  const validateForm = useCallback(() => {
    const isValid = jobTitle.trim().length > 0;
    setFormValidation({ jobTitle: isValid });
    return isValid;
  }, [jobTitle]);

  // --------------------------------------------------------------------------------------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({ title: "Job Title Required 📝", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "Authentication Required 🔐", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setIsDiscovering(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      // Step 1: Query your database first to check for instant matches
      const formatArray = (arr: string[]) =>
        arr.length > 0 ? `{${arr.join(",")}}` : null;

      const rpcParams = {
        p_job_title: jobTitle.trim(),
        p_locations: formatArray(selectedLocations.map((loc) => loc.name)),
        p_experience_levels: formatArray(experienceLevel),
        p_job_types: formatArray(jobTypes),
      };

      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_jobs_prioritized",
        rpcParams
      );

      if (rpcError) throw new Error(rpcError.message);

      const searchParams = {
        jobTitle: jobTitle.trim(),
        locations: selectedLocations.map((loc) => loc.name),
        jobTypes,
        experienceLevel,
      };

      // --- PATH 1: Instant results found in the database ---
      if (rpcData && rpcData.length > 0) {
        // Increment usage ONLY when providing immediate results
        const currentVersion = await getCurrentUserVersion(user.id);
        const { error: usageError } = await supabase.rpc(
          "increment_usage_secure",
          {
            p_target_user_id: user.id,
            p_usage_type: "job_searches_used",
            p_increment_amount: 1,
            p_current_version: currentVersion,
            p_audit_metadata: {
              action: "job_discovery_instant_results",
              job_title: jobTitle,
              locations: selectedLocations.map((loc) => loc.name),
              job_types: jobTypes,
              experience_level: experienceLevel,
            },
          }
        );

        if (usageError) {
          if (usageError.message.includes("Usage limit exceeded")) {
            toast({
              title: "Agent Limit Reached",
              description: "Upgrade to activate unlimited job discovery!",
              variant: "destructive",
              action: (
                <Button size="sm" onClick={() => navigate("/pricing")}>
                  <Crown className="w-4 h-4 mr-1" />
                  Upgrade Plan
                </Button>
              ),
            });
            setIsDiscovering(false); // Stop loading on limit reached
            return;
          }
          throw new Error(usageError.message);
        }

        // Process and navigate to results page
        refreshUsage();
        sessionStorage.setItem("jobSearchResults", JSON.stringify(rpcData));
        sessionStorage.setItem("jobSearchParams", JSON.stringify(searchParams));
        navigate("/job-results");
      }
      // --- PATH 2: No instant results, activate deep discovery agent ---
      else {
        toast({
          title: "Expanding Search Radius... 📡",
          description:
            "No instant matches found. Activating deep discovery agent!",
        });

        const fallbackPayload = {
          feature: "job_discovery_agent_fallback",
          ...searchParams,
        };

        // Invoke the proxy function (which now returns immediately)
        const { error: functionError } = await supabase.functions.invoke(
          "job-finder-proxy",
          { body: fallbackPayload }
        );

        if (functionError) {
          throw new Error(`Failed to activate agent: ${functionError.message}`);
        }

        // Hide the full-screen loading overlay
        setIsDiscovering(false);

        // Show a persistent toast with the new message and redirect plan
        toast({
          duration: 10000, // Show for 10 seconds
          title: "Your Deep Job Discovery Agent is Activated! 🤖",
          description:
            "It can take 2-3 mins. We will notify you via email when your discovery is complete. You will be redirected to the dashboard shortly.",
        });

        // Save preferences for future reference
        const userPlan = user.user_metadata?.plan || "free";
        await supabase.from("user_job_preferences").insert({
          user_id: user.id,
          job_title: jobTitle.trim(),
          locations: selectedLocations.map((loc) => loc.name),
          job_types: jobTypes,
          experience_levels: experienceLevel,
          subscription_plan: userPlan,
        });

        // Redirect the user to the dashboard after 10 seconds
        setTimeout(() => {
          navigate("/dashboard"); // Change '/dashboard' to your actual dashboard route
        }, 10000);
      }
    } catch (error) {
      console.error("Agent discovery error:", error);
      toast({
        title: "Agent Error",
        description:
          "Your Job Discovery Agent encountered an issue. Please try again.",
        variant: "destructive",
      });
      setIsDiscovering(false); // Ensure loading stops on error
    } finally {
      // The loading state is now managed within the try/catch block,
      // but this can stay as a final fallback to ensure it always closes.
      if (isDiscovering) {
        setIsDiscovering(false);
        setLoadingStage(0);
      }
    }
  };

  // -----------------------------------------------------------------------------

  return (
    <TooltipProvider>
      <Helmet>
        <title>AI Job Finder | Discover Your Next Career Opportunity</title>
        <meta
          name="description"
          content="Find job opportunities tailored to your skills and experience. Our AI-powered job finder helps you discover relevant roles and streamline your job search."
        />
        <link rel="canonical" href="https://applyforge.ai/job-finder" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <DiscoveryAgentLoadingOverlay
          show={isDiscovering}
          stage={loadingStage}
        />

        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Hero Section - AI Agent Focused */}
            <div className="text-center space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-4 sm:gap-6"
              >
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-yellow-500/20 rounded-full flex items-center justify-center border border-orange-500/20 backdrop-blur-xl"
                  >
                    <Radar className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Discovery
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Job Discovery{" "}
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      Agent
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      Hey{" "}
                      <span className="text-orange-400 font-semibold">
                        {userName}
                      </span>
                      <br />
                      Your intelligent job discovery agent is ready to find your
                      next opportunity
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Get AI-powered job discovery, smart filtering, and
                      personalized opportunity matching
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Radar,
                    title: "Smart Discovery",
                    desc: "AI-powered opportunity detection",
                  },
                  {
                    icon: Globe,
                    title: "Global Search",
                    desc: "Access to 1000+ companies",
                  },
                  {
                    icon: Target,
                    title: "Precision Matching",
                    desc: "Skills-based job alignment",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Verified Listings",
                    desc: "Trusted job opportunities",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Agent Interface */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3 text-white">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex-shrink-0" />
                        <span className="truncate">Configure Your Agent</span>
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-2 text-sm sm:text-base">
                        Set your job discovery preferences for intelligent
                        opportunity matching
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadAgentExample}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm"
                          >
                            <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Try Example</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Load sample data to test your Job Discovery Agent
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetAgent}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">Reset Agent</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
                    {/* Job Title */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <div>
                        <Label
                          htmlFor="jobTitle"
                          className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white"
                        >
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                          <span className="truncate">Job Title *</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Enter the job title or role you're looking for
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="jobTitle"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g., Software Engineer, Product Manager"
                          required
                          className={`mt-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-400 h-10 sm:h-11 text-sm sm:text-base ${
                            !formValidation.jobTitle ? "border-destructive" : ""
                          }`}
                        />
                        {!formValidation.jobTitle && (
                          <p className="text-destructive text-sm mt-1">
                            Job title is required
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">Locations</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Enter cities, states, or "Remote" for
                              location-based filtering
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="mt-1">
                        {/* **COMPONENT REPLACED HERE** */}
                        <RadarLocationInput
                          onLocationsChange={setSelectedLocations}
                          placeholder="Kindly enter the city to discover"
                          maxSelections={1}
                        />
                      </div>
                    </div>

                    {/* Job Types and Experience Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <span className="truncate">Job Type</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Select employment types you're interested in
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <MultiSelectDropdown
                          options={jobTypeOptions}
                          selectedValues={jobTypes}
                          onSelectionChange={setJobTypes}
                          placeholder="Select job types"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">Experience Level</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Filter by career level requirements</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <MultiSelectDropdown
                          options={experienceLevelOptions}
                          selectedValues={experienceLevel}
                          onSelectionChange={setExperienceLevel}
                          placeholder="Select experience levels"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Discovery Summary */}
                    <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-xl p-4 sm:p-6 border border-slate-700/30">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        Discovery Summary:
                      </h4>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p>
                          {" "}
                          <span className="text-orange-400">
                            Searching for:
                          </span>{" "}
                          <span className="text-white font-medium">
                            {jobTitle || "Not specified"}
                          </span>
                        </p>
                        {selectedLocations.length > 0 && (
                          <p>
                            {" "}
                            <span className="text-orange-400">
                              Locations:
                            </span>{" "}
                            <span className="text-white font-medium">
                              {selectedLocations.map((l) => l.name).join(", ")}
                            </span>
                          </p>
                        )}
                        {(jobTypes.length > 0 ||
                          experienceLevel.length > 0) && (
                          <p>
                            {" "}
                            <span className="text-orange-400">
                              Filters:
                            </span>{" "}
                            <span className="text-white font-medium">
                              {[...jobTypes, ...experienceLevel].length} active
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Activate Agent Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-2 sm:pt-4"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg"
                        disabled={isDiscovering}
                      >
                        {isDiscovering ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2 sm:mr-3 flex-shrink-0"
                            >
                              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.div>
                            <span className="truncate">
                              Agent Discovering Jobs...
                            </span>
                          </>
                        ) : (
                          <>
                            <Radar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                            <span className="truncate">Start Discovery</span>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Agent Features */}
                    <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-xl p-4 sm:p-6 border border-slate-700/30">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                          <span className="truncate">Secure Search</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">~15 sec discovery</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                          <span className="truncate">AI-Powered Matching</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobDiscoveryAgent;
