import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  FileText,
  Upload,
  Building,
  MapPin,
  Calendar,
  Briefcase,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertCircle,
  Search,
  RefreshCw,
  Clock,
  Users,
  Target,
  Zap,
  Heart,
  Share2,
  Trash2,
  Download,
  Filter,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string | null;
  saved_at: string;
  seniority_level: string | null;
  employment_type: string | null;
  apply_url: string;
  job_link: string | null;
  company_linkedin_url: string | null;
  posted_at: string;
  job_function: string | null;
  industries: string | null;
}

interface JobProcessingState {
  resume: Set<string>;
  coverLetter: Set<string>;
  applying: Set<string>;
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

// Stats Component - Updated with Active Jobs
const TailoringStats = ({
  totalJobs,
  thisWeek,
  activeJobs,
  companies,
}: {
  totalJobs: number;
  thisWeek: number;
  activeJobs: number;
  companies: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  >
    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Briefcase className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">{totalJobs}</div>
        <div className="text-xs text-muted-foreground">Total Jobs</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="w-5 h-5 text-green-500" />
        </div>
        <div className="text-2xl font-bold text-green-600">{thisWeek}</div>
        <div className="text-xs text-muted-foreground">This Week</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
        </div>
        <div className="text-2xl font-bold text-orange-600">{activeJobs}</div>
        <div className="text-xs text-muted-foreground">Active Jobs</div>
      </CardContent>
    </Card>

    <Card className="glass border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div className="text-2xl font-bold text-purple-600">{companies}</div>
        <div className="text-xs text-muted-foreground">Companies</div>
      </CardContent>
    </Card>
  </motion.div>
);

// Enhanced Job Card Component - FIXED BUTTON HOVER STATES
const TailoringJobCard = ({
  job,
  index,
  processing,
  onTailorResume,
  onGenerateCoverLetter,
  onMarkAsApplied,
}: {
  job: SavedJob;
  index: number;
  processing: JobProcessingState;
  onTailorResume: (job: SavedJob) => void;
  onGenerateCoverLetter: (job: SavedJob) => void;
  onMarkAsApplied: (jobId: string, checked: boolean) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
      <Card className="glass border-border/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-4">
          {/* Mark as Applied Checkbox */}
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              id={`applied-${job.id}`}
              checked={false}
              onCheckedChange={(checked) =>
                checked && onMarkAsApplied(job.id, true)
              }
              disabled={processing.applying.has(job.id)}
              className="flex-shrink-0"
            />
            <label
              htmlFor={`applied-${job.id}`}
              className="text-sm font-medium cursor-pointer select-none text-muted-foreground"
            >
              {processing.applying.has(job.id) ? (
                <span className="flex items-center gap-2 text-green-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Moving to Applied Jobs...
                </span>
              ) : (
                "Mark as Applied"
              )}
            </label>
          </div>

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
          </div>

          <div className="flex items-center gap-2 mt-4">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {job.job_location}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
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

          {/* Action Buttons - FIXED HOVER STATES ✅ */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onTailorResume(job)}
                  disabled={processing.resume.has(job.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-200 dark:border-blue-700 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                >
                  {processing.resume.has(job.id) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {processing.resume.has(job.id)
                    ? "Tailoring..."
                    : "Tailor Resume"}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onGenerateCoverLetter(job)}
                  disabled={processing.coverLetter.has(job.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-green-200 dark:border-green-700 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200"
                >
                  {processing.coverLetter.has(job.id) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {processing.coverLetter.has(job.id)
                    ? "Generating..."
                    : "Cover Letter"}
                </Button>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                size="sm"
              >
                <a
                  href={job.apply_url}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OneClickTailoring = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const [processing, setProcessing] = useState<JobProcessingState>({
    resume: new Set(),
    coverLetter: new Set(),
    applying: new Set(),
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED: Move filtered and sorted jobs BEFORE stats calculation
  // Filtered and sorted jobs
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

  // ✅ Statistics calculations - Updated with Active Jobs
  const stats = {
    total: savedJobs.length,
    thisWeek: savedJobs.filter(
      (job) =>
        new Date(job.saved_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    activeJobs: filteredJobs.length, // ✅ Active jobs = currently visible/filtered jobs
    companies: new Set(savedJobs.map((job) => job.company_name)).size,
  };

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
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
        description: "Failed to load saved jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const updateProcessingState = useCallback(
    (
      type: keyof JobProcessingState,
      jobId: string,
      action: "add" | "remove"
    ) => {
      setProcessing((prev) => ({
        ...prev,
        [type]:
          action === "add"
            ? new Set([...prev[type], jobId])
            : new Set([...prev[type]].filter((id) => id !== jobId)),
      }));
    },
    []
  );

  const handleMarkAsApplied = useCallback(
    async (jobId: string, checked: boolean) => {
      if (!checked) return;

      const job = savedJobs.find((j) => j.id === jobId);
      if (!job || !user) return;

      updateProcessingState("applying", jobId, "add");

      try {
        const { error: insertError } = await supabase
          .from("applied_jobs")
          .insert([
            {
              user_id: user.id,
              job_title: job.job_title,
              company_name: job.company_name,
              job_location: job.job_location,
              job_description: job.job_description,
              apply_url: job.apply_url,
              job_link: job.job_link,
              company_linkedin_url: job.company_linkedin_url,
              posted_at: job.posted_at,
              seniority_level: job.seniority_level,
              employment_type: job.employment_type,
              job_function: job.job_function,
              industries: job.industries,
              applied_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;

        const { error: deleteError } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("id", jobId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));

        toast({
          title: "Success",
          description: `${job.job_title} has been moved to Applied Jobs.`,
        });
      } catch (error) {
        console.error("Error moving job to applied:", error);
        toast({
          title: "Error",
          description: "Failed to move job to Applied Jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        updateProcessingState("applying", jobId, "remove");
      }
    },
    [savedJobs, user, toast, updateProcessingState]
  );

  const processFile = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleTailorResume = useCallback(
    async (job: SavedJob) => {
      if (!user) return;

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        updateProcessingState("resume", job.id, "add");

        try {
          const userName = user.email?.split("@")[0] || "User";
          const customFileName = `${userName}_${job.job_title.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}`;
          const base64Resume = await processFile(file);

          const response = await fetch(
            "https://n8n.applyforge.cloud/webhook-test/tailor-resume",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                feature: "one_click_tailors",
                resume: base64Resume,
                jobDescription:
                  job.job_description ||
                  `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
                fileType: file.type === "application/pdf" ? "pdf" : "docx",
              }),
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const iframeHtml = await response.text();

          if (iframeHtml.includes("allowed") && iframeHtml.includes("false")) {
            toast({
              title: "Limit Reached",
              description: "You've reached your limit for this feature.",
              variant: "destructive",
            });
            return;
          }

          const pdfUrlMatch = iframeHtml.match(/srcdoc="([^"]+)"/);
          const tailoredResumeUrl = pdfUrlMatch ? pdfUrlMatch[1] : null;

          if (!tailoredResumeUrl) {
            throw new Error("Could not extract PDF URL from response");
          }

          if (tailoredResumeUrl) {
            const { error } = await supabase.from("tailored_resumes").insert([
              {
                user_id: user.id,
                job_description:
                  job.job_description ||
                  `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
                resume_: tailoredResumeUrl,
                title: customFileName,
                file_type: "pdf",
              },
            ]);

            if (error) {
              console.error("Database insert error:", error);
            }

            const a = document.createElement("a");
            a.href = tailoredResumeUrl;
            a.download = `${customFileName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
              title: "Success",
              description: `Tailored resume "${customFileName}" has been generated and downloaded!`,
            });
          }
        } catch (error) {
          console.error("Error tailoring resume:", error);
          toast({
            title: "Error",
            description:
              "Failed to tailor resume. Please check your connection and try again.",
            variant: "destructive",
          });
        } finally {
          updateProcessingState("resume", job.id, "remove");
        }
      };
      input.click();
    },
    [user, toast, processFile, updateProcessingState]
  );

  const handleGenerateCoverLetter = useCallback(
    async (job: SavedJob) => {
      if (!user) return;

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        updateProcessingState("coverLetter", job.id, "add");

        try {
          const userName = user.email?.split("@")[0] || "User";
          const customFileName = `${userName}_${job.job_title.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}_CoverLetter`;
          const base64Resume = await processFile(file);

          const response = await fetch(
            "https://n8n.applyforge.cloud/webhook-test/generate-cover-letter",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                feature: "cover_letters",
                resume: base64Resume,
                jobDescription:
                  job.job_description ||
                  `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
                companyName: job.company_name,
                positionTitle: job.job_title,
                fileType: file.type === "application/pdf" ? "pdf" : "docx",
              }),
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const iframeHtml = await response.text();

          if (iframeHtml.includes("allowed") && iframeHtml.includes("false")) {
            toast({
              title: "Limit Reached",
              description: "You've reached your limit for this feature.",
              variant: "destructive",
            });
            return;
          }

          const pdfUrlMatch = iframeHtml.match(/srcdoc="([^"]+)"/);
          const coverLetterUrl = pdfUrlMatch ? pdfUrlMatch[1] : null;

          if (!coverLetterUrl) {
            throw new Error("Could not extract PDF URL from response");
          }

          if (coverLetterUrl) {
            const { error } = await supabase.from("cover_letters").insert([
              {
                user_id: user.id,
                job_description:
                  job.job_description ||
                  `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
                company_name: job.company_name,
                position_title: job.job_title,
                cover_letter_url: coverLetterUrl,
                original_resume_name: file.name,
                file_type: "pdf",
              },
            ]);

            if (error) {
              console.error("Database insert error:", error);
            }

            const a = document.createElement("a");
            a.href = coverLetterUrl;
            a.download = `${customFileName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
              title: "Success",
              description: `Cover letter "${customFileName}" has been generated and downloaded!`,
            });
          }
        } catch (error) {
          console.error("Error generating cover letter:", error);
          toast({
            title: "Error",
            description:
              "Failed to generate cover letter. Please check your connection and try again.",
            variant: "destructive",
          });
        } finally {
          updateProcessingState("coverLetter", job.id, "remove");
        }
      };
      input.click();
    },
    [user, toast, processFile, updateProcessingState]
  );

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
                  className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <Zap className="w-8 h-8 text-orange-500" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">
                  Authentication Required
                </h3>
                <p className="text-muted-foreground mb-6">
                  Please log in to access one-click tailoring features.
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mb-6 hover:bg-orange-500/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <Zap className="w-8 h-8 text-orange-600" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  One-Click{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Tailoring
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground"
                >
                  Tailor resumes and generate cover letters for your saved jobs
                  in single click
                </motion.p>
              </div>

              {/* Statistics */}
              <TailoringStats
                totalJobs={stats.total}
                thisWeek={stats.thisWeek}
                activeJobs={stats.activeJobs}
                companies={stats.companies}
              />

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
                      placeholder="Search jobs to tailor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                          : "You haven't saved any jobs yet. Start by finding and saving jobs you're interested in!"}
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
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Find Jobs to Save
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
                  {sortedJobs.map((job, index) => (
                    <TailoringJobCard
                      key={job.id}
                      job={job}
                      index={index}
                      processing={processing}
                      onTailorResume={handleTailorResume}
                      onGenerateCoverLetter={handleGenerateCoverLetter}
                      onMarkAsApplied={handleMarkAsApplied}
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
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                    <h3 className="text-xl font-semibold mb-2">
                      Ready to tailor more applications?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Continue your job search and save more positions to tailor
                    </p>
                    <Button
                      onClick={() => navigate("/job-finder")}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Find More Jobs
                    </Button>
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

export default OneClickTailoring;
