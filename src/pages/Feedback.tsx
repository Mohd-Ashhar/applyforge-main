import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Enhanced Loading Overlay for Feedback Submission
const FeedbackLoadingOverlay = ({ show, stage = 0 }) => {
  const stages = [
    "Processing your feedback...",
    "Analyzing your suggestions...",
    "Saving your valuable insights...",
    "Updating our improvement queue...",
    "Finalizing submission...",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/80"
        >
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              {stages[stage] || stages[0]}
            </p>
            <Progress value={(stage + 1) * 20} className="w-64 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((stage + 1) * 20)}% Complete
            </p>
          </motion.div>

          <motion.div
            className="flex gap-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Heart className="w-4 h-4" />
            <span>Your feedback helps us improve</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Star Rating Component
const StarRating = ({ rating, onRatingChange, size = "default" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = size === "large" ? "w-8 h-8" : "w-6 h-6";
  const containerPadding = size === "large" ? "p-2" : "p-1";

  const getRatingColor = (star) => {
    const activeRating = hoverRating || rating;
    if (star <= activeRating) {
      if (activeRating <= 2) return "text-red-500";
      if (activeRating <= 3) return "text-orange-500";
      if (activeRating <= 4) return "text-yellow-500";
      return "text-green-500";
    }
    return "text-gray-300";
  };

  const getRatingText = () => {
    const activeRating = hoverRating || rating;
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[activeRating] || "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
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
            className="flex items-center gap-2"
          >
            <span className="text-sm font-medium">
              {hoverRating || rating} star
              {(hoverRating || rating) !== 1 ? "s" : ""}
            </span>
            <Badge variant="outline" className="text-xs">
              {getRatingText()}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [formValidation, setFormValidation] = useState({
    rating: true,
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-save draft functionality
  useEffect(() => {
    if (saveAsDraft) {
      const draftData = { rating, suggestion, comment };
      localStorage.setItem("feedbackDraft", JSON.stringify(draftData));
    }
  }, [rating, suggestion, comment, saveAsDraft]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("feedbackDraft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        if (draftData.rating || draftData.suggestion || draftData.comment) {
          toast({
            title: "Draft Found",
            description:
              "We found a saved draft. Click 'Load Draft' to restore it.",
            action: (
              <Button
                size="sm"
                onClick={() => {
                  setRating(draftData.rating || 0);
                  setSuggestion(draftData.suggestion || "");
                  setComment(draftData.comment || "");
                }}
              >
                Load Draft
              </Button>
            ),
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [toast]);

  // Simulate loading stages
  const simulateLoadingStages = () => {
    const stages = [0, 1, 2, 3, 4];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 1000);
    });
  };

  // Load sample feedback
  const loadSampleFeedback = () => {
    setRating(5);
    setSuggestion(
      "I'd love to see more AI-powered features for resume optimization and perhaps integration with LinkedIn for automatic profile updates."
    );
    setComment(
      "ApplyForge has been incredibly helpful in my job search! The AI resume tailor feature saved me hours of work. The interface is intuitive and the results are professional. Keep up the great work!"
    );

    toast({
      title: "Sample Feedback Loaded",
      description: "Form filled with example feedback data.",
    });
  };

  // Clear form
  const handleClearForm = () => {
    setRating(0);
    setSuggestion("");
    setComment("");
    setFormValidation({ rating: true });
    localStorage.removeItem("feedbackDraft");

    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  // Enhanced validation
  const validateForm = () => {
    const newValidation = {
      rating: rating > 0,
    };

    setFormValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };

  // Calculate completion progress
  const calculateProgress = () => {
    const fields = [rating > 0, suggestion.trim(), comment.trim()];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
    setFormValidation((prev) => ({ ...prev, rating: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      // Get user profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      // Send feedback to webhook
      const response = await fetch(
        "https://n8n.applyforge.cloud/webhook-test/feedback-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: profile?.full_name || "Anonymous",
            userEmail: profile?.email || user.email,
            rating: rating,
            suggestion: suggestion,
            comment: comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const result = await response.text();

      // Clear draft
      localStorage.removeItem("feedbackDraft");

      // Show result in modal
      setResultMessage(result || "Thank you for your feedback!");
      setShowResultModal(true);

      // Reset form
      setRating(0);
      setSuggestion("");
      setComment("");

      toast({
        title: "Feedback Submitted! 🎉",
        description: "Thank you for helping us improve ApplyForge.",
      });

      // Auto-close modal and redirect after 10 seconds
      setTimeout(() => {
        setShowResultModal(false);
        navigate("/");
      }, 10000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
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
        <div className="min-h-screen bg-background mobile-container">
          <div className="py-8 sm:py-12 md:py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md mx-auto"
            >
              <Card className="mobile-card">
                <CardContent className="pt-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <MessageSquare className="w-8 h-8 text-purple-500" />
                  </motion.div>
                  <p className="text-muted-foreground mb-4 mobile-text">
                    Please log in to submit feedback.
                  </p>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Login to Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background scroll-container">
        <FeedbackLoadingOverlay show={isSubmitting} stage={loadingStage} />

        <div className="mobile-container py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {/* Enhanced Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-4 hover:bg-primary/10 min-h-[44px] touch-manipulation mobile-transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>

            {/* Enhanced Header */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-500"
              >
                <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mobile-title font-bold mb-2 sm:mb-4"
              >
                Your <span className="gradient-text">Feedback</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-muted-foreground mobile-text"
              >
                Help us improve ApplyForge with your valuable insights
              </motion.p>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Community Driven</span>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-3 mb-6"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleFeedback}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Example
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Load sample feedback to see how it works
                </TooltipContent>
              </Tooltip>

              <Button variant="outline" size="sm" onClick={handleClearForm}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Form
              </Button>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="text-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Form Completion: {calculateProgress()}%
                </span>
              </div>
              <Progress value={calculateProgress()} className="w-full h-2" />
            </motion.div>

            {/* Enhanced Feedback Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass mobile-card">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    Share Your Experience
                  </CardTitle>
                  <CardDescription className="mobile-text">
                    Your feedback helps us make ApplyForge better for everyone
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
                        Rating *
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rate your overall experience with ApplyForge</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>

                      <div className="mt-3">
                        <StarRating
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
                          Please select a rating
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
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Suggestions
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Textarea
                          id="suggestion"
                          value={suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                          placeholder="What features or improvements would you like to see? Any specific tools or integrations that would help your job search?"
                          className="mt-1 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base mobile-text resize-none"
                          maxLength={500}
                        />
                      </motion.div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Share your ideas for improvement</span>
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
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        Comments
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us about your experience with ApplyForge. What did you like most? What challenges did you face? How did our tools help your job search?"
                          className="mt-1 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base mobile-text resize-none"
                          maxLength={1000}
                        />
                      </motion.div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Share your detailed experience</span>
                        <span>{comment.length}/1000</span>
                      </div>
                    </motion.div>

                    {/* Auto-save Option */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id="save-draft"
                        checked={saveAsDraft}
                        onChange={(e) => setSaveAsDraft(e.target.checked)}
                        className="rounded"
                      />
                      <label
                        htmlFor="save-draft"
                        className="text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Auto-save as draft while typing
                      </label>
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
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-[44px] touch-manipulation text-sm sm:text-base shadow-lg"
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
                              <Heart className="w-4 h-4" />
                            </motion.div>
                            Submitting Feedback...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Feedback
                            <ThumbsUp className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-muted/30 rounded-lg p-4 mt-4"
                    >
                      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span>Anonymous Option</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>Quick Submit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-500" />
                          <span>Real Impact</span>
                        </div>
                      </div>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Result Modal */}
        <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
          <DialogContent className="sm:max-w-md mobile-card">
            <DialogHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <DialogTitle className="text-center text-green-600 text-base sm:text-lg">
                Feedback Submitted Successfully! 🎉
              </DialogTitle>
              <DialogDescription className="text-center pt-4 mobile-text">
                {resultMessage}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-4 mt-4"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your feedback helps us prioritize improvements and build
                  features that matter most to job seekers like you.
                </p>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-1" />
                Redirecting to home page in 10 seconds...
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Feedback;
