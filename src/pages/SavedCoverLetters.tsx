import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
  original_resume_name: string | null;
  file_type: string;
}

// Enhanced Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass rounded-xl border border-border/50 shadow-lg"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-muted rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-3/4 bg-muted rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-3 w-1/2 bg-muted rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <motion.div
              className="w-16 h-6 bg-muted rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </div>
          <motion.div
            className="h-16 w-full bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-9 flex-1 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="h-9 w-9 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Enhanced Cover Letter Card Component
const CoverLetterCard = ({
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

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
      <Card className="glass border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-semibold text-blue-600"
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {getCompanyInitials(letter.company_name)}
              </motion.div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                  {letter.position_title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium truncate">
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between mt-3">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(letter.created_at)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Original Resume Info */}
          {letter.original_resume_name && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                Source Resume
              </h4>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground truncate">
                  {letter.original_resume_name}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => onShare(letter)}
                >
                  <Share2 className="w-4 h-4" />
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
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {deletingIds.has(letter.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
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
};

// Stats Component
const StatsOverview = ({ coverLetterCount }: { coverLetterCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  >
    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {coverLetterCount}
        </div>
        <div className="text-xs text-muted-foreground">Cover Letters</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-600">AI</div>
        <div className="text-xs text-muted-foreground">Generated</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-600">Secure</div>
        <div className="text-xs text-muted-foreground">Storage</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-2xl font-bold text-orange-600">Pro</div>
        <div className="text-xs text-muted-foreground">Quality</div>
      </CardContent>
    </Card>
  </motion.div>
);

const SavedCoverLetters: React.FC = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "position">("date");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCoverLetters();
    }
  }, [user]);

  const fetchCoverLetters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user?.id)
        .order("generated_at", { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      toast({
        title: "Error",
        description: "Failed to load cover letters.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started! 📥",
      description: "Your cover letter is being downloaded.",
    });
  };

  const handleShare = (letter: CoverLetter) => {
    if (navigator.share) {
      navigator.share({
        title: `Cover Letter - ${letter.position_title}`,
        text: `Cover letter for ${letter.position_title} at ${letter.company_name}`,
        url: letter.cover_letter_url,
      });
    } else {
      navigator.clipboard.writeText(letter.cover_letter_url);
      toast({
        title: "Link Copied",
        description: "Cover letter link copied to clipboard.",
      });
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
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
        description: `Cover letter "${fileName}" has been deleted.`,
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
  };

  const filteredCoverLetters = coverLetters.filter(
    (letter) =>
      letter.position_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCoverLetters = [...filteredCoverLetters].sort((a, b) => {
    switch (sortBy) {
      case "company":
        return a.company_name.localeCompare(b.company_name);
      case "position":
        return a.position_title.localeCompare(b.position_title);
      case "date":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  if (!user) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="w-full max-w-md glass border-border/50 shadow-xl">
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <FileText className="w-8 h-8 text-blue-500" />
                </motion.div>
                <p className="text-muted-foreground mb-4">
                  Please log in to view your cover letters.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-6 hover:bg-blue-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4"
              >
                <FileText className="w-8 h-8 text-blue-600" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Saved <span className="gradient-text">Cover Letters</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                {coverLetters.length}{" "}
                {coverLetters.length === 1 ? "cover letter" : "cover letters"}{" "}
                saved
              </motion.p>
            </div>

            {/* Stats Overview */}
            <StatsOverview coverLetterCount={coverLetters.length} />

            {/* Search and Filter Controls */}
            {coverLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Search cover letters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Sort by{" "}
                    {sortBy === "date"
                      ? "Date"
                      : sortBy === "company"
                      ? "Company"
                      : "Position"}
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchCoverLetters}
                        className="px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh cover letters</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}
          </motion.div>

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
                className="text-center py-16"
              >
                <Card className="glass border-border/50 shadow-xl max-w-lg mx-auto">
                  <CardContent className="pt-8 pb-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6"
                    >
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </motion.div>

                    <h3 className="text-2xl font-semibold mb-3">
                      {searchTerm
                        ? "No Matching Cover Letters"
                        : "No Cover Letters Yet"}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      {searchTerm
                        ? `No cover letters found matching "${searchTerm}". Try a different search term.`
                        : "You haven't created any cover letters yet. Start by generating your first AI-powered cover letter!"}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {searchTerm ? (
                        <Button
                          variant="outline"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <Button
                          onClick={() => navigate("/cover-letter-generator")}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Generate Your First Cover Letter
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedCoverLetters.map((letter, index) => (
                  <CoverLetterCard
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
              className="mt-12 text-center"
            >
              <Card className="glass border-border/50 shadow-lg">
                <CardContent className="p-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    Need another cover letter?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a new AI-powered cover letter for your next job
                    application
                  </p>
                  <Button
                    onClick={() => navigate("/cover-letter-generator")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Cover Letter
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SavedCoverLetters;
