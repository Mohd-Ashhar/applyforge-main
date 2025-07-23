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
  ExternalLink,
  Bookmark,
  Calendar,
  Trash2,
  Building,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  Heart,
  Share2,
  Eye,
  Loader2,
  Plus,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  Clock,
  Globe,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description?: string;
  saved_at: string;
  apply_url: string;
  posted_at?: string;
  employment_type?: string;
  seniority_level?: string;
  job_function?: string;
  industries?: string;
  user_id: string;
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
              className="w-12 h-12 bg-muted rounded-xl"
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

// Enhanced Saved Job Card Component with your 3 requested changes
const SavedJobCard = ({
  job,
  index,
  onRemove,
  onShare,
  removingIds,
}: {
  job: SavedJob;
  index: number;
  onRemove: (jobId: string) => void;
  onShare: (job: SavedJob) => void;
  removingIds: Set<string>;
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

  // 3. REFACTORED: Improved saved time formatting
  const formatSavedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 120
  ) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
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
      <Card className="glass border-border/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-semibold text-blue-600"
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {getCompanyInitials(job.company_name)}
              </motion.div>
              <div className="flex-1 min-w-0">
                {/* 1. REMOVED: Saved badge and heart icon */}
                <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                  {job.job_title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium truncate">
                    {job.company_name}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. REMOVED: More options button (three dots) */}
          </div>

          {/* 3. REFACTORED: Better positioned saved time badge */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{job.job_location}</span>
            </div>
            {/* <Badge
              variant="outline"
              className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
            >
              <Bookmark className="w-3 h-3 mr-1 text-blue-500" />
              {formatSavedDate(job.saved_at)}
            </Badge> */}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Employment Type and Level Tags */}
          {(job.employment_type || job.seniority_level || job.job_function) && (
            <div className="flex flex-wrap gap-2">
              {job.employment_type && (
                <Badge variant="outline" className="text-xs">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {job.employment_type}
                </Badge>
              )}
              {job.seniority_level && (
                <Badge variant="outline" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  {job.seniority_level}
                </Badge>
              )}
              {job.job_function && (
                <Badge variant="outline" className="text-xs">
                  {job.job_function}
                </Badge>
              )}
            </div>
          )}

          {/* Job Description */}
          {job.job_description && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                Job Description
              </h4>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {truncateDescription(job.job_description)}
                </p>
              </div>
            </div>
          )}

          {/* Posted Date */}
          {job.posted_at && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Posted {formatDate(job.posted_at)}</span>
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
                onClick={() => window.open(job.apply_url, "_blank")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </motion.div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => onShare(job)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share job</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onRemove(job.id)}
                  disabled={removingIds.has(job.id)}
                  variant="outline"
                  size="sm"
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {removingIds.has(job.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove from saved</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Stats Component
const SavedJobsStats = ({ jobCount }: { jobCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  >
    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-2xl font-bold text-red-600">{jobCount}</div>
        <div className="text-xs text-muted-foreground">Saved Jobs</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">Active</div>
        <div className="text-xs text-muted-foreground">Job Search</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-600">Curated</div>
        <div className="text-xs text-muted-foreground">Collection</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Award className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-2xl font-bold text-orange-600">Ready</div>
        <div className="text-xs text-muted-foreground">To Apply</div>
      </CardContent>
    </Card>
  </motion.div>
);

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load saved jobs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (jobId: string) => {
    setRemovingIds((prev) => new Set(prev).add(jobId));

    try {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("id", jobId);

      if (error) throw error;

      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast({
        title: "Job Removed ✅",
        description: "The job has been removed from your saved jobs.",
      });
    } catch (error) {
      console.error("Error removing job:", error);
      toast({
        title: "Remove Failed",
        description: "There was an error removing the job.",
        variant: "destructive",
      });
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleShare = (job: SavedJob) => {
    if (navigator.share) {
      navigator.share({
        title: `${job.job_title} at ${job.company_name}`,
        text: `Check out this job opportunity: ${job.job_title} at ${job.company_name}`,
        url: job.apply_url,
      });
    } else {
      navigator.clipboard.writeText(job.apply_url);
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard.",
      });
    }
  };

  const filteredJobs = savedJobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "company":
        return a.company_name.localeCompare(b.company_name);
      case "title":
        return a.job_title.localeCompare(b.job_title);
      case "date":
      default:
        return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
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
                  className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <Heart className="w-8 h-8 text-red-500" />
                </motion.div>
                <p className="text-muted-foreground mb-4">
                  Please log in to view your saved jobs.
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
                className="flex items-center gap-2 mb-6 hover:bg-red-500/10 transition-colors"
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
                className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4"
              >
                <Heart className="w-8 h-8 text-red-600" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Saved <span className="gradient-text">Jobs</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                View and manage your saved job opportunities
              </motion.p>
            </div>

            {/* Saved Jobs Stats */}
            <SavedJobsStats jobCount={savedJobs.length} />

            {/* Search and Filter Controls */}
            {savedJobs.length > 0 && (
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
                    placeholder="Search saved jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          ? "title"
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
                      : "Title"}
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={fetchSavedJobs}
                        className="px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh saved jobs</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton />
            ) : sortedJobs.length === 0 ? (
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
                      <Heart className="w-10 h-10 text-muted-foreground" />
                    </motion.div>

                    <h3 className="text-2xl font-semibold mb-3">
                      {searchTerm
                        ? "No Matching Saved Jobs"
                        : "No Saved Jobs Yet"}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      {searchTerm
                        ? `No saved jobs found matching "${searchTerm}". Try a different search term.`
                        : "You haven't saved any jobs yet. Start by using our job finder to discover and save opportunities!"}
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
                        <Link to="/job-finder">
                          <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                            <Search className="w-4 h-4 mr-2" />
                            Find Jobs to Save
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
                {sortedJobs.map((job, index) => (
                  <SavedJobCard
                    key={job.id}
                    job={job}
                    index={index}
                    onRemove={handleRemove}
                    onShare={handleShare}
                    removingIds={removingIds}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Job Search CTA */}
          {sortedJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <Card className="glass border-border/50 shadow-lg">
                <CardContent className="p-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to find more opportunities?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Continue your job search and discover new positions to save
                  </p>
                  <Link to="/job-finder">
                    <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Find More Jobs
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

export default SavedJobs;
