import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Search,
  FileText,
  Save,
  Upload,
  Check,
  Home,
  Filter,
  RefreshCw,
  Eye,
  Share2,
  Loader2,
  Target,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  Heart,
  Zap,
  Globe,
  MoreVertical,
  Star,
  Bookmark,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface JobResult {
  jobLink: string;
  title: string;
  companyName: string;
  companyLinkedinUrl: string;
  location: string;
  postedAt: string;
  applyUrl: string;
  descriptionText: string;
  seniorityLevel: string;
  employmentType: string;
  jobFunction: string;
  industries: string;
  // Add unique identifier for better tracking
  uniqueId?: string;
}

// Enhanced Loading Skeleton
const JobResultsLoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass rounded-xl border border-border/50 shadow-lg"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                className="w-12 h-12 bg-muted rounded-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  className="h-6 w-3/4 bg-muted rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="h-4 w-1/2 bg-muted rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
            <motion.div
              className="w-20 h-6 bg-muted rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
          </div>

          <motion.div
            className="h-20 w-full bg-muted rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />

          <div className="flex gap-2">
            {[1, 2, 3, 4].map((btnIndex) => (
              <motion.div
                key={btnIndex}
                className="h-9 w-24 bg-muted rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 1 + btnIndex * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Enhanced Job Card Component
const JobCard = ({
  job,
  index,
  onSaveJob,
  onTailorResume,
  onGenerateCoverLetter,
  onAppliedChange,
  onShare,
  savedJobs,
  savingJobs,
  processingResume,
  processingCoverLetter,
  appliedJobs,
  applyingJobs,
  user,
}: {
  job: JobResult;
  index: number;
  onSaveJob: (job: JobResult, index: number) => void;
  onTailorResume: (job: JobResult, index: number) => void;
  onGenerateCoverLetter: (job: JobResult, index: number) => void;
  onAppliedChange: (job: JobResult, index: number, checked: boolean) => void;
  onShare: (job: JobResult) => void;
  savedJobs: Set<number>;
  savingJobs: Set<number>;
  processingResume: Set<number>;
  processingCoverLetter: Set<number>;
  appliedJobs: Set<number>;
  applyingJobs: Set<number>;
  user: any;
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

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted today";
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
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
    maxLength: number = 150
  ) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }} // Enhanced exit animation
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
                {getCompanyInitials(job.companyName || "UN")}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                    {job.title || "Job Title Not Available"}
                  </CardTitle>
                  {/* Share button positioned in header area for desktop */}
                  <div className="hidden md:flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onShare(job)}
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                        >
                          <Share2 className="w-4 h-4 text-muted-foreground hover:text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share job</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium truncate">
                    {job.companyName || "Company Name Not Available"}
                  </span>
                  {job.companyLinkedinUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <a
                            href={job.companyLinkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3" />
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
                {formatPostedDate(job.postedAt)}
              </Badge>
              {user && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`applied-${index}`}
                    checked={appliedJobs.has(index)}
                    onCheckedChange={(checked) =>
                      onAppliedChange(job, index, checked as boolean)
                    }
                    disabled={applyingJobs.has(index)}
                  />
                  <label
                    htmlFor={`applied-${index}`}
                    className="text-xs font-medium leading-none cursor-pointer"
                  >
                    {applyingJobs.has(index) ? "Saving..." : "Applied"}
                  </label>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">
                {job.location || "Location Not Available"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">
                {job.seniorityLevel || "Experience Level Not Available"}
              </span>
            </div>
          </div>

          {/* Employment Type and Industry Tags */}
          <div className="flex flex-wrap gap-2">
            {job.employmentType && (
              <Badge variant="outline" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {job.employmentType}
              </Badge>
            )}
            {job.jobFunction && (
              <Badge variant="outline" className="text-xs">
                {job.jobFunction}
              </Badge>
            )}
            {job.industries && (
              <Badge variant="outline" className="text-xs">
                {job.industries}
              </Badge>
            )}
          </div>

          {/* Job Description */}
          {job.descriptionText && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Job Description
              </h4>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: truncateDescription(
                      job.descriptionText
                        .replace(/&gt;/g, ">")
                        .replace(/&lt;/g, "<")
                    ),
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons Layout */}
          <div className="pt-2">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-wrap gap-2">
              {/* Enhanced Save Job Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onSaveJob(job, index)}
                  disabled={savingJobs.has(index)}
                  size="sm"
                  className={
                    savedJobs.has(index)
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg border-0"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-red-50 hover:to-pink-50 hover:text-red-600 border border-gray-300 shadow-md"
                  }
                >
                  {savedJobs.has(index) ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      {savingJobs.has(index) ? "Saving..." : "Save"}
                    </>
                  )}
                </Button>
              </motion.div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onTailorResume(job, index)}
                    disabled={processingResume.has(index)}
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    {processingResume.has(index) ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    Tailor Resume
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Upload resume to tailor for this job
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onGenerateCoverLetter(job, index)}
                    disabled={processingCoverLetter.has(index)}
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    {processingCoverLetter.has(index) ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Cover Letter
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Generate cover letter for this job
                </TooltipContent>
              </Tooltip>

              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Layout - Better Spacing and Organization */}
            <div className="md:hidden space-y-3">
              {/* First Row: Primary Actions */}
              <div className="grid grid-cols-2 gap-3">
                {/* Enhanced Save Job Button for Mobile */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onSaveJob(job, index)}
                    disabled={savingJobs.has(index)}
                    size="sm"
                    className={
                      savedJobs.has(index)
                        ? "w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg border-0"
                        : "w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-red-50 hover:to-pink-50 hover:text-red-600 border border-gray-300 shadow-md"
                    }
                  >
                    {savedJobs.has(index) ? (
                      <>
                        <Heart className="w-4 h-4 mr-1 fill-current" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-1" />
                        {savingJobs.has(index) ? "Saving..." : "Save"}
                      </>
                    )}
                  </Button>
                </motion.div>

                <Button
                  onClick={() => onShare(job)}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Second Row: AI Tools */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onTailorResume(job, index)}
                  disabled={processingResume.has(index)}
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  {processingResume.has(index) ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-xs">Resume</span>
                </Button>

                <Button
                  onClick={() => onGenerateCoverLetter(job, index)}
                  disabled={processingCoverLetter.has(index)}
                  size="sm"
                  variant="outline"
                  className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  {processingCoverLetter.has(index) ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-xs">Cover</span>
                </Button>
              </div>

              {/* Third Row: Apply Button - Full Width */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11"
                >
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Stats Component
const JobResultsStats = ({ jobCount }: { jobCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  >
    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Search className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">{jobCount}</div>
        <div className="text-xs text-muted-foreground">Jobs Found</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-600">Fresh</div>
        <div className="text-xs text-muted-foreground">Opportunities</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-600">Matched</div>
        <div className="text-xs text-muted-foreground">Your Search</div>
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

const JobResults: React.FC = () => {
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [savingJobs, setSavingJobs] = useState<Set<number>>(new Set());
  const [processingResume, setProcessingResume] = useState<Set<number>>(
    new Set()
  );
  const [processingCoverLetter, setProcessingCoverLetter] = useState<
    Set<number>
  >(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [applyingJobs, setApplyingJobs] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const results = sessionStorage.getItem("jobSearchResults");
    if (results) {
      try {
        const parsedResults = JSON.parse(results);
        console.log("Loaded job results:", parsedResults);
        const jobsArray = Array.isArray(parsedResults)
          ? parsedResults
          : [parsedResults];

        // Add unique identifiers to jobs for better tracking
        const jobsWithIds = jobsArray.map((job, index) => ({
          ...job,
          uniqueId: `${job.title}-${job.companyName}-${index}-${Date.now()}`,
        }));

        setJobResults(jobsWithIds);

        if (user && jobsWithIds.length > 0) {
          saveJobSearchResults(jobsWithIds);
        }
      } catch (error) {
        console.error("Error parsing job results:", error);
        setJobResults([]);
      }
    } else {
      navigate("/job-finder");
    }
    setLoading(false);
  }, [navigate, user]);

  const saveJobSearchResults = async (jobs: JobResult[]) => {
    if (!user) return;

    try {
      const jobSearchData = jobs.map((job) => ({
        user_id: user.id,
        job_title: job.title || "Unknown",
        company_name: job.companyName || "Unknown",
        location: job.location || "Unknown",
        experience_level: job.seniorityLevel || "Not specified",
        job_type: job.employmentType || "Not specified",
        work_type: "Not specified",
        apply_link: job.applyUrl || "",
        company_linkedin_url: job.companyLinkedinUrl || null,
        posted_at: job.postedAt || new Date().toISOString(),
        job_description: job.descriptionText || null,
        seniority_level: job.seniorityLevel || null,
        employment_type: job.employmentType || null,
        job_function: job.jobFunction || null,
        industries: job.industries || null,
      }));

      const { error } = await supabase
        .from("job_search_results")
        .insert(jobSearchData);

      if (error) {
        console.error("Error saving job search results:", error);
        toast({
          title: "Storage Error",
          description:
            "Jobs found but failed to save. You can still view the results.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in saveJobSearchResults:", error);
      toast({
        title: "Storage Error",
        description:
          "Jobs found but failed to save. You can still view the results.",
        variant: "destructive",
      });
    }
  };

  const handleSaveJob = async (job: JobResult, index: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save jobs.",
        variant: "destructive",
      });
      return;
    }

    setSavingJobs((prev) => new Set(prev).add(index));

    // FIXED ISSUE 2: Better handling of unsaving jobs
    if (savedJobs.has(index)) {
      try {
        // Remove from database - improved query to ensure proper deletion
        const { existingSavedJobs, error: fetchError } = await supabase
          .from("saved_jobs")
          .select("id")
          .eq("user_id", user.id)
          .eq("job_title", job.title)
          .eq("company_name", job.companyName)
          .eq("apply_url", job.applyUrl);

        if (fetchError) throw fetchError;

        if (existingSavedJobs && existingSavedJobs.length > 0) {
          // Delete all matching records (in case of duplicates)
          const idsToDelete = existingSavedJobs.map((record) => record.id);
          const { error: deleteError } = await supabase
            .from("saved_jobs")
            .delete()
            .in("id", idsToDelete);

          if (deleteError) throw deleteError;
        }

        // Remove from local state
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });

        toast({
          title: "Job Removed ✅",
          description: "Job has been removed from your saved jobs.",
        });
      } catch (error) {
        console.error("Error removing saved job:", error);
        toast({
          title: "Error",
          description: "Failed to remove job. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSavingJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
      return;
    }

    // Save job logic
    try {
      const jobData = {
        user_id: user.id,
        job_title: job.title || "",
        company_name: job.companyName || "",
        job_location: job.location || "",
        job_link: job.jobLink || null,
        company_linkedin_url: job.companyLinkedinUrl || null,
        posted_at: job.postedAt || "",
        apply_url: job.applyUrl || "",
        job_description: job.descriptionText || null,
        seniority_level: job.seniorityLevel || null,
        employment_type: job.employmentType || null,
        job_function: job.jobFunction || null,
        industries: job.industries || null,
      };

      const { error } = await supabase.from("saved_jobs").insert(jobData);

      if (error) {
        if (error.code === "23505") {
          setSavedJobs((prev) => new Set(prev).add(index));
          toast({
            title: "Already Saved",
            description: "This job is already in your saved jobs.",
          });
        } else {
          throw error;
        }
      } else {
        setSavedJobs((prev) => new Set(prev).add(index));
        toast({
          title: "Job Saved ✅",
          description: "Job has been added to your saved jobs.",
        });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleTailorResume = async (job: JobResult, index: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to tailor resumes.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setProcessingResume((prev) => new Set(prev).add(index));

      try {
        const base64Resume = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch(
          "https://n8n.applyforge.cloud/webhook-test/tailor-resume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resume: base64Resume,
              jobDescription: job.descriptionText,
              fileType: file.type === "application/pdf" ? "pdf" : "docx",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to tailor resume");
        }

        const tailoredResumeUrl = await response.text();

        if (tailoredResumeUrl) {
          const { error } = await supabase.from("tailored_resumes").insert({
            user_id: user.id,
            job_description: job.descriptionText,
            resume_data: tailoredResumeUrl,
            title: `${user.email?.split("@")[0] || "User"} - ${job.title}`,
            file_type: "pdf",
          });

          if (error) {
            console.error("Error saving tailored resume:", error);
          }

          const a = document.createElement("a");
          a.href = tailoredResumeUrl;
          a.download = `${user.email?.split("@")[0] || "User"}-${
            job.title
          }.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          toast({
            title: "Resume Tailored! 🎉",
            description:
              "Your tailored resume has been generated and downloaded!",
          });
        }
      } catch (error) {
        console.error("Error tailoring resume:", error);
        toast({
          title: "Error",
          description: "Failed to tailor resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProcessingResume((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    };
    input.click();
  };

  const handleGenerateCoverLetter = async (job: JobResult, index: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate cover letters.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setProcessingCoverLetter((prev) => new Set(prev).add(index));

      try {
        const base64Resume = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const response = await fetch(
          "https://primary-production-800d.up.railway.app/webhook-test/generate-cover-letter",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resume: base64Resume,
              jobDescription: job.descriptionText,
              companyName: job.companyName,
              positionTitle: job.title,
              fileType: file.type === "application/pdf" ? "pdf" : "docx",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate cover letter");
        }

        const coverLetterUrl = await response.text();

        if (coverLetterUrl) {
          const { error } = await supabase.from("cover_letters").insert({
            user_id: user.id,
            job_description: job.descriptionText,
            company_name: job.companyName,
            position_title: job.title,
            cover_letter_url: coverLetterUrl,
            original_resume_name: file.name,
            file_type: "pdf",
          });

          if (error) {
            console.error("Error saving cover letter:", error);
          }

          const a = document.createElement("a");
          a.href = coverLetterUrl;
          a.download = `cover-letter-${job.companyName}-${job.title}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          toast({
            title: "Cover Letter Generated! 🎉",
            description:
              "Your personalized cover letter has been generated and downloaded!",
          });
        }
      } catch (error) {
        console.error("Error generating cover letter:", error);
        toast({
          title: "Error",
          description: "Failed to generate cover letter. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProcessingCoverLetter((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    };
    input.click();
  };

  // FIXED ISSUE 1: Enhanced job removal from results when applied
  const handleAppliedChange = async (
    job: JobResult,
    index: number,
    checked: boolean
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to mark jobs as applied.",
        variant: "destructive",
      });
      return;
    }

    if (checked) {
      setAppliedJobs((prev) => new Set(prev).add(index));
      setApplyingJobs((prev) => new Set(prev).add(index));

      try {
        const appliedJobData = {
          user_id: user.id,
          job_title: job.title || "Unknown Job",
          company_name: job.companyName || "Unknown Company",
          job_location: job.location || "Location Not Available",
          job_link: job.jobLink || null,
          company_linkedin_url: job.companyLinkedinUrl || null,
          posted_at: job.postedAt || new Date().toISOString().slice(0, 10),
          apply_url: job.applyUrl || "",
          job_description: job.descriptionText || null,
          seniority_level: job.seniorityLevel || null,
          employment_type: job.employmentType || null,
          job_function: job.jobFunction || null,
          industries: job.industries || null,
        };

        const { error } = await supabase
          .from("applied_jobs")
          .insert(appliedJobData);

        if (error) {
          throw error;
        }

        // FIXED: Immediately remove job from results using uniqueId for better tracking
        setJobResults((prevResults) => {
          return prevResults.filter((_, jobIndex) => jobIndex !== index);
        });

        // Also remove from any saved jobs state if it was saved
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });

        toast({
          title: "Job Applied Successfully! ✅",
          description: "Job has been moved to your applied jobs list.",
        });
      } catch (error) {
        console.error("Error moving job to applied:", error);
        toast({
          title: "Error",
          description: "Failed to save applied job. Please try again.",
          variant: "destructive",
        });

        // Revert the applied state if there was an error
        setAppliedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      } finally {
        setApplyingJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    }
  };

  const handleShare = (job: JobResult) => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.companyName}`,
        text: `Check out this job opportunity: ${job.title} at ${job.companyName}`,
        url: job.applyUrl,
      });
    } else {
      navigator.clipboard.writeText(job.applyUrl);
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard.",
      });
    }
  };

  const filteredJobs = jobResults.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "company":
        return a.companyName.localeCompare(b.companyName);
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  if (loading) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <JobResultsLoadingSkeleton />
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="hover:bg-blue-500/10 justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/job-finder")}
                  className="hover:bg-blue-500/10 justify-start"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Button>
              </div>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <Search className="w-8 h-8 text-blue-600" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Job Search <span className="gradient-text">Results</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground"
                >
                  {jobResults.length}{" "}
                  {jobResults.length === 1 ? "opportunity" : "opportunities"}{" "}
                  found
                </motion.p>
              </div>

              {/* Job Results Stats */}
              <JobResultsStats jobCount={jobResults.length} />

              {/* Search and Filter Controls */}
              {jobResults.length > 0 && (
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
                      placeholder="Search job results..."
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
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {sortedJobs.length === 0 ? (
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
                        <Search className="w-10 h-10 text-muted-foreground" />
                      </motion.div>

                      <h3 className="text-2xl font-semibold mb-3">
                        {searchTerm ? "No Matching Jobs" : "All Jobs Applied!"}
                      </h3>

                      <p className="text-muted-foreground mb-6">
                        {searchTerm
                          ? `No jobs found matching "${searchTerm}". Try a different search term.`
                          : "Great job! You've applied to all available positions. Start a new search to find more opportunities."}
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
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Search Again
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
                  className="space-y-6"
                >
                  <AnimatePresence>
                    {sortedJobs.map((job, index) => (
                      <JobCard
                        key={
                          job.uniqueId ||
                          `${job.title}-${job.companyName}-${index}`
                        }
                        job={job}
                        index={index}
                        onSaveJob={handleSaveJob}
                        onTailorResume={handleTailorResume}
                        onGenerateCoverLetter={handleGenerateCoverLetter}
                        onAppliedChange={handleAppliedChange}
                        onShare={handleShare}
                        savedJobs={savedJobs}
                        savingJobs={savingJobs}
                        processingResume={processingResume}
                        processingCoverLetter={processingCoverLetter}
                        appliedJobs={appliedJobs}
                        applyingJobs={applyingJobs}
                        user={user}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Search CTA */}
            {sortedJobs.length > 0 && (
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
                      Found what you're looking for?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start a new search to discover more opportunities or
                      refine your current search
                    </p>
                    <Button
                      onClick={() => navigate("/job-finder")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Start New Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobResults;
