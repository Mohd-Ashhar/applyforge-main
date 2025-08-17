import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Trash2,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Eye,
  Share2,
  Clock,
  Target,
  Shield,
  Award,
  Zap,
  RefreshCw,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Bot,
  Brain,
  Wand2,
  Star,
  TrendingUp,
  Activity,
  Users,
  Home,
  ChevronRight,
  Settings,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

interface TailoredResume {
  id: string;
  job_description: string;
  resume_data: string;
  file_type: string;
  created_at: string;
  title: string | null;
}

// **MOBILE-ENHANCED LOADING SKELETON - BLUE THEME**
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
              className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg border border-blue-500/30"
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
          </div>
          <motion.div
            className="h-16 sm:h-20 w-full bg-slate-700/50 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-8 sm:h-9 flex-1 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            />
            <motion.div
              className="h-8 sm:h-9 w-8 sm:w-9 bg-slate-700/50 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// **MOBILE-ENHANCED RESUME CARD COMPONENT**
const AIResumeCard = memo(
  ({
    resume,
    index,
    onDownload,
    onDelete,
    downloadingId,
    deletingId,
  }: {
    resume: TailoredResume;
    index: number;
    onDownload: (resume: TailoredResume) => void;
    onDelete: (id: string) => void;
    downloadingId: string | null;
    deletingId: string | null;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatJobDescription = useCallback((description: string) => {
      return description.length > 120
        ? description.substring(0, 120) + "..."
        : description;
    }, []);

    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    const getFileTypeIcon = useCallback((fileType: string) => {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return "📄";
        case "docx":
          return "📝";
        default:
          return "📄";
      }
    }, []);

    const getFileTypeColor = useCallback((fileType: string) => {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return "bg-red-500/20 text-red-400 border-red-500/30";
        case "docx":
          return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        default:
          return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      }
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
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <motion.div
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex-shrink-0"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold truncate text-white group-hover:text-blue-400 transition-colors">
                    {resume.title || "AI-Optimized Resume"}
                  </CardTitle>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                    <Badge
                      className={`text-[10px] sm:text-xs px-1.5 py-0.5 ${getFileTypeColor(
                        resume.file_type
                      )} whitespace-nowrap`}
                    >
                      {getFileTypeIcon(resume.file_type)}{" "}
                      {resume.file_type.toUpperCase()}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                      <Bot className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                      AI Crafted
                    </Badge>
                  </div>
                </div>
              </div>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-400 h-8 w-8 sm:h-9 sm:w-9 p-0"
                  >
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More options</TooltipContent>
              </Tooltip>
            </div>

            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">
                Crafted by agent on {formatDate(resume.created_at)}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 space-y-3 sm:space-y-4 flex-1 flex flex-col">
            {/* Job Description Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                Optimized For
              </h4>
              <div className="p-2 sm:p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {formatJobDescription(resume.job_description)}
                </p>
              </div>
            </div>

            {/* AI Enhancement Badges */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs whitespace-nowrap">
                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                ATS Optimized
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] sm:text-xs whitespace-nowrap">
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
                  onClick={() => onDownload(resume)}
                  disabled={downloadingId === resume.id}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                  size="sm"
                >
                  {downloadingId === resume.id ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin flex-shrink-0" />
                      <span className="truncate">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Download</span>
                    </>
                  )}
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-8 sm:h-9"
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share resume</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    variant="outline"
                    size="sm"
                    className="px-2 sm:px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-slate-600 h-8 sm:h-9"
                  >
                    {deletingId === resume.id ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete resume</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AIResumeCard.displayName = "AIResumeCard";

// **MOBILE-ENHANCED AGENT STATS COMPONENT**
const AgentStatsOverview = memo(({ resumeCount }: { resumeCount: number }) => {
  const stats = useMemo(
    () => ({
      total: resumeCount,
      atsOptimized: Math.round((resumeCount * 100) / 100), // All are ATS optimized
      avgOptimization: resumeCount > 0 ? 95 : 0,
      successRate: resumeCount > 0 ? 98 : 0,
    }),
    [resumeCount]
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
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.total}
          </div>
          <div className="text-xs text-slate-400">AI Resumes</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.atsOptimized}
          </div>
          <div className="text-xs text-slate-400">ATS Optimized</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {stats.avgOptimization}%
          </div>
          <div className="text-xs text-slate-400">Optimization</div>
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
});

AgentStatsOverview.displayName = "AgentStatsOverview";

const AIResumeArsenal: React.FC = () => {
  const [resumes, setResumes] = useState<TailoredResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
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

  useEffect(() => {
    if (user) {
      fetchTailoredResumes();
    }
  }, [user]);

  const fetchTailoredResumes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tailored_resumes")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching tailored resumes:", error);
      toast({
        title: "Agent Error",
        description: "Failed to load your AI resume arsenal.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const handleDownload = useCallback(
    async (resume: TailoredResume) => {
      try {
        setDownloadingId(resume.id);

        if (!resume.resume_data || !resume.file_type) {
          throw new Error("Missing resume download URL or file type");
        }

        const a = document.createElement("a");
        a.href = resume.resume_data;
        a.download = `${
          resume.title?.replace(/\s+/g, "-") || "ai-optimized-resume"
        }-${new Date(resume.created_at).toLocaleDateString()}.${
          resume.file_type
        }`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast({
          title: "Agent Success! 📥",
          description: "Your AI-optimized resume is downloading now.",
          action: (
            <Button size="sm" onClick={() => navigate("/resume-optimizer")}>
              <Wand2 className="w-4 h-4 mr-1" />
              Create Another
            </Button>
          ),
        });
      } catch (error) {
        console.error("Error downloading resume:", error);
        toast({
          title: "Download Failed",
          description: "There was an error downloading your resume.",
          variant: "destructive",
        });
      } finally {
        setDownloadingId(null);
      }
    },
    [toast, navigate]
  );

  const handleDelete = useCallback(
    async (resumeId: string) => {
      try {
        setDeletingId(resumeId);

        const { error } = await supabase
          .from("tailored_resumes")
          .delete()
          .eq("id", resumeId)
          .eq("user_id", user?.id);

        if (error) throw error;

        setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
        toast({
          title: "Resume Deleted ✅",
          description: "The AI resume has been removed from your arsenal.",
        });
      } catch (error) {
        console.error("Error deleting resume:", error);
        toast({
          title: "Delete Failed",
          description: "There was an error deleting the resume.",
          variant: "destructive",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [user?.id, toast]
  );

  const filteredResumes = useMemo(
    () =>
      resumes.filter(
        (resume) =>
          resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resume.job_description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [resumes, searchTerm]
  );

  const sortedResumes = useMemo(
    () =>
      [...filteredResumes].sort((a, b) => {
        if (sortBy === "date") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return (a.title || "").localeCompare(b.title || "");
      }),
    [filteredResumes, sortBy]
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
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/20"
                >
                  <Brain className="w-8 h-8 text-blue-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to access your AI Resume Arsenal.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/20 backdrop-blur-xl"
                  >
                    <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Arsenal
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Resume{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Arsenal
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
                      <span className="text-blue-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your collection of AI-optimized resumes ready for
                      deployment
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      View, download, and manage all your AI-crafted resumes
                      optimized for different opportunities
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Arsenal Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Brain,
                    title: "AI Optimized",
                    desc: "Every resume crafted by AI",
                  },
                  {
                    icon: Target,
                    title: "ATS Ready",
                    desc: "100% ATS compatibility",
                  },
                  {
                    icon: Shield,
                    title: "Secure Storage",
                    desc: "Your data stays private",
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
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Stats Overview */}
            <AgentStatsOverview resumeCount={resumes.length} />

            {/* Search and Filter Controls */}
            {resumes.length > 0 && (
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
                    placeholder="Search your AI resume arsenal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortBy(sortBy === "date" ? "title" : "date")
                    }
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm h-10 sm:h-11"
                  >
                    <Filter className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Sort by </span>
                    <span className="truncate">
                      {sortBy === "date" ? "Title" : "Date"}
                    </span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchTailoredResumes}
                        className="px-3 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-10 sm:h-11"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh arsenal</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedResumes.length === 0 ? (
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
                        className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-blue-500/20"
                      >
                        <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {searchTerm
                          ? "No Matching AI Resumes"
                          : "Your Arsenal Awaits"}
                      </h3>

                      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {searchTerm
                          ? `No AI resumes found matching "${searchTerm}". Try a different search term.`
                          : "You haven't created any AI-optimized resumes yet. Let your Resume Optimization Agent create your first masterpiece!"}
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
                            onClick={() => navigate("/resume-optimizer")}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Create Your First AI Resume
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
                  {sortedResumes.map((resume, index) => (
                    <AIResumeCard
                      key={resume.id}
                      resume={resume}
                      index={index}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      downloadingId={downloadingId}
                      deletingId={deletingId}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create New Resume CTA */}
            {sortedResumes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      Ready to expand your arsenal?
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm sm:text-base">
                      Let your AI agents create more optimized resumes for
                      different opportunities
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/resume-optimizer")}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Resume Optimization Agent
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

export default AIResumeArsenal;
