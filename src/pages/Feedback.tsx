import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Heart,
  Sparkles,
  Info,
  Save,
  RefreshCw,
  Shield,
  Clock,
  Award,
  Users,
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  Zap,
  Bot,
  Brain,
  TrendingUp,
  Activity,
  Target,
  Home,
  ChevronRight,
  Crown,
  Settings,
  Compass,
  Database,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

// **ENHANCED AI INSIGHTS COLLECTOR LOADING OVERLAY - AMBER/ORANGE THEME**
const InsightsCollectorLoadingOverlay = ({
  show,
  stage = 0,
}: {
  show: boolean;
  stage?: number;
}) => {
  const agentMessages = [
    "🤖 Activating AI Insights Collector Agent...",
    "🧠 Processing your valuable feedback...",
    "📊 Analyzing insights for improvements...",
    "💾 Storing feedback in AI learning database...",
    "🔄 Updating agent improvement algorithms...",
    "✨ Finalizing insights collection process...",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/90"
        >
          {/* Agent Avatar with Learning Animation */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center backdrop-blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400" />

              {/* Learning particles */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-400/30"
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

          {/* Agent Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4 max-w-md"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              AI Insights Collector Agent
            </h3>
            <p className="text-base sm:text-lg text-amber-400 font-medium">
              {agentMessages[stage] || agentMessages[0]}
            </p>

            <div className="space-y-3">
              <Progress
                value={(stage + 1) * 16.67}
                className="w-80 max-w-full h-3 bg-slate-700/50"
              />
              <p className="text-sm text-slate-400">
                {Math.round((stage + 1) * 16.67)}% Complete • Learning from your
                insights
              </p>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Your insights are being processed securely</span>
          </motion.div>

          {/* Floating learning particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
                animate={{
                  x: [0, 100, -100, 0],
                  y: [0, -100, 100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + i * 8}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// **ENHANCED AI STAR RATING COMPONENT**
const AIStarRating = memo(
  ({
    rating,
    onRatingChange,
    size = "default",
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: string;
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const starSize = size === "large" ? "w-8 h-8" : "w-6 h-6";
    const containerPadding = size === "large" ? "p-2" : "p-1";

    const getRatingColor = (star: number) => {
      const activeRating = hoverRating || rating;
      if (star <= activeRating) {
        if (activeRating <= 2) return "text-red-400";
        if (activeRating <= 3) return "text-orange-400";
        if (activeRating <= 4) return "text-yellow-400";
        return "text-amber-400";
      }
      return "text-slate-600";
    };

    const getRatingText = () => {
      const activeRating = hoverRating || rating;
      const texts = [
        "",
        "Needs Improvement",
        "Fair Experience",
        "Good Service",
        "Very Good",
        "Excellent AI!",
      ];
      return texts[activeRating] || "";
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`${containerPadding} hover:scale-110 transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${getRatingColor(
                star
              )}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className={`${starSize} fill-current`} />
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {(hoverRating || rating) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-sm font-medium text-white">
                {hoverRating || rating} star
                {(hoverRating || rating) !== 1 ? "s" : ""}
              </span>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                {getRatingText()}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

const AIInsightsCollectorAgent: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [formValidation, setFormValidation] = useState({
    rating: true,
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  const simulateLoadingStages = useCallback(() => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 1000);
    });
  }, []);

  const loadSampleFeedback = useCallback(() => {
    setRating(5);
    setSuggestion(
      "I'd love to see more AI-powered features for resume optimization and perhaps integration with LinkedIn for automatic profile updates. The agents are amazing!"
    );
    setComment(
      "Your AI agents have been incredibly helpful in my job search! The AI Resume Arsenal and Application Automation Agent saved me hours of work. The interface is intuitive and the results are professional. Keep up the great work with the AI agents!"
    );

    toast({
      title: "Agent Example Loaded! 🤖",
      description: "Form filled with example insights for your agent.",
    });
  }, [toast]);

  const handleClearForm = useCallback(() => {
    setRating(0);
    setSuggestion("");
    setComment("");
    setFormValidation({ rating: true });
    localStorage.removeItem("feedbackDraft");

    toast({
      title: "Agent Reset ✨",
      description: "All fields have been reset for new insights collection.",
    });
  }, [toast]);

  const validateForm = () => {
    const newValidation = {
      rating: rating > 0,
    };

    setFormValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };

  const calculateProgress = () => {
    const fields = [rating > 0, suggestion.trim(), comment.trim()];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setFormValidation((prev) => ({ ...prev, rating: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required 🔐",
        description: "Please log in to provide insights to your AI agents.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Agent Validation Error",
        description: "Please select a rating before submitting your insights.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      // Get user profile data (optional, for enrichment)
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      // --- REPLACEMENT ---
      // Securely call the new feedback-proxy Edge Function
      const { data: result, error } = await supabase.functions.invoke(
        "feedback-proxy",
        {
          body: {
            // user_id is now handled securely by the backend
            feature: "ai_insights_collector_agent",
            userName: profile?.full_name || userName,
            userEmail: profile?.email || user.email,
            rating: rating,
            suggestion: suggestion,
            comment: comment,
            timestamp: new Date().toISOString(),
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }
      // --- END REPLACEMENT ---

      // Clear draft
      localStorage.removeItem("feedbackDraft");

      // Show result in modal
      setResultMessage(
        result.message ||
          "Thank you for helping our AI agents learn and improve!"
      );
      setShowResultModal(true);

      // Reset form
      setRating(0);
      setSuggestion("");
      setComment("");

      toast({
        title: "🎉 Agent Learning Success!",
        description:
          "Your insights have been collected and will improve our AI agents.",
      });

      // Auto-close modal and redirect after 10 seconds
      setTimeout(() => {
        setShowResultModal(false);
        navigate("/dashboard");
      }, 10000);
    } catch (error) {
      console.error("Error submitting insights:", error);
      toast({
        title: "Agent Error",
        description: "Failed to submit insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoadingStage(0);
    }
  };

  if (!user) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/20"
                >
                  <Brain className="w-8 h-8 text-amber-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to share insights with your AI Insights
                  Collector Agent.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  Login to Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <InsightsCollectorLoadingOverlay
          show={isSubmitting}
          stage={loadingStage}
        />

        {/* Header */}
        <DashboardHeader />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Hero Section - AI Agent Focused */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/20 backdrop-blur-xl"
                  >
                    <Brain className="w-10 h-10 text-amber-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Learning
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    AI Insights Collector{" "}
                    <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      Agent
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      Hey{" "}
                      <span className="text-amber-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent agent is ready to collect insights and
                      improve our AI system
                    </p>
                    <p className="text-base text-slate-400 max-w-2xl mx-auto">
                      Share your experience to help our AI agents learn, adapt,
                      and serve you better
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-3 mb-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleFeedback}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Example
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Load sample insights to see how your agent works
                </TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearForm}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Agent
              </Button>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-6"
            >
              <div className="text-center mb-2">
                <span className="text-sm text-slate-400">
                  Agent Collection Progress: {calculateProgress()}%
                </span>
              </div>
              <Progress
                value={calculateProgress()}
                className="w-full h-3 bg-slate-700/50"
              />
            </motion.div>

            {/* Enhanced Feedback Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                    Share Your AI Experience
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your insights help our AI agents learn and provide better
                    assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Enhanced Rating Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label className="text-sm sm:text-base flex items-center gap-2">
                        AI Agent Rating *
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Rate your overall experience with our AI agents
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>

                      <div className="mt-3">
                        <AIStarRating
                          rating={rating}
                          onRatingChange={handleRatingClick}
                          size="large"
                        />
                      </div>

                      {!formValidation.rating && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-destructive mt-2 flex items-center gap-1"
                        >
                          <Star className="w-4 h-4" />
                          Please select a rating for our AI agents
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Enhanced Suggestions */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="suggestion"
                        className="text-sm sm:text-base flex items-center gap-2"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        AI Improvement Suggestions
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Textarea
                          id="suggestion"
                          value={suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                          placeholder="What AI features or improvements would you like to see? Any specific agent capabilities that would help your job search?"
                          className="mt-1 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 resize-none focus:border-amber-400"
                          maxLength={500}
                        />
                      </motion.div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Share your ideas for AI agent improvements</span>
                        <span>{suggestion.length}/500</span>
                      </div>
                    </motion.div>

                    {/* Enhanced Comments */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="comment"
                        className="text-sm sm:text-base flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-400" />
                        AI Agent Experience
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us about your experience with our AI agents. Which agents did you find most helpful? What challenges did you face? How did our AI tools help your job search?"
                          className="mt-1 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 resize-none focus:border-amber-400"
                          maxLength={1000}
                        />
                      </motion.div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Share your detailed AI agent experience</span>
                        <span>{comment.length}/1000</span>
                      </div>
                    </motion.div>

                    {/* Enhanced Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-h-[44px] text-sm sm:text-base shadow-lg text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2"
                            >
                              <Brain className="w-4 h-4" />
                            </motion.div>
                            Agent Learning from Insights...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Share Insights
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-slate-800/30 rounded-lg p-4 mt-4"
                    >
                      <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>AI Learning</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span>Quick Process</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span>Real Impact</span>
                        </div>
                      </div>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Result Modal */}
        <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/20"
              >
                <CheckCircle className="w-8 h-8 text-amber-400" />
              </motion.div>
              <DialogTitle className="text-center text-amber-400 text-base sm:text-lg">
                AI Agent Learning Complete! 🤖
              </DialogTitle>
              <DialogDescription className="text-center pt-4 text-slate-300">
                {resultMessage}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-4 mt-4"
            >
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                <p className="text-sm text-amber-300">
                  Your insights help our AI agents learn, adapt, and provide
                  better assistance to job seekers like you.
                </p>
              </div>

              <div className="text-xs sm:text-sm text-slate-400">
                <Clock className="w-4 h-4 inline mr-1" />
                Returning to dashboard in 10 seconds...
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AIInsightsCollectorAgent;
