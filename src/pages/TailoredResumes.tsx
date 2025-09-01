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

// **UNCHANGED**
interface TailoredResume {
  id: string;
  job_description: string;
  resume_data: string;
  file_type: string;
  created_at: string;
  title: string | null;
}

// **UNCHANGED: SKELETON**
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-slate-800/20 backdrop-blur-xl border border-slate-700/50 rounded-2xl"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-3/4 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-3 w-1/2 bg-slate-700/50 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
          <motion.div
            className="h-20 w-full bg-slate-700/50 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-9 flex-1 bg-slate-700/50 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            />
            <motion.div
              className="h-9 w-9 bg-slate-700/50 rounded-lg"
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

// **UNCHANGED: RESUME CARD**
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
    // Unchanged helper functions
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
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <Card className="bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden h-full flex flex-col">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-14 h-14 bg-slate-900 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0"
                whileHover={{ rotate: [0, -8, 8, -4, 0] }}
              >
                <Brain className="w-7 h-7 text-blue-400" />
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight truncate">
                  {resume.title || "AI-Optimized Resume"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">
                    {formatDate(resume.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                className={`text-xs ${getFileTypeColor(resume.file_type)}`}
              >
                {resume.file_type.toUpperCase()}
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                ATS Optimized
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                AI Enhanced
              </Badge>
            </div>

            <div className="flex gap-2 pt-2 mt-auto">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() => onDownload(resume)}
                  disabled={downloadingId === resume.id}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20"
                  size="sm"
                >
                  {downloadingId === resume.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  <span>
                    {downloadingId === resume.id
                      ? "Downloading..."
                      : "Download"}
                  </span>
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    variant="outline"
                    size="sm"
                    className="px-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-slate-600 hover:border-red-500/30"
                  >
                    {deletingId === resume.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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

// =================================================================
// **ENHANCEMENT 1: Redesigned Agent Stats Overview**
// This component now uses the consistent glassmorphism card design
// for a unified look and feel with the Dashboard analytics.
// =================================================================
const AgentStatsOverview = memo(({ resumeCount }: { resumeCount: number }) => {
  const stats = useMemo(() => {
    const successRate = resumeCount > 0 ? 98 : 0;
    const avgMatch = resumeCount > 0 ? 95 : 0;

    return [
      {
        IconComponent: Brain,
        label: "AI Resumes",
        value: resumeCount.toString(),
        progress: Math.min(resumeCount * 5, 100),
        description: "In your arsenal",
        iconColor: "text-blue-400",
        borderColor: "border-blue-500/20",
        gradient: "from-blue-400 to-indigo-400",
      },
      {
        IconComponent: Shield,
        label: "ATS Friendly",
        value: "100%",
        progress: 100,
        description: "Guaranteed compatibility",
        iconColor: "text-emerald-400",
        borderColor: "border-emerald-500/20",
        gradient: "from-emerald-400 to-green-400",
      },
      {
        IconComponent: TrendingUp,
        label: "Avg. Match",
        value: `${avgMatch}%`,
        progress: avgMatch,
        description: "To job descriptions",
        iconColor: "text-purple-400",
        borderColor: "border-purple-500/20",
        gradient: "from-purple-400 to-pink-400",
      },
      {
        IconComponent: Award,
        label: "Success Rate",
        value: `${successRate}%`,
        progress: successRate,
        description: "Estimated interview chance",
        iconColor: "text-orange-400",
        borderColor: "border-orange-500/20",
        gradient: "from-orange-400 to-amber-400",
      },
    ];
  }, [resumeCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="group"
        >
          <Card
            className={`bg-slate-800/20 backdrop-blur-xl border ${stat.borderColor} hover:border-opacity-60 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-blue-500/5`}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 bg-slate-900/50 border ${stat.borderColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.IconComponent
                      className={`w-5 h-5 ${stat.iconColor}`}
                    />
                  </div>
                  <span className={`text-2xl font-bold ${stat.iconColor}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-base mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs text-slate-400">{stat.description}</p>
              </div>
              <div className="mt-4">
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
});
AgentStatsOverview.displayName = "AgentStatsOverview";

// **UNCHANGED: Main Component Logic**
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

  const userName = useMemo(() => {
    // ... (unchanged logic)
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
    // ... (unchanged logic)
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
      // ... (unchanged logic)
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
            <Button size="sm" onClick={() => navigate("/ai-resume-tailor")}>
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
      // ... (unchanged logic)
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
    // ... (unchanged logic)
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
    // ... (unchanged logic)
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

  // Unchanged: Authentication check
  if (!user) {
    // ... (unchanged)
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

  // **ENHANCED: Page Layout and Hero Section**
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragSnapToOrigin
          className="container mx-auto px-4 py-8 max-w-7xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="text-center pt-8 pb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/20 backdrop-blur-xl"
                >
                  <Brain className="w-10 h-10 text-blue-400" />
                </motion.div>
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight"
                  >
                    Resume{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Arsenal
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                  >
                    Hey <span className="text-blue-400">{userName}</span>! 👋
                    Your collection of AI-optimized resumes is ready for
                    deployment.
                  </motion.p>
                </div>
              </motion.div>
            </div>

            <AgentStatsOverview resumeCount={resumes.length} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Your Deployed Resumes
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortBy(sortBy === "date" ? "title" : "date")
                    }
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Sort by: {sortBy === "date" ? "Date" : "Title"}</span>
                  </Button>
                </div>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your arsenal by title or job description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedResumes.length === 0 ? (
                <motion.div /* Unchanged Empty State */
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                    <CardContent className="pt-8 pb-8 text-center">
                      <Brain className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        {searchTerm
                          ? "No Matching Resumes"
                          : "Your Arsenal is Empty"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm
                          ? `No resumes found for "${searchTerm}".`
                          : "Let your agents create your first AI-optimized resume!"}
                      </p>
                      <Button
                        onClick={() =>
                          searchTerm
                            ? setSearchTerm("")
                            : navigate("/ai-resume-tailor")
                        }
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        {searchTerm ? (
                          "Clear Search"
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" /> Create First
                            Resume
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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

            {resumes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-xl border border-slate-700/50">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      Expand Your Arsenal
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Deploy your agents to craft more resumes.
                    </p>
                    <Button
                      onClick={() => navigate("/ai-resume-tailor")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Activate Resume Agent
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default AIResumeArsenal;
