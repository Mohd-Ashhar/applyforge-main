import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  FileText,
  Briefcase,
  Eye,
  Download,
  Trash2,
  Info,
  Shield,
  Clock,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageTracking } from "@/hooks/useUsageTracking";

// Fixed Interface Definitions
interface GeneratedResume {
  id: string;
  title: string;
  resume_data: string;
  file_type: string;
  created_at: string;
}

interface FormValidation {
  jobRole: boolean;
  jobDescription: boolean;
  resume: boolean;
}

// Enhanced Loading Overlay with AI Resume Processing Stages
const ResumeLoadingOverlay = ({
  show,
  stage = 0,
}: {
  show: boolean;
  stage?: number;
}) => {
  const stages = [
    "Analyzing your current resume...",
    "Processing job requirements...",
    "Identifying key skills and keywords...",
    "Optimizing for ATS compatibility...",
    "Tailoring content and formatting...",
    "Finalizing your optimized resume...",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/80"
        >
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground tracking-wide mb-4">
              {stages[stage] || stages[0]}
            </p>
            <Progress value={(stage + 1) * 16.67} className="w-64 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((stage + 1) * 16.67)}% Complete
            </p>
          </motion.div>

          <motion.div
            className="flex gap-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Shield className="w-4 h-4" />
            <span>Your resume data is encrypted and secure</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced File Upload Component with Mobile Optimization
const FileUploadArea = ({
  onFileSelect,
  selectedFile,
  error,
}: {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  error?: boolean;
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    );

    if (validFile) {
      onFileSelect(validFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-4 md:p-6 text-center cursor-pointer transition-colors
          ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }
          ${error ? "border-destructive" : ""}
          ${selectedFile ? "border-green-500 bg-green-50/5" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          className="hidden"
          id="resume-upload"
        />

        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 md:gap-3"
          >
            <FileCheck className="w-6 h-6 md:w-8 md:h-8 text-green-500 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium text-green-700 text-sm md:text-base truncate max-w-[200px] md:max-w-none">
                {selectedFile.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)} • Click to change
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drop your resume here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, DOCX • Max 10MB
            </p>
          </>
        )}

        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center"
          >
            <p className="text-primary font-medium">Drop your resume here!</p>
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Please upload your resume
        </motion.p>
      )}
    </div>
  );
};

const AIResumeTailor = () => {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [currentGeneratedResume, setCurrentGeneratedResume] =
    useState<GeneratedResume | null>(null);
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [validation, setValidation] = useState<FormValidation>({
    jobRole: true,
    jobDescription: true,
    resume: true,
  });
  const [industry, setIndustry] = useState("");
  const [resumeStyle, setResumeStyle] = useState("modern");
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshUsage } = useUsageTracking();

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Marketing",
    "Sales",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Engineering",
    "Design",
    "Media",
    "Legal",
    "Real Estate",
    "Other",
  ];

  const resumeStyles = [
    { value: "modern", label: "Modern & Clean" },
    { value: "traditional", label: "Traditional & Professional" },
    { value: "creative", label: "Creative & Dynamic" },
    { value: "technical", label: "Technical & Detailed" },
  ];

  const validateForm = (): boolean => {
    const newValidation = {
      jobRole: jobRole.trim().length > 0,
      jobDescription: jobDescription.trim().length > 100,
      resume: resume !== null,
    };

    setValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };

  const simulateLoadingStages = () => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 3000);
    });
  };

  // FIXED: Helper function with proper error handling
  const getCurrentUserVersion = async (userId: string) => {
    try {
      // Check if user_usage record exists first
      const { data, error } = await supabase
        .from("user_usage")
        .select("*") // Select all columns to see what's available
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error getting user usage record:", error);

        // If no record exists, return 0 as default version
        if (error.code === "PGRST116") {
          console.log("No user_usage record found, using default version 0");
          return 0;
        }

        return 0; // Default version for any error
      }

      // Check if the version column exists on the returned data
      if (data && "version" in data && typeof data.version === "number") {
        return data.version;
      }

      // If version column doesn't exist, return 0 as default
      console.log(
        "Version column not found in user_usage table, using default version 0"
      );
      return 0;
    } catch (error) {
      console.error("Error in getCurrentUserVersion:", error);
      return 0;
    }
  };

  const loadSampleData = () => {
    setJobRole("Senior Software Engineer");
    setIndustry("technology");
    setJobDescription(`We are seeking an experienced Senior Software Engineer to join our growing engineering team. The ideal candidate will have 5+ years of experience in full-stack development and will be responsible for architecting scalable solutions.

Key Responsibilities:
• Lead the design and development of complex software systems
• Mentor junior developers and conduct code reviews
• Collaborate with product managers and designers to deliver features
• Optimize application performance and ensure scalability
• Participate in architectural decisions and technical planning

Required Skills:
• 5+ years of software development experience
• Proficiency in JavaScript, Python, or Java
• Experience with React, Node.js, and modern frameworks
• Strong understanding of databases (SQL and NoSQL)
• Experience with cloud platforms (AWS, GCP, or Azure)
• Knowledge of microservices architecture and containerization
• Excellent problem-solving and communication skills

Preferred Qualifications:
• Bachelor's degree in Computer Science or related field
• Experience with DevOps practices and CI/CD pipelines
• Knowledge of machine learning or AI technologies
• Previous experience in a senior or lead role`);

    toast({
      title: "Sample Data Loaded",
      description:
        "Form filled with example data. Don't forget to upload your resume!",
    });
  };

  // FIXED: Main handler with proper usage limit enforcement
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please Complete All Required Fields",
        description:
          "Job role, detailed job description (min 100 characters), and resume are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to tailor resumes.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      // ✅ CRITICAL FIX: Check usage limits FIRST
      const currentVersion = await getCurrentUserVersion(user.id);

      const { data: usageData, error: usageError } = await supabase.rpc(
        "increment_usage_secure",
        {
          p_target_user_id: user.id,
          p_usage_type: "resume_tailors_used",
          p_increment_amount: 1,
          p_current_version: currentVersion,
          p_audit_metadata: {
            action: "resume_tailor",
            job_role: jobRole,
            industry: industry || "unspecified",
            resume_style: resumeStyle,
            file_type: resume!.type === "application/pdf" ? "pdf" : "docx",
            file_size: resume!.size,
          },
        }
      );

      if (usageError) {
        // Handle specific limit exceeded error
        if (usageError.message.includes("Usage limit exceeded")) {
          toast({
            title: "Usage Limit Reached 📊",
            description:
              "You've reached your resume tailoring limit for your current plan. Upgrade to continue creating unlimited tailored resumes!",
            variant: "destructive",
            action: (
              <Button
                size="sm"
                onClick={() => navigate("/pricing")}
                className="bg-primary hover:bg-primary/90"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Upgrade Plan
              </Button>
            ),
          });
          return;
        }

        // Handle version conflict error
        if (usageError.message.includes("version_conflict")) {
          toast({
            title: "Please Try Again",
            description:
              "Your usage data was updated by another session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Handle other usage-related errors
        console.error("Usage increment error:", usageError);
        toast({
          title: "Usage Check Failed",
          description: "Unable to verify your usage limits. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // ✅ Only proceed with resume tailoring if usage increment succeeded
      console.log(
        "Usage incremented successfully, proceeding with resume tailoring"
      );

      // Convert file to base64
      const base64Resume = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // Remove data prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(resume!);
      });

      // Send request to webhook
      const response = await fetch(
        "https://n8n.applyforge.cloud/webhook-test/tailor-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            feature: "resume_tailors",
            resume: base64Resume,
            jobDescription: jobDescription,
            jobIndustry: industry,
            resumeStyle: resumeStyle,
            jobRole: jobRole,
            fileType: resume!.type === "application/pdf" ? "pdf" : "docx",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to tailor resume: ${response.status} ${response.statusText}`
        );
      }

      // Get the iframe HTML as text
      const iframeHtml = await response.text();

      // Check if limit reached (legacy check for API response)
      if (iframeHtml.includes("allowed") && iframeHtml.includes("false")) {
        toast({
          title: "Limit Reached",
          description: "You've reached your limit for this feature.",
          variant: "destructive",
        });
        return;
      }

      // Extract the PDF URL from the srcdoc attribute
      const pdfUrlMatch = iframeHtml.match(/srcdoc="([^"]+)"/);
      const tailoredResumeUrl = pdfUrlMatch ? pdfUrlMatch[1] : null;

      if (tailoredResumeUrl) {
        // Get user's name from profile or use email
        let userName = "User";
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            userName = profile.full_name.split(" ")[0];
          } else if (profile?.email) {
            userName = profile.email.split("@")[0];
          }
        } catch (error) {
          console.log("Could not fetch user profile:", error);
        }

        const resumeTitle = `${userName} ${jobRole} Resume`;

        // Store the tailored resume in Supabase
        const { data, error } = await supabase
          .from("tailored_resumes")
          .insert({
            user_id: user.id,
            job_description: jobDescription,
            resume_data: tailoredResumeUrl,
            title: resumeTitle,
            file_type: "pdf",
          })
          .select("id, title, resume_data, file_type, created_at")
          .single();

        if (error) {
          console.error("Error saving tailored resume:", error);
          toast({
            title: "Save Error",
            description:
              "Resume tailored but failed to save. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        // Add to local state for immediate display
        if (data) {
          const newResume: GeneratedResume = {
            id: data.id,
            title: data.title || resumeTitle,
            resume_data: data.resume_data,
            file_type: data.file_type,
            created_at: data.created_at,
          };
          setCurrentGeneratedResume(newResume);
          setShowGeneratedSection(true);
        }

        // Clear draft
        localStorage.removeItem("resumeTailorDraft");

        toast({
          title: "Resume Tailored Successfully! 🚀",
          description: `Your optimized resume "${resumeTitle}" has been generated and is ready for download.`,
          action: (
            <Button
              size="sm"
              onClick={() =>
                handleDownload(tailoredResumeUrl, `${resumeTitle}.pdf`)
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          ),
        });

        // Refresh usage data
        refreshUsage();

        // Reset form
        setJobRole("");
        setJobDescription("");
        setResume(null);
        setIndustry("");
        setResumeStyle("modern");

        // Reset file input
        const fileInput = document.getElementById(
          "resume-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Scroll to results on mobile
        if (window.innerWidth < 768) {
          setTimeout(() => {
            const generatedSection = document.getElementById(
              "generated-resumes-section"
            );
            if (generatedSection) {
              generatedSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error tailoring resume:", error);

      // ✅ FIXED: Proper usage limit error handling
      if (error.message.includes("Usage limit exceeded")) {
        toast({
          title: "Usage Limit Reached 📊",
          description:
            "You've reached your resume tailoring limit for your current plan. Upgrade to continue creating unlimited tailored resumes!",
          variant: "destructive",
          action: (
            <Button
              size="sm"
              onClick={() => navigate("/pricing")}
              className="bg-primary hover:bg-primary/90"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return; // ✅ Important: Return here to avoid the generic error toast below
      }

      // Enhanced error handling with specific messages
      let errorTitle = "Tailoring Failed";
      let errorDescription = "Failed to tailor resume. Please try again.";

      // ✅ FIXED: More specific error categorization
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        errorTitle = "Access Denied";
        errorDescription =
          "You don't have permission to use resume tailoring with your current plan.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        errorTitle = "Authentication Error";
        errorDescription = "Please log in again to continue.";
      } else if (error.message.includes("version_conflict")) {
        errorTitle = "Please Try Again";
        errorDescription =
          "Your usage data was updated by another session. Please try again.";
      } else if (
        error.message.includes("Network") ||
        error.message.includes("fetch") ||
        error.message.includes("Failed to fetch")
      ) {
        // ✅ FIXED: More specific network error detection
        errorTitle = "Connection Error";
        errorDescription =
          "Please check your internet connection and try again.";
      } else if (
        error.message.includes("500") ||
        error.message.includes("Internal Server Error")
      ) {
        errorTitle = "Server Error";
        errorDescription =
          "Our servers are experiencing issues. Please try again in a moment.";
      }

      // ✅ Only show generic error toast for non-usage-limit errors
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setLoadingStage(0);
    }
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started 📥",
        description: "Your tailored resume is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSession = () => {
    setCurrentGeneratedResume(null);
    setShowGeneratedSection(false);

    toast({
      title: "Removed",
      description: "Tailored resume has been removed from current session.",
    });
  };

  const handleClearForm = () => {
    setJobRole("");
    setJobDescription("");
    setResume(null);
    setIndustry("");
    setResumeStyle("modern");
    localStorage.removeItem("resumeTailorDraft");

    // Clear file input
    const fileInput = document.getElementById(
      "resume-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getJobDescriptionWordCount = () =>
    jobDescription
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  const wordCount = getJobDescriptionWordCount();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <ResumeLoadingOverlay show={isProcessing} stage={loadingStage} />

        <div className="container mx-auto px-4 py-8 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-6 hover:bg-appforge-blue/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl w-fit mx-auto bg-blue-500/20 text-blue-500"
              >
                <FileText className="w-8 h-8 md:w-12 md:h-12" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                AI Resume{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Tailor
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground px-4"
              >
                Customize your resume for specific job roles using advanced AI
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                  <span>ATS Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Higher Match Rate</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        <span className="leading-tight">
                          Tailor Your Resume
                        </span>
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSampleData}
                            className="text-xs"
                          >
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            Try Example
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Load sample job data to see how it works
                        </TooltipContent>
                      </Tooltip>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearForm}
                        className="text-xs"
                      >
                        <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Role and Industry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="jobRole"
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4 flex-shrink-0" />
                          Job Role/Title *
                        </Label>
                        <Input
                          id="jobRole"
                          value={jobRole}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setJobRole(e.target.value)
                          }
                          placeholder="e.g., Senior Software Engineer, Product Manager"
                          className={`transition-colors ${
                            !validation.jobRole ? "border-destructive" : ""
                          }`}
                        />
                        {!validation.jobRole && (
                          <p className="text-sm text-destructive">
                            Job role is required
                          </p>
                        )}
                      </motion.div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry (Optional)</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind.toLowerCase()}>
                                {ind}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Resume Style Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="resumeStyle">Resume Style</Label>
                      <Select
                        value={resumeStyle}
                        onValueChange={setResumeStyle}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resumeStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Job Description */}
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="jobDescription"
                          className="flex items-center gap-2"
                        >
                          Job Description *
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Paste the complete job posting here. Include
                                requirements, responsibilities, and skills. The
                                more detailed, the better your tailored resume
                                will be!
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className={
                              wordCount < 100
                                ? "text-destructive"
                                : wordCount > 300
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          >
                            {wordCount} words
                          </span>
                          {wordCount < 100 && (
                            <span className="text-destructive">(min 100)</span>
                          )}
                        </div>
                      </div>

                      <Textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setJobDescription(e.target.value)
                        }
                        placeholder="Paste the complete job posting here including requirements, responsibilities, skills, and company information..."
                        rows={8}
                        className={`transition-colors ${
                          !validation.jobDescription ? "border-destructive" : ""
                        }`}
                      />

                      {!validation.jobDescription && (
                        <p className="text-sm text-destructive">
                          Job description must be at least 100 characters long
                        </p>
                      )}
                    </motion.div>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Upload Your Current Resume *
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Upload your current resume. Our AI will analyze it
                              and optimize it specifically for the job you're
                              applying to.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>

                      <FileUploadArea
                        onFileSelect={setResume}
                        selectedFile={resume}
                        error={!validation.resume}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-lg font-semibold shadow-lg"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2"
                            >
                              <FileText className="w-5 h-5" />
                            </motion.div>
                            Tailoring Your Resume...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 mr-2" />
                            Tailor Resume with AI
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                          <span>Secure Processing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                          <span>~45 sec generation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
                          <span>ATS Optimized</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generated Resume Section */}
            <AnimatePresence>
              {showGeneratedSection && currentGeneratedResume && (
                <motion.div
                  id="generated-resumes-section"
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                      Your Tailored Resume is Ready! 🚀
                    </h2>
                    <p className="text-muted-foreground px-4">
                      Optimized specifically for {jobRole} positions
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 dark:from-slate-800/95 dark:to-slate-700/95 border border-slate-600/50 dark:border-slate-500/60">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                <FileText className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3
                                  className="font-semibold text-lg md:text-xl truncate"
                                  title={currentGeneratedResume.title}
                                >
                                  {currentGeneratedResume.title}
                                </h3>
                                <p className="text-muted-foreground">
                                  {currentGeneratedResume.file_type.toUpperCase()}{" "}
                                  Format
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 text-xs"
                                  >
                                    AI Tailored
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 text-xs"
                                  >
                                    ATS Optimized
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Generated on{" "}
                              {formatDateTime(
                                currentGeneratedResume.created_at
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                            <Button
                              onClick={() =>
                                handleDownload(
                                  currentGeneratedResume.resume_data,
                                  `${currentGeneratedResume.title}.${currentGeneratedResume.file_type}`
                                )
                              }
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleRemoveFromSession}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center"
                  >
                    <Button
                      onClick={() => navigate("/tailored-resumes")}
                      variant="outline"
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All Tailored Resumes
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AIResumeTailor;
