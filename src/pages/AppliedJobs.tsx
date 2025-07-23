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
  MapPin,
  Briefcase,
  Clock,
  Building,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Share2,
  Eye,
  AlertCircle,
  Globe,
  Loader2,
  MoreVertical,
  Link as LinkIcon,
  Star,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AppliedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string | null;
  applied_at: string;
  seniority_level: string | null;
  employment_type: string | null;
  apply_url: string;
  job_link: string | null;
  company_linkedin_url: string | null;
  posted_at: string;
  job_function: string | null;
  industries: string | null;
}

// Enhanced Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass rounded-xl border border-border/50 shadow-lg"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-6 h-6 bg-muted rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-4 w-20 bg-muted rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
            </div>
            <motion.div
              className="h-6 w-24 bg-muted rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>

          <div className="space-y-2">
            <motion.div
              className="h-6 w-3/4 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
            <motion.div
              className="h-4 w-1/2 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            />
          </div>

          <motion.div
            className="h-20 w-full bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          />

          <div className="flex gap-2">
            <motion.div
              className="h-9 flex-1 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
            <motion.div
              className="h-9 w-24 bg-muted rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.4 }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Enhanced Job Application Card
const JobApplicationCard = ({
  job,
  index,
}: {
  job: AppliedJob;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPostedAt = (posted: string) => {
    if (posted.includes("-") && posted.length === 10) {
      const date = new Date(posted);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return posted;
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 150
  ) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatAppliedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Applied today";
    if (diffDays <= 7) return `Applied ${diffDays} days ago`;
    return `Applied ${Math.floor(diffDays / 7)} weeks ago`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.job_title} at ${job.company_name}`,
        text: `Check out this job application: ${job.job_title} at ${job.company_name}`,
        url: job.apply_url,
      });
    } else {
      navigator.clipboard.writeText(job.apply_url);
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
      <Card className="glass border-border/50 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center font-semibold text-green-600"
                animate={{ rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {getCompanyInitials(job.company_name)}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Applied
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold truncate group-hover:text-green-600 transition-colors">
                  {job.job_title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium truncate">
                    {job.company_name}
                  </span>
                  {job.company_linkedin_url && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <a
                            href={job.company_linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View company LinkedIn</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                {formatAppliedDate(job.applied_at)}
              </Badge>
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
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{job.job_location}</span>
            </div>

            {job.seniority_level && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{job.seniority_level}</span>
              </div>
            )}
          </div>

          {/* Employment Type and Industry Tags */}
          <div className="flex flex-wrap gap-2">
            {job.employment_type && (
              <Badge variant="outline" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {job.employment_type}
              </Badge>
            )}
            {job.job_function && (
              <Badge variant="outline" className="text-xs">
                {job.job_function}
              </Badge>
            )}
            {job.industries && (
              <Badge variant="outline" className="text-xs">
                {job.industries}
              </Badge>
            )}
          </div>

          {/* Job Description */}
          {job.job_description && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Job Description
              </h4>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {truncateDescription(
                    job.job_description
                      .replace(/&gt;/g, ">")
                      .replace(/&lt;/g, "<")
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Posted Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Originally posted {formatPostedAt(job.posted_at)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="sm"
              >
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Application
                </a>
              </Button>
            </motion.div>

            {job.job_link && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="sm" className="px-3">
                    <a
                      href={job.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View original job posting</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share application</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Stats Component
const ApplicationStats = ({ jobCount }: { jobCount: number }) => {
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      <Card className="glass border-border/50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600">{jobCount}</div>
          <div className="text-xs text-muted-foreground">Applications</div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{currentMonth}</div>
          <div className="text-xs text-muted-foreground">This Month</div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">Tracked</div>
          <div className="text-xs text-muted-foreground">Status</div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600">Active</div>
          <div className="text-xs text-muted-foreground">Search</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  const fetchAppliedJobs = async () => {
    if (!user?.id) {
      console.error("No user ID available");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching applied jobs for user:", user.id);
      const { data, error } = await supabase
        .from("applied_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) {
        console.error("Error fetching applied jobs:", error);
        throw error;
      }

      console.log("Applied jobs fetched successfully:", data);
      setAppliedJobs(data || []);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = appliedJobs.filter(
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
        return (
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
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
                  className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
                <p className="text-muted-foreground mb-4">
                  Please log in to view your applied jobs.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
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
              className="flex items-center gap-2 mb-6 hover:bg-green-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Applied <span className="gradient-text">Jobs</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground"
              >
                {appliedJobs.length}{" "}
                {appliedJobs.length === 1 ? "application" : "applications"}{" "}
                tracked
              </motion.p>
            </div>

            {/* Application Stats */}
            <ApplicationStats jobCount={appliedJobs.length} />

            {/* Search and Filter Controls */}
            {appliedJobs.length > 0 && (
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
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        onClick={fetchAppliedJobs}
                        className="px-3"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh applications</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
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
                      <CheckCircle className="w-10 h-10 text-muted-foreground" />
                    </motion.div>

                    <h3 className="text-2xl font-semibold mb-3">
                      {searchTerm
                        ? "No Matching Applications"
                        : "No Applied Jobs Yet"}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                      {searchTerm
                        ? `No applications found matching "${searchTerm}". Try a different search term.`
                        : "Start applying to jobs and track your applications here. Your job search journey begins now!"}
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
                          onClick={() => navigate("/job-finder")}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Find Jobs to Apply
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {sortedJobs.map((job, index) => (
                  <JobApplicationCard key={job.id} job={job} index={index} />
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
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    Keep the momentum going!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Continue your job search and apply to more opportunities
                  </p>
                  <Button
                    onClick={() => navigate("/job-finder")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find More Jobs
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

export default AppliedJobs;
