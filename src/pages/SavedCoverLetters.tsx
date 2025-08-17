import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Download,
  Trash2,
  ArrowLeft,
  Building,
  Calendar,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  Share2,
  MoreVertical,
  Clock,
  Target,
  Award,
  Shield,
  Zap,
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Mail,
  Bot,
  Brain,
  PenTool,
  TrendingUp,
  Activity,
  Star,
  Home,
  ChevronRight,
  Crown,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

interface CoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
  original_resume_name: string | null;
  file_type: string;
}

// **MOBILE-ENHANCED LOADING SKELETON - PURPLE THEME**
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg"
      >
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg border border-purple-500/30"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-3 sm:h-4 w-3/4 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-2 sm:h-3 w-1/2 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <motion.div
              className="w-12 h-5 sm:w-16 sm:h-6 bg-slate-700/50 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </div>
          <motion.div
            className="h-12 sm:h-16 w-full bg-slate-700/50 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-8 sm:h-9 flex-1 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="h-8 sm:h-9 w-8 sm:w-9 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// **MOBILE-ENHANCED COVER LETTER CARD COMPONENT**
const AICoverLetterCard = memo(
  ({
    letter,
    index,
    onDownload,
    onDelete,
    onShare,
    deletingIds,
  }: {
    letter: CoverLetter;
    index: number;
    onDownload: (url: string, fileName: string) => void;
    onDelete: (id: string, fileName: string) => void;
    onShare: (letter: CoverLetter) => void;
    deletingIds: Set<string>;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    const getCompanyInitials = useCallback((companyName: string) => {
      return companyName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center font-semibold text-purple-400 border border-purple-500/30 flex-shrink-0 text-xs sm:text-sm"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getCompanyInitials(letter.company_name)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold truncate text-white group-hover:text-purple-400 transition-colors">
                    {letter.position_title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {letter.company_name}
                    </span>
                  </div>
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-purple-400 h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Calendar className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {formatDate(letter.created_at)}
                </span>
              </Badge>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Bot className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                AI Crafted
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4 flex-1 flex flex-col">
            {/* Original Resume Info */}
            {letter.original_resume_name && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                  Source Resume
                </h4>
                <div className="p-2 sm:p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <p className="text-xs sm:text-sm text-slate-300 truncate">
                    {letter.original_resume_name}
                  </p>
                </div>
              </div>
            )}

            {/* AI Enhancement Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                Personalized
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                AI Enhanced
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                Job Matched
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 mt-auto">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() =>
                    onDownload(
                      letter.cover_letter_url,
                      `${letter.company_name}_${letter.position_title}_cover_letter.pdf`
                    )
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                  size="sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Download</span>
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-8 sm:h-9"
                    onClick={() => onShare(letter)}
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share cover letter</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() =>
                      onDelete(
                        letter.id,
                        `${letter.company_name}_${letter.position_title}`
                      )
                    }
                    disabled={deletingIds.has(letter.id)}
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-slate-600 h-8 sm:h-9"
                  >
                    {deletingIds.has(letter.id) ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete cover letter</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AICoverLetterCard.displayName = "AICoverLetterCard";

// **MOBILE-ENHANCED AGENT STATS COMPONENT**
const AgentLibraryStats = memo(
  ({ coverLetterCount }: { coverLetterCount: number }) => {
    const stats = useMemo(
      () => ({
        total: coverLetterCount,
        aiCrafted: coverLetterCount, // All are AI crafted
        avgPersonalization: coverLetterCount > 0 ? 95 : 0,
        successRate: coverLetterCount > 0 ? 97 : 0,
      }),
      [coverLetterCount]
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.total}
            </div>
            <div className="text-xs text-slate-400">AI Letters</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.aiCrafted}
            </div>
            <div className="text-xs text-slate-400">Agent Crafted</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.avgPersonalization}%
            </div>
            <div className="text-xs text-slate-400">Personalization</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
          <CardContent className="p-3 sm:p-4 md:p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white">
              {stats.successRate}%
            </div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AgentLibraryStats.displayName = "AgentLibraryStats";

const AICoverLetterLibrary: React.FC = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "position">("date");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  useEffect(() => {
    if (user) {
      fetchCoverLetters();
    }
  }, [user]);

  const fetchCoverLetters = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      toast({
        title: "Agent Error",
        description: "Failed to load your AI cover letter library.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const handleDownload = useCallback(
    (url: string, fileName: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Agent Success! 📥",
        description: "Your AI-crafted cover letter is downloading now.",
        action: (
          <Button size="sm" onClick={() => navigate("/cover-letter-generator")}>
            <PenTool className="w-4 h-4 mr-1" />
            Craft Another
          </Button>
        ),
      });
    },
    [toast, navigate]
  );

  const handleShare = useCallback(
    (letter: CoverLetter) => {
      if (navigator.share) {
        navigator.share({
          title: `AI Cover Letter - ${letter.position_title}`,
          text: `AI-crafted cover letter for ${letter.position_title} at ${letter.company_name}`,
          url: letter.cover_letter_url,
        });
      } else {
        navigator.clipboard.writeText(letter.cover_letter_url);
        toast({
          title: "Link Copied ✅",
          description: "Cover letter link copied to clipboard.",
        });
      }
    },
    [toast]
  );

  const handleDelete = useCallback(
    async (id: string, fileName: string) => {
      if (!user) return;

      setDeletingIds((prev) => new Set(prev).add(id));

      try {
        const { error } = await supabase
          .from("cover_letters")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        setCoverLetters((prev) => prev.filter((letter) => letter.id !== id));
        toast({
          title: "Cover Letter Deleted ✅",
          description: `AI cover letter "${fileName}" has been removed from your library.`,
        });
      } catch (error) {
        console.error("Error deleting cover letter:", error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete cover letter. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    },
    [user, toast]
  );

  const filteredCoverLetters = useMemo(
    () =>
      coverLetters.filter(
        (letter) =>
          letter.position_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          letter.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [coverLetters, searchTerm]
  );

  const sortedCoverLetters = useMemo(
    () =>
      [...filteredCoverLetters].sort((a, b) => {
        switch (sortBy) {
          case "company":
            return a.company_name.localeCompare(b.company_name);
          case "position":
            return a.position_title.localeCompare(b.position_title);
          case "date":
          default:
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
        }
      }),
    [filteredCoverLetters, sortBy]
  );

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
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/20"
                >
                  <Mail className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to access your AI Cover Letter Library.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
        {/* Header */}
        <DashboardHeader />

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Back to Dashboard Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm text-sm sm:text-base h-9 sm:h-10"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </motion.div>

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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-pink-600/20 rounded-full flex items-center justify-center border border-purple-500/20 backdrop-blur-xl"
                  >
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Library
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Cover Letter{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">
                      Library
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
                      <span className="text-purple-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your collection of AI-crafted cover letters ready for
                      deployment
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      View, download, and manage all your personalized cover
                      letters created by AI agents
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Library Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: PenTool,
                    title: "AI Crafted",
                    desc: "Every letter written by AI",
                  },
                  {
                    icon: Target,
                    title: "Personalized",
                    desc: "Tailored to each job",
                  },
                  {
                    icon: Shield,
                    title: "Secure Storage",
                    desc: "Your letters stay private",
                  },
                  {
                    icon: Zap,
                    title: "Instant Access",
                    desc: "Download anytime",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Stats Overview */}
            <AgentLibraryStats coverLetterCount={coverLetters.length} />

            {/* Search and Filter Controls */}
            {coverLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Search your AI cover letter library..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortBy(
                        sortBy === "date"
                          ? "company"
                          : sortBy === "company"
                          ? "position"
                          : "date"
                      )
                    }
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm h-10 sm:h-11"
                  >
                    <Filter className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Sort by </span>
                    <span className="truncate">
                      {sortBy === "date"
                        ? "Date"
                        : sortBy === "company"
                        ? "Company"
                        : "Position"}
                    </span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchCoverLetters}
                        className="px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-10 sm:h-11"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh library</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton />
              ) : sortedCoverLetters.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 sm:py-16"
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                    <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-purple-500/20"
                      >
                        <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {searchTerm
                          ? "No Matching AI Letters"
                          : "Your Library Awaits"}
                      </h3>

                      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {searchTerm
                          ? `No AI cover letters found matching "${searchTerm}". Try a different search term.`
                          : "You haven't created any AI cover letters yet. Let your Cover Letter Crafting Agent create your first masterpiece!"}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {searchTerm ? (
                          <Button
                            variant="outline"
                            onClick={() => setSearchTerm("")}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            Clear Search
                          </Button>
                        ) : (
                          <Button
                            onClick={() => navigate("/cover-letter-generator")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            <PenTool className="w-4 h-4 mr-2" />
                            Create Your First AI Letter
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {sortedCoverLetters.map((letter, index) => (
                    <AICoverLetterCard
                      key={letter.id}
                      letter={letter}
                      index={index}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      onShare={handleShare}
                      deletingIds={deletingIds}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create New Cover Letter CTA */}
            {sortedCoverLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-purple-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      Ready to expand your library?
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm sm:text-base">
                      Let your AI agents craft more personalized cover letters
                      for different opportunities
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/cover-letter-generator")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        Cover Letter Crafting Agent
                      </Button>
                      <Button
                        onClick={() => navigate("/one-click-tailoring")}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Instant Tailoring Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AICoverLetterLibrary;
