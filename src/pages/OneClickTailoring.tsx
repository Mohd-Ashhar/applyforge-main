import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

const OneClickTailoring = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<JobProcessingState>({
    resume: new Set(),
    coverLetter: new Set(),
    applying: new Set(),
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
        // Add to applied_jobs table with proper data structure
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

        // Remove from saved jobs
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
            "https://primary-production-800d.up.railway.app/webhook-test/tailor-resume",
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

          const responseData = await response.json();

          if (responseData.allowed === false) {
            toast({
              title: "Limit Reached",
              description:
                responseData.message ||
                "You've reached your limit for this feature.",
              variant: "destructive",
            });
            return;
          }

          const tailoredResumeUrl = responseData.url || responseData;

          if (tailoredResumeUrl) {
            // Fixed insert call - wrap in array and ensure all required fields
            const { error } = await supabase.from("tailored_resumes").insert([
              {
                user_id: user.id,
                job_description:
                  job.job_description ||
                  `Job Title: ${job.job_title}\nCompany: ${job.company_name}`,
                resume_: tailoredResumeUrl, // Make sure this matches your DB column name
                title: customFileName,
                file_type: "pdf",
              },
            ]);

            if (error) {
              console.error("Database insert error:", error);
              // Continue with download even if DB save fails
            }

            // Download file
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
            "https://primary-production-800d.up.railway.app/webhook-test/generate-cover-letter",
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

          const responseData = await response.json();

          if (responseData.allowed === false) {
            toast({
              title: "Limit Reached",
              description:
                responseData.message ||
                "You've reached your limit for this feature.",
              variant: "destructive",
            });
            return;
          }

          const coverLetterUrl = responseData.url || responseData;

          if (coverLetterUrl) {
            // Fixed insert call - wrap in array and ensure proper field names
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
              // Continue with download even if DB save fails
            }

            // Download file
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Authentication Required
            </h3>
            <p className="text-muted-foreground mb-6">
              Please log in to access one-click tailoring features.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-green-500/20 text-green-500 mb-6">
              <Briefcase className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              One-Click{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Tailoring
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailor resumes and generate cover letters for your saved jobs
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Loading your saved jobs...
              </p>
            </div>
          ) : savedJobs.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-12 space-y-6">
                <Building className="h-16 w-16 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">No Saved Jobs</h3>
                  <p className="text-muted-foreground text-lg">
                    You haven't saved any jobs yet. Start by searching for jobs
                    and saving the ones you're interested in.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/job-finder")}
                  size="lg"
                  className="mt-6"
                >
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="group hover:shadow-lg transition-all duration-200 flex flex-col h-full"
                >
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Checkbox
                            id={`applied-${job.id}`}
                            checked={false}
                            onCheckedChange={(checked) =>
                              checked && handleMarkAsApplied(job.id, true)
                            }
                            disabled={processing.applying.has(job.id)}
                            className="flex-shrink-0"
                          />
                          <label
                            htmlFor={`applied-${job.id}`}
                            className="text-sm font-medium cursor-pointer select-none"
                          >
                            {processing.applying.has(job.id) ? (
                              <span className="flex items-center gap-2 text-blue-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Moving to Applied Jobs...
                              </span>
                            ) : (
                              "Mark as Applied"
                            )}
                          </label>
                        </div>

                        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors leading-tight">
                          {job.job_title}
                        </CardTitle>

                        <div className="space-y-2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium truncate">
                              {job.company_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {job.job_location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge variant="secondary" className="flex-shrink-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(job.saved_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {job.seniority_level && (
                        <Badge variant="outline">{job.seniority_level}</Badge>
                      )}
                      {job.employment_type && (
                        <Badge variant="outline">{job.employment_type}</Badge>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleTailorResume(job)}
                          disabled={processing.resume.has(job.id)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
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

                        <Button
                          onClick={() => handleGenerateCoverLetter(job)}
                          disabled={processing.coverLetter.has(job.id)}
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
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
                      </div>

                      <Button
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneClickTailoring;
