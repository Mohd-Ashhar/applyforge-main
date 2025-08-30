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

// **UNCHANGED**
interface CoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
  original_resume_name: string | null;
  file_type: string;
}

// **ENHANCED & FIXED: SKELETON WITH ALTERNATIVE ANIMATION SYNTAX**
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
              className="w-12 h-12 bg-purple-500/10 rounded-xl border border-purple-500/20"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-3/4 bg-slate-700/50 rounded"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.2,
                }}
              />
            </div>
          </div>
          <motion.div
            className="h-20 w-full bg-slate-700/50 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.6,
            }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-10 flex-1 bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.8,
              }}
            />
            <motion.div
              className="h-10 w-10 bg-slate-700/50 rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1,
              }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

// **REFACTORED: COVER LETTER CARD DESIGN IS NOW CONSISTENT**
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
        whileHover={{ y: -8, scale: 1.02 }}
        className="group h-full"
      >
        <Card className="bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/15 overflow-hidden h-full flex flex-col">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className="w-14 h-14 bg-slate-900 border border-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0"
                whileHover={{ rotate: [0, -8, 8, -4, 0] }}
              >
                <span className="font-bold text-purple-400 text-lg">
                  {getCompanyInitials(letter.company_name)}
                </span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors duration-300 leading-tight line-clamp-2">
                  {letter.position_title}
                </h3>
                <p className="text-sm text-slate-400 font-medium truncate">
                  for {letter.company_name}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4 flex-1">
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 space-y-2">
                <h4 className="font-medium text-xs flex items-center gap-2 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Based on Resume</span>
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed truncate">
                  {letter.original_resume_name || "Default Resume"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Personalized
              </Badge>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                AI Crafted
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                Job Matched
              </Badge>
            </div>

            <div className="flex gap-2 pt-2 mt-auto">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={() =>
                    onDownload(
                      letter.cover_letter_url,
                      `${letter.company_name}_Cover_Letter.pdf`
                    )
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(letter.id, letter.company_name)}
                    disabled={deletingIds.has(letter.id)}
                    variant="outline"
                    size="icon"
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-slate-600 hover:border-red-500/30"
                  >
                    {deletingIds.has(letter.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete letter</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);
AICoverLetterCard.displayName = "AICoverLetterCard";

// **REFACTORED: STATS OVERVIEW NOW MATCHES LiveAnalyticsCards DESIGN**
const AgentLibraryStats = memo(
  ({ coverLetterCount }: { coverLetterCount: number }) => {
    const stats = useMemo(
      () => [
        {
          label: "AI Cover Letters",
          value: coverLetterCount,
          progress: Math.min(coverLetterCount * 4, 100),
          description: "Crafted by agents",
          icon: Mail,
          color: "purple",
        },
        {
          label: "Agent Crafted",
          value: coverLetterCount,
          progress: 100,
          description: "100% AI generation",
          icon: Bot,
          color: "pink",
        },
        {
          label: "Highly Personalized",
          value: coverLetterCount > 0 ? 95 : 0,
          unit: "%",
          progress: coverLetterCount > 0 ? 95 : 0,
          description: "Avg. personalization",
          icon: Target,
          color: "blue",
        },
        {
          label: "Success Rate",
          value: coverLetterCount > 0 ? 97 : 0,
          unit: "%",
          progress: coverLetterCount > 0 ? 97 : 0,
          description: "Estimated impact",
          icon: Award,
          color: "orange",
        },
      ],
      [coverLetterCount]
    );

    const colorClasses = {
      purple: {
        bg: "bg-gradient-to-br from-purple-500/10 to-pink-600/10",
        border: "border-purple-500/20 hover:border-purple-400/40",
        iconBg: "bg-purple-500/20 border-purple-500/30",
        iconColor: "text-purple-400",
        progress: "from-purple-500 to-pink-500",
      },
      pink: {
        bg: "bg-gradient-to-br from-pink-500/10 to-rose-600/10",
        border: "border-pink-500/20 hover:border-pink-400/40",
        iconBg: "bg-pink-500/20 border-pink-500/30",
        iconColor: "text-pink-400",
        progress: "from-pink-500 to-rose-500",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10",
        border: "border-blue-500/20 hover:border-blue-400/40",
        iconBg: "bg-blue-500/20 border-blue-500/30",
        iconColor: "text-blue-400",
        progress: "from-blue-500 to-indigo-500",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-500/10 to-amber-600/10",
        border: "border-orange-500/20 hover:border-orange-400/40",
        iconBg: "bg-orange-500/20 border-orange-500/30",
        iconColor: "text-orange-400",
        progress: "from-orange-500 to-amber-500",
      },
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          const StatIcon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`${colors.bg} backdrop-blur-xl border ${colors.border} transition-all duration-300 group`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 font-medium mb-1">
                        {stat.label}
                      </p>
                      <span className="text-3xl font-bold text-white">
                        {stat.value}
                        {stat.unit}
                      </span>
                    </div>
                    <motion.div
                      className={`p-3 rounded-xl ${colors.iconBg}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <StatIcon className={`w-5 h-5 ${colors.iconColor}`} />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{stat.description}</span>
                    </div>
                    <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors.progress}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{
                          delay: 0.5,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);
AgentLibraryStats.displayName = "AgentLibraryStats";

// **UNCHANGED: Main Component Logic**
const AICoverLetterLibrary: React.FC = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "position">("date");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user]);

  const fetchCoverLetters = useCallback(async () => {
    // ... (unchanged logic)
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
      toast({
        title: "Agent Error",
        description: "Failed to load your AI cover letter library.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user) {
      fetchCoverLetters();
    }
  }, [user, fetchCoverLetters]);

  const handleDownload = useCallback(
    (url: string, fileName: string) => {
      // ... (unchanged logic)
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
      });
    },
    [toast]
  );

  const handleShare = useCallback(
    (letter: CoverLetter) => {
      // ... (unchanged logic)
      navigator.clipboard.writeText(letter.cover_letter_url);
      toast({
        title: "Link Copied ✅",
        description: "Cover letter link copied to clipboard.",
      });
    },
    [toast]
  );

  const handleDelete = useCallback(
    async (id: string, companyName: string) => {
      // ... (unchanged logic)
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
          description: `Letter for ${companyName} has been removed.`,
        });
      } catch (error) {
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
    // ... (unchanged auth check)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
          <CardContent className="pt-6 text-center">
            <Mail className="w-8 h-8 text-purple-400 mx-auto mb-4" />
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
      </div>
    );
  }

  // **ENHANCED: Page Layout and Hero Section**
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-rose-500/20 rounded-full flex items-center justify-center border border-purple-500/20 backdrop-blur-xl"
                >
                  <Mail className="w-10 h-10 text-purple-400" />
                </motion.div>
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight"
                  >
                    Cover Letter{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Library
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                  >
                    Hey <span className="text-purple-400">{userName}</span>! 👋
                    Your collection of AI-crafted cover letters is ready to
                    deploy.
                  </motion.p>
                </div>
              </motion.div>
            </div>

            <AgentLibraryStats coverLetterCount={coverLetters.length} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Your Generated Letters
                </h2>
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
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>
                      Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by position or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton />
              ) : sortedCoverLetters.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                    <CardContent className="pt-8 pb-8 text-center">
                      <Mail className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        {searchTerm
                          ? "No Matching Letters"
                          : "Your Library is Empty"}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {searchTerm
                          ? `No letters found for "${searchTerm}".`
                          : "Let your agents craft your first personalized cover letter!"}
                      </p>
                      <Button
                        onClick={() =>
                          searchTerm
                            ? setSearchTerm("")
                            : navigate("/cover-letter-generator")
                        }
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {searchTerm ? (
                          "Clear Search"
                        ) : (
                          <>
                            <PenTool className="w-4 h-4 mr-2" /> Craft First
                            Letter
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
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AICoverLetterLibrary;
