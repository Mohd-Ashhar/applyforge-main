import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Upload,
  Building,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  Loader2,
  Search,
  Target,
  Heart,
  Filter,
  Plus,
  Sparkles,
  Bot,
  Shield,
  Eye,
  Crown,
  Wand2,
  LucideRocket,
  MoreVertical,
  Trash2,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { Helmet } from "react-helmet-async";

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
  deleting: Set<string>; // Added for delete loading state
}

interface GenerationStatus {
  resumeUrl?: string;
  coverLetterUrl?: string;
}

const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg"
      >
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/20 rounded-xl"
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

const TailoringJobCard = memo(
  ({
    job,
    index,
    processing,
    onTailorResume,
    onGenerateCoverLetter,
    onMarkAsApplied,
    generationStatus,
    onViewOrDownload,
    onDeleteJob,
    onShareJob,
  }: {
    job: SavedJob;
    index: number;
    processing: JobProcessingState;
    onTailorResume: (job: SavedJob) => void;
    onGenerateCoverLetter: (job: SavedJob) => void;
    onMarkAsApplied: (jobId: string, checked: boolean) => void;
    generationStatus: GenerationStatus;
    onViewOrDownload: (url: string, fileName: string) => void;
    onDeleteJob: (jobId: string) => void;
    onShareJob: (job: SavedJob) => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const getCompanyInitials = useCallback((companyName: string) => {
      return companyName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }, []);

    const formatDate = useCallback((dateString: string) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }, []);

    const isDeleting = processing.deleting.has(job.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        <Card
          onClick={() => setIsExpanded((prev) => !prev)}
          className="cursor-pointer bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50 hover:border-rose-400/40 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col"
        >
          <CardHeader className="pb-3 sm:pb-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500/20 via-red-500/15 to-orange-500/20 flex items-center justify-center font-semibold text-rose-400 border border-rose-500/20 flex-shrink-0 text-xs sm:text-sm"
                  animate={{ rotate: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getCompanyInitials(job.company_name)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold text-white group-hover:text-rose-400 transition-colors">
                    {job.job_title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 font-medium truncate">
                      {job.company_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 sm:pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 truncate">
                  {(() => {
                    if (!job.job_location) return "Location not specified";
                    try {
                      return JSON.parse(job.job_location).join(", ");
                    } catch (e) {
                      return job.job_location;
                    }
                  })()}
                </span>
              </div>

              {/* --- BADGES MOVED TO COLLAPSED VIEW --- */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {job.employment_type && (
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs whitespace-nowrap">
                    <Briefcase className="w-2 h-2 sm:w-3 sm:h-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">
                      {(() => {
                        if (!job.employment_type) return "";
                        try {
                          return JSON.parse(job.employment_type).join(", ");
                        } catch (e) {
                          return job.employment_type;
                        }
                      })()}
                    </span>
                  </Badge>
                )}
                {job.seniority_level && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs whitespace-nowrap">
                    <Target className="w-2 h-2 sm:w-3 sm:h-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">
                      {(() => {
                        if (!job.seniority_level) return "";
                        try {
                          return JSON.parse(job.seniority_level).join(", ");
                        } catch (e) {
                          return job.seniority_level;
                        }
                      })()}
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* --- EXPANDABLE CONTENT & ACTIONS --- */}
          <CardContent className="pt-0">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                    {job.job_description && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2 text-slate-200">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400 flex-shrink-0" />
                          Job Description
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-24 overflow-y-auto pr-2">
                          {job.job_description}
                        </p>
                      </div>
                    )}

                    {formatDate(job.posted_at) && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Posted {formatDate(job.posted_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* --- NEW ACTION PANEL --- */}
                  <div className="border-t border-slate-700/50 mt-3 sm:mt-4 pt-3 sm:pt-4 space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
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
                        className="text-xs sm:text-sm font-medium cursor-pointer select-none text-slate-400"
                      >
                        {processing.applying.has(job.id) ? (
                          <span className="flex items-center gap-2 text-green-400">
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          "Mark as Applied"
                        )}
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {generationStatus.resumeUrl ? (
                        <Button
                          onClick={() =>
                            onViewOrDownload(
                              generationStatus.resumeUrl,
                              `${job.company_name}_resume.pdf`
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="w-full bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white h-9 text-xs sm:text-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Resume
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onTailorResume(job)}
                          disabled={processing.resume.has(job.id)}
                          variant="outline"
                          size="sm"
                          className="w-full bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white h-9 text-xs sm:text-sm"
                        >
                          {processing.resume.has(job.id) ? (
                            <Loader2 className="w-4 mr-2 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 mr-2" />
                          )}
                          {processing.resume.has(job.id)
                            ? "Tailoring..."
                            : "Tailor Resume"}
                        </Button>
                      )}

                      {generationStatus.coverLetterUrl ? (
                        <Button
                          onClick={() =>
                            onViewOrDownload(
                              generationStatus.coverLetterUrl,
                              `${job.company_name}_cover_letter.pdf`
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="w-full bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white h-9 text-xs sm:text-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Cover
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onGenerateCoverLetter(job)}
                          disabled={processing.coverLetter.has(job.id)}
                          variant="outline"
                          size="sm"
                          className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white h-9 text-xs sm:text-sm"
                        >
                          {processing.coverLetter.has(job.id) ? (
                            <Loader2 className="w-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="w-4 mr-2" />
                          )}
                          {processing.coverLetter.has(job.id)
                            ? "Crafting..."
                            : "Cover Letter"}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        className="w-full flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white h-10 text-xs sm:text-sm"
                        size="sm"
                      >
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          Apply Now
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-slate-600 bg-slate-700/50 h-10 w-10"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700 text-white"
                        >
                          <DropdownMenuItem onSelect={() => onShareJob(job)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => onDeleteJob(job.id)}
                            disabled={isDeleting}
                            className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
                          >
                            {isDeleting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete Job</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

TailoringJobCard.displayName = "TailoringJobCard";

const InstantTailoringAgent = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "title">("date");
  const [processing, setProcessing] = useState<JobProcessingState>({
    resume: new Set(),
    coverLetter: new Set(),
    applying: new Set(),
    deleting: new Set(),
  });
  const [generationStatus, setGenerationStatus] = useState<
    Record<string, GenerationStatus>
  >({});
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { usage } = useUsageTracking();
  const fetchedForUserId = useRef<string | null>(null);

  const updateProcessingState = useCallback(
    (
      type: keyof JobProcessingState,
      jobId: string,
      action: "add" | "remove"
    ) => {
      setProcessing((prev) => {
        const newSet = new Set(prev[type]);
        if (action === "add") {
          newSet.add(jobId);
        } else {
          newSet.delete(jobId);
        }
        return { ...prev, [type]: newSet };
      });
    },
    []
  );

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user]);

  const filteredJobs = useMemo(
    () =>
      savedJobs.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.job_location.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [savedJobs, searchTerm]
  );

  const sortedJobs = useMemo(
    () =>
      [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
          case "company":
            return a.company_name.localeCompare(b.company_name);
          case "title":
            return a.job_title.localeCompare(b.job_title);
          case "date":
          default:
            return (
              new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
            );
        }
      }),
    [filteredJobs, sortBy]
  );

  // --- NEW HANDLER FUNCTIONS ---

  const handleDeleteJob = useCallback(
    async (jobId: string) => {
      if (!user) return;

      updateProcessingState("deleting", jobId, "add");

      try {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("id", jobId)
          .eq("user_id", user.id);

        if (error) throw error;

        setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        toast({
          title: "Job Deleted 👋",
          description: "The job has been removed from your saved list.",
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Deletion Failed",
          description: "Could not delete the job. Please try again.",
          variant: "destructive",
        });
        updateProcessingState("deleting", jobId, "remove");
      }
      // No 'finally' block needed, as we only want to remove the spinner on error
    },
    [user, toast, updateProcessingState]
  );

  const handleShareJob = useCallback(
    (job: SavedJob) => {
      const shareUrl = job.apply_url || job.job_link;
      if (!shareUrl) {
        toast({
          title: "No Link Available",
          description: "This job does not have a shareable link.",
          variant: "destructive",
        });
        return;
      }

      if (navigator.share) {
        navigator.share({
          title: `${job.job_title} at ${job.company_name}`,
          text: `Check out this job opportunity: ${job.job_title} at ${job.company_name}`,
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied ✅",
          description: "Job application link copied to clipboard.",
        });
      }
    },
    [toast]
  );

  const checkGenerationStatus = useCallback(
    async (jobs: SavedJob[]) => {
      if (!user || jobs.length === 0) return;

      try {
        const [resumesRes, coverLettersRes] = await Promise.all([
          supabase
            .from("tailored_resumes")
            .select("job_description, resume_data")
            .eq("user_id", user.id),
          supabase
            .from("cover_letters")
            .select("job_description, cover_letter_url")
            .eq("user_id", user.id),
        ]);

        if (resumesRes.error) throw resumesRes.error;
        if (coverLettersRes.error) throw coverLettersRes.error;

        const resumeMap = new Map<string, string>();
        resumesRes.data?.forEach((resume) => {
          if (resume.job_description && resume.resume_data) {
            resumeMap.set(resume.job_description, resume.resume_data);
          }
        });

        const coverLetterMap = new Map<string, string>();
        coverLettersRes.data?.forEach((cl) => {
          if (cl.job_description && cl.cover_letter_url) {
            coverLetterMap.set(cl.job_description, cl.cover_letter_url);
          }
        });

        const newStatus: Record<string, GenerationStatus> = {};
        jobs.forEach((job) => {
          const jobDescKey =
            job.job_description ||
            `Job Title: ${job.job_title}\nCompany: ${job.company_name}`;
          const resumeUrl = resumeMap.get(jobDescKey);
          const coverLetterUrl = coverLetterMap.get(jobDescKey);

          if (resumeUrl || coverLetterUrl) {
            newStatus[job.id] = {
              ...(resumeUrl && { resumeUrl }),
              ...(coverLetterUrl && { coverLetterUrl }),
            };
          }
        });

        setGenerationStatus((prevStatus) => ({ ...prevStatus, ...newStatus }));
      } catch (error) {
        console.error("Error checking generation status:", error);
        toast({
          title: "Agent Sync Error",
          description:
            "Could not verify existing documents. Some items may appear as not generated.",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  const fetchSavedJobs = useCallback(async () => {
    if (!user) return;

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
        title: "Agent Error",
        description: "Failed to load saved jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user && user.id !== fetchedForUserId.current) {
      fetchSavedJobs();
      fetchedForUserId.current = user.id;
    }
  }, [user, fetchSavedJobs]);

  useEffect(() => {
    if (savedJobs.length > 0) {
      checkGenerationStatus(savedJobs);
    }
  }, [savedJobs, checkGenerationStatus]);

  const getCurrentUserVersion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return 0;
        }
        return 0;
      }

      if (data && "version" in data && typeof data.version === "number") {
        return data.version;
      }

      return 0;
    } catch (error) {
      console.error("Error in getCurrentUserVersion:", error);
      return 0;
    }
  };

  const handleDownload = useCallback(
    async (url: string, fileName: string) => {
      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error downloading file:", error);
        toast({
          title: "Download Error",
          description: "Could not download the file. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
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
          title: "Agent Success! ✅",
          description: `${job.job_title} has been moved to Applied Jobs by your agent.`,
        });
      } catch (error) {
        console.error("Error moving job to applied:", error);
        toast({
          title: "Agent Error",
          description: "Failed to process application. Please try again.",
          variant: "destructive",
        });
      } finally {
        updateProcessingState("applying", jobId, "remove");
      }
    },
    [savedJobs, user, toast, updateProcessingState]
  );

  const handleTailorResume = useCallback(
    async (job: SavedJob) => {
      if (!user) return;

      if (usage?.plan_type === "Free") {
        toast({
          title: "Upgrade to Activate Your Agent 🚀",
          description:
            "The Instant Generation Agent is a premium feature. Please upgrade your plan to use it.",
          variant: "destructive",
          action: (
            <Button size="sm" onClick={() => navigate("/pricing")}>
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        updateProcessingState("resume", job.id, "add");
        toast({
          title: "AI Agent at Work 🧠",
          description:
            "Your resume is being tailored in the background. We'll notify you when it's ready!",
        });

        try {
          const currentVersion = await getCurrentUserVersion(user.id);
          const { error: usageError } = await supabase.rpc(
            "increment_usage_secure",
            {
              p_target_user_id: user.id,
              p_usage_type: "one_click_tailors_used",
              p_increment_amount: 1,
              p_current_version: currentVersion,
              p_audit_metadata: {
                action: "instant_tailoring_agent",
                job_role: job.job_title,
                industry: job.industries || "General",
                file_type: file.type === "application/pdf" ? "pdf" : "docx",
                file_size: file.size,
              },
            }
          );

          if (usageError) {
            if (usageError.message.includes("Usage limit exceeded")) {
              toast({
                title: "Agent Limit Reached 🤖",
                description:
                  "You've reached your Instant Generation Agent limit. Upgrade to activate unlimited tailoring!",
                variant: "destructive",
                action: (
                  <Button
                    size="sm"
                    onClick={() => navigate("/pricing")}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade Plan
                  </Button>
                ),
              });
              return;
            }

            if (usageError.message.includes("version_conflict")) {
              toast({
                title: "Agent Sync Issue 🔄",
                description: "Your agent data was updated. Please try again.",
                variant: "destructive",
              });
              return;
            }

            console.error("Usage increment error:", usageError);
            toast({
              title: "Agent Activation Failed ⚠️",
              description:
                "Unable to activate your Instant Generation Agent. Please try again.",
              variant: "destructive",
            });
            return;
          }

          const userName = user.email?.split("@")[0] || "User";
          const customFileName = `${userName}_${job.job_title.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}`;

          const formData = new FormData();

          formData.append("feature", "instant_tailoring_agent");
          formData.append("jobRole", job.job_title);
          formData.append("industry", job.industries || "General");
          formData.append(
            "jobDescription",
            job.job_description ||
              `Job Title: ${job.job_title}\nCompany: ${job.company_name}`
          );
          formData.append(
            "fileType",
            file.type === "application/pdf" ? "pdf" : "docx"
          );
          formData.append("resume", file);

          const session = (await supabase.auth.getSession()).data.session;
          if (!session) throw new Error("User not authenticated");

          const response = await fetch(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/instant-resume-proxy`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const tailoredResumeUrl = await response.text();

          if (
            tailoredResumeUrl.includes("allowed") &&
            tailoredResumeUrl.includes("false")
          ) {
            toast({
              title: "Agent Limit Reached 🤖",
              description:
                "You've reached your Instant Generation Agent limit. Upgrade to activate unlimited tailoring!",
              variant: "destructive",
              action: (
                <Button
                  size="sm"
                  onClick={() => navigate("/pricing")}
                  className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Upgrade Plan
                </Button>
              ),
            });
            return;
          }

          if (!tailoredResumeUrl || !tailoredResumeUrl.startsWith("http")) {
            throw new Error("Received an invalid URL from the agent.");
          }

          const { error } = await supabase.from("tailored_resumes").insert([
            {
              user_id: user.id,
              job_description:
                job.job_description ||
                `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
              resume_data: tailoredResumeUrl,
              title: customFileName,
              file_type: "pdf",
            },
          ]);

          if (error) {
            console.error("Database insert error:", error);
          }

          await handleDownload(tailoredResumeUrl, `${job.job_title}.pdf`);

          toast({
            title: "Agent Success! ✨",
            description: `Tailored resume "${job.job_title}" has been generated by your agent!`,
            action: (
              <Button size="sm" onClick={() => navigate("/tailored-resumes")}>
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            ),
          });
          setGenerationStatus((prev) => ({
            ...prev,
            [job.id]: { ...prev[job.id], resumeUrl: tailoredResumeUrl },
          }));
        } catch (error) {
          console.error("Error tailoring resume:", error);
          toast({
            title: "Agent Error 🤖",
            description:
              "Your Instant Generation Agent encountered an issue. Please try again.",
            variant: "destructive",
          });
        } finally {
          updateProcessingState("resume", job.id, "remove");
        }
      };
      input.click();
    },
    [user, toast, updateProcessingState, navigate, usage, handleDownload]
  );

  const handleGenerateCoverLetter = useCallback(
    async (job: SavedJob) => {
      if (!user) return;

      if (usage?.plan_type === "Free") {
        toast({
          title: "Upgrade to Activate Your Agent 🚀",
          description:
            "The Instant Generation Agent is a premium feature. Please upgrade your plan to use it.",
          variant: "destructive",
          action: (
            <Button size="sm" onClick={() => navigate("/pricing")}>
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return;
      }

      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.docx";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        updateProcessingState("coverLetter", job.id, "add");
        toast({
          title: "AI Agent is Writing ✍️",
          description:
            "Your cover letter is being crafted in the background. We'll let you know once it's complete!",
        });

        try {
          const currentVersion = await getCurrentUserVersion(user.id);
          const { error: usageError } = await supabase.rpc(
            "increment_usage_secure",
            {
              p_target_user_id: user.id,
              p_usage_type: "one_click_tailors_used",
              p_increment_amount: 1,
              p_current_version: currentVersion,
              p_audit_metadata: {
                action: "cover_tailoring_agent",
                company: job.company_name,
                position: job.job_title,
                industry: job.industries || "General",
              },
            }
          );

          if (usageError) {
            if (usageError.message.includes("Usage limit exceeded")) {
              toast({
                title: "Agent Limit Reached 🤖",
                description:
                  "You've reached your Instant Generation Agent limit. Upgrade to activate unlimited crafting!",
                variant: "destructive",
                action: (
                  <Button
                    size="sm"
                    onClick={() => navigate("/pricing")}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade Plan
                  </Button>
                ),
              });
              return;
            }

            if (usageError.message.includes("version_conflict")) {
              toast({
                title: "Agent Sync Issue 🔄",
                description: "Your agent data was updated. Please try again.",
                variant: "destructive",
              });
              return;
            }

            console.error("Usage increment error:", usageError);
            toast({
              title: "Agent Activation Failed ⚠️",
              description:
                "Unable to activate your Instant Generation Agent. Please try again.",
              variant: "destructive",
            });
            return;
          }

          const userName = user.email?.split("@")[0] || "User";
          const customFileName = `${userName}_${job.job_title.replace(
            /[^a-zA-Z0-9]/g,
            "_"
          )}_CoverLetter`;

          const formData = new FormData();

          formData.append("feature", "instant_generation_agent");
          formData.append(
            "jobDescription",
            job.job_description ||
              `Job Title: ${job.job_title}\nCompany: ${job.company_name}`
          );
          formData.append("industry", job.industries || "General");
          formData.append("companyName", job.company_name);
          formData.append("positionTitle", job.job_title);
          formData.append("resume", file);
          formData.append(
            "fileType",
            file.type === "application/pdf" ? "pdf" : "docx"
          );

          const session = (await supabase.auth.getSession()).data.session;
          if (!session) throw new Error("User not authenticated");

          const response = await fetch(
            `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/instant-cover-letter-proxy`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const coverLetterUrl = await response.text();

          if (
            coverLetterUrl.includes("allowed") &&
            coverLetterUrl.includes("false")
          ) {
            toast({
              title: "Agent Limit Reached 🤖",
              description:
                "You've reached your Instant Generation Agent limit. Upgrade to activate unlimited crafting!",
              variant: "destructive",
              action: (
                <Button
                  size="sm"
                  onClick={() => navigate("/pricing")}
                  className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Upgrade Plan
                </Button>
              ),
            });
            return;
          }

          if (!coverLetterUrl || !coverLetterUrl.startsWith("http")) {
            throw new Error("Received an invalid URL from the agent.");
          }

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

          await handleDownload(coverLetterUrl, `${job.company_name}.pdf`);

          toast({
            title: "Agent Success! 📋",
            description: `Cover letter "${job.company_name}" has been crafted by your agent!`,
            action: (
              <Button
                size="sm"
                onClick={() => navigate("/saved-cover-letters")}
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            ),
          });
          setGenerationStatus((prev) => ({
            ...prev,
            [job.id]: { ...prev[job.id], coverLetterUrl: coverLetterUrl },
          }));
        } catch (error) {
          console.error("Error generating cover letter:", error);
          toast({
            title: "Agent Error 🤖",
            description:
              "Your Instant Generation Agent encountered an issue. Please try again.",
            variant: "destructive",
          });
        } finally {
          updateProcessingState("coverLetter", job.id, "remove");
        }
      };
      input.click();
    },
    [user, toast, updateProcessingState, navigate, usage, handleDownload]
  );

  if (!user) {
    return (
      <TooltipProvider>
        <Helmet>
          <title>
            One-Click Resume Tailoring | Instantly Apply to Saved Jobs
          </title>
          <meta
            name="description"
            content="Tailor your resume and cover letter for any saved job in a single click. ApplyForge's One-Click Tailoring streamlines your application process, saving you time and effort."
          />
          <link
            rel="canonical"
            href="https://applyforge.ai/one-click-tailoring"
          />
        </Helmet>

        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="w-full max-w-md bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-500/20 via-red-500/15 to-orange-500/20 rounded-full flex items-center justify-center mb-4 border border-rose-500/20"
                >
                  <Wand2 className="w-8 h-8 text-rose-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to activate your Instant Generation Agent.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
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
        <DashboardHeader />

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500/20 via-red-500/15 to-orange-500/20 rounded-full flex items-center justify-center border border-rose-500/20 backdrop-blur-xl"
                  >
                    <LucideRocket className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Tailoring
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Instant Generation{" "}
                    <span className="bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                      Agent
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
                      <span className="text-rose-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent tailoring agent is ready to optimize your
                      applications instantly
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      AI-powered resume tailoring and cover letter crafting for
                      your saved jobs in seconds
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Wand2,
                    title: "Instant Tailoring",
                    desc: "AI-powered resume optimization",
                  },
                  {
                    icon: FileText,
                    title: "Cover Letters",
                    desc: "Personalized letter generation",
                  },
                  {
                    icon: Bot,
                    title: "One-Click Process",
                    desc: "Complete automation",
                  },
                  {
                    icon: Shield,
                    title: "Secure Processing",
                    desc: "Your data stays private",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {savedJobs.length > 0 && (
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
                    placeholder="Search jobs to tailor with your agent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-600 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
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
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm h-10 sm:h-11"
                  >
                    <Filter className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Sort by </span>
                    <span className="truncate">
                      {sortBy === "date"
                        ? "Date"
                        : sortBy === "company"
                        ? "Company"
                        : "Title"}
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedJobs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 sm:py-16"
                >
                  <Card className="bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50 shadow-xl max-w-lg mx-auto">
                    <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-rose-500/20"
                      >
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
                      </motion.div>

                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">
                        {searchTerm
                          ? "No Matching Saved Jobs"
                          : "No Saved Jobs Yet"}
                      </h3>

                      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        {searchTerm
                          ? `No saved jobs found matching "${searchTerm}". Try a different search term.`
                          : "You haven't saved any jobs yet. Start by finding and saving jobs to let your agent tailor them!"}
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
                            onClick={() => navigate("/job-finder")}
                            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Discover Jobs to Save
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
                  <AnimatePresence>
                    {sortedJobs.map((job, index) => (
                      <TailoringJobCard
                        key={job.id}
                        job={job}
                        index={index}
                        processing={processing}
                        onTailorResume={handleTailorResume}
                        onGenerateCoverLetter={handleGenerateCoverLetter}
                        onMarkAsApplied={handleMarkAsApplied}
                        generationStatus={generationStatus[job.id] || {}}
                        onViewOrDownload={handleDownload}
                        onDeleteJob={handleDeleteJob}
                        onShareJob={handleShareJob}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {sortedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 sm:mt-12 text-center"
              >
                <Card className="bg-gradient-to-br from-rose-500/5 via-red-500/5 to-orange-500/10 backdrop-blur-xl border border-slate-700/50 shadow-lg">
                  <CardContent className="p-6 sm:p-8">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-rose-400" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                      Ready to tailor more applications?
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm sm:text-base">
                      Let your agent discover and save more positions to tailor
                      instantly
                    </p>
                    <Button
                      onClick={() => navigate("/job-finder")}
                      className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Discover More Jobs
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

export default InstantTailoringAgent;
