import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TailoredResume {
  id: string;
  job_description: string;
  resume_data: string;
  file_type: string;
  created_at: string;
  title: string | null;
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
          </div>
          <motion.div
            className="h-20 w-full bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <div className="flex gap-2">
            <motion.div
              className="h-9 flex-1 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            />
            <motion.div
              className="h-9 w-9 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Enhanced Resume Card Component
const ResumeCard = ({
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

  const formatJobDescription = (description: string) => {
    return description.length > 120
      ? description.substring(0, 120) + "..."
      : description;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "📄";
      case "docx":
        return "📝";
      default:
        return "📄";
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "docx":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
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
                className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FileText className="w-6 h-6 text-blue-600" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {resume.title || "Tailored Resume"}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`text-xs px-2 py-1 ${getFileTypeColor(
                      resume.file_type
                    )}`}
                  >
                    {getFileTypeIcon(resume.file_type)}{" "}
                    {resume.file_type.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Tailored
                  </Badge>
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

          <CardDescription className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            Created on {formatDate(resume.created_at)}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Job Description Preview */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Job Description
            </h4>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {formatJobDescription(resume.job_description)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onDownload(resume)}
                disabled={downloadingId === resume.id}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="sm"
              >
                {downloadingId === resume.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </motion.div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                  <Share2 className="w-4 h-4" />
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
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
};

// Stats Component
const StatsOverview = ({ resumeCount }: { resumeCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  >
    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">{resumeCount}</div>
        <div className="text-xs text-muted-foreground">Total Resumes</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-600">100%</div>
        <div className="text-xs text-muted-foreground">ATS Optimized</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-600">Secure</div>
        <div className="text-xs text-muted-foreground">Data Protected</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-2xl font-bold text-orange-600">24/7</div>
        <div className="text-xs text-muted-foreground">Access</div>
      </CardContent>
    </Card>
  </motion.div>
);

const TailoredResumes: React.FC = () => {
  const [resumes, setResumes] = useState<TailoredResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTailoredResumes();
    }
  }, [user]);

  const fetchTailoredResumes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tailored_resumes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching tailored resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load tailored resumes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (resume: TailoredResume) => {
    try {
      setDownloadingId(resume.id);

      if (!resume.resume_data || !resume.file_type) {
        throw new Error("Missing resume download URL or file type");
      }

      const a = document.createElement("a");
      a.href = resume.resume_data;
      a.download = `${
        resume.title?.replace(/\s+/g, "-") || "tailored-resume"
      }-${new Date(resume.created_at).toLocaleDateString()}.${
        resume.file_type
      }`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started! 📥",
        description: "Your tailored resume is being downloaded.",
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
  };

  const handleDelete = async (resumeId: string) => {
    try {
      setDeletingId(resumeId);

      const { data: error } = await supabase
        .from("tailored_resumes")
        .delete()
        .eq("id", resumeId);

      if (error) throw error;

      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
      toast({
        title: "Resume Deleted ✅",
        description: "The tailored resume has been deleted successfully.",
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
  };

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.job_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return (a.title || "").localeCompare(b.title || "");
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
                  Please log in to view your tailored resumes.
                </p>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Login to Continue
                  </Button>
                </Link>
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
            <Link to="/">
              <Button
                variant="ghost"
                className="flex items-center gap-2 mb-6 hover:bg-blue-500/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>

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
                Your <span className="gradient-text">Tailored Resumes</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                View, download, and manage your AI-optimized resumes
              </motion.p>
            </div>

            {/* Stats Overview */}
            <StatsOverview resumeCount={resumes.length} />

            {/* Search and Filter Controls */}
            {resumes.length > 0 && (
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
                    placeholder="Search resumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortBy(sortBy === "date" ? "title" : "date")
                    }
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Sort by {sortBy === "date" ? "Title" : "Date"}
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchTailoredResumes}
                        className="px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh resumes</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}
          </motion.div>

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
                        ? "No Matching Resumes"
                        : "No Tailored Resumes Yet"}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      {searchTerm
                        ? `No resumes found matching "${searchTerm}". Try a different search term.`
                        : "You haven't created any tailored resumes yet. Start by using our AI Resume Tailor to create your first optimized resume!"}
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
                        <Link to="/ai-resume-tailor">
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Resume
                          </Button>
                        </Link>
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
                {sortedResumes.map((resume, index) => (
                  <ResumeCard
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
              className="mt-12 text-center"
            >
              <Card className="glass border-border/50 shadow-lg">
                <CardContent className="p-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    Need another tailored resume?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create a new resume optimized for a different job
                    opportunity
                  </p>
                  <Link to="/ai-resume-tailor">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TailoredResumes;
