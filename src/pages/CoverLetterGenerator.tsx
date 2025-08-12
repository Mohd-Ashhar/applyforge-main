import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  FileText,
  Mail,
  Download,
  Trash2,
  ArrowLeft,
  Sparkles,
  Eye,
  Info,
  Upload,
  Building,
  Briefcase,
  Shield,
  Clock,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedCoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
}

interface FormValidation {
  companyName: boolean;
  positionTitle: boolean;
  jobDescription: boolean;
  resume: boolean;
}

// Enhanced Loading Overlay with progress stages
const CoverLetterLoadingOverlay = ({
  show,
  stage = 0,
}: {
  show: boolean;
  stage?: number;
}) => {
  const stages = [
    "Initializing AI analysis...",
    "Processing your resume...",
    "Analyzing job requirements...",
    "Crafting personalized content...",
    "Finalizing your cover letter...",
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
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-indigo-600 shadow-2xl"
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
            <Progress value={(stage + 1) * 20} className="w-64 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((stage + 1) * 20)}% Complete
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
                className="w-2 h-2 bg-green-500 rounded-full"
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
            <span>Your data is encrypted and secure</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced file upload component with Mobile Optimization
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) =>
      [
        "application/pdf",
        "application/msword",
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
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
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
              Supports PDF, DOC, DOCX • Max 10MB
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

const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [currentGeneratedLetter, setCurrentGeneratedLetter] =
    useState<GeneratedCoverLetter | null>(null);
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);
  const [validation, setValidation] = useState<FormValidation>({
    companyName: true,
    positionTitle: true,
    jobDescription: true,
    resume: true,
  });
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auto-save draft functionality
  useEffect(() => {
    if (saveAsDraft) {
      const draftData = {
        companyName,
        positionTitle,
        jobDescription,
        industry,
        tone,
      };
      localStorage.setItem("coverLetterDraft", JSON.stringify(draftData));
    }
  }, [companyName, positionTitle, jobDescription, industry, tone, saveAsDraft]);

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
    "Other",
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "confident", label: "Confident" },
    { value: "creative", label: "Creative" },
  ];

  const validateForm = () => {
    const newValidation = {
      companyName: companyName.trim().length > 0,
      positionTitle: positionTitle.trim().length > 0,
      jobDescription: jobDescription.trim().length > 50,
      resume: resume !== null,
    };

    setValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };

  const simulateLoadingStages = () => {
    const stages = [0, 1, 2, 3, 4];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2000);
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

  // FIXED: Main handler with proper usage limit enforcement
  const handleGenerateCoverLetter = async () => {
    if (!validateForm()) {
      toast({
        title: "Please Complete All Required Fields",
        description:
          "Company name, position title, detailed job description (min 50 characters), and resume are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate cover letters.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      // ✅ CRITICAL FIX: Check usage limits FIRST
      const currentVersion = await getCurrentUserVersion(user.id);

      const { data: usageData, error: usageError } = await supabase.rpc(
        "increment_usage_secure",
        {
          p_target_user_id: user.id,
          p_usage_type: "cover_letters_used",
          p_increment_amount: 1,
          p_current_version: currentVersion,
          p_audit_metadata: {
            action: "cover_letter_generation",
            company: companyName,
            position: positionTitle,
            industry: industry || "unspecified",
            tone: tone,
          },
        }
      );

      if (usageError) {
        // Handle specific limit exceeded error
        if (usageError.message.includes("Usage limit exceeded")) {
          toast({
            title: "Usage Limit Reached 📊",
            description:
              "You've reached your cover letter limit for your current plan. Upgrade to continue generating unlimited cover letters!",
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

      // ✅ Only proceed with generation if usage increment succeeded
      console.log("Usage incremented successfully, proceeding with generation");

      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("feature", "cover_letters");
      formData.append("jobDescription", jobDescription);
      formData.append("companyName", companyName);
      formData.append("positionTitle", positionTitle);
      formData.append("industry", industry);
      formData.append("tone", tone);
      formData.append("resume", resume);

      const response = await fetch(
        "https://n8n.applyforge.cloud/webhook-test/generate-cover-letter",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate cover letter: ${response.status} ${response.statusText}`
        );
      }

      // Get the iframe HTML as text
      const iframeHtml = await response.text();

      // Extract the PDF URL from the srcdoc attribute
      const pdfUrlMatch = iframeHtml.match(/srcdoc="([^"]+)"/);
      const actualPdfUrl = pdfUrlMatch ? pdfUrlMatch[1] : null;

      if (!actualPdfUrl) {
        throw new Error("Could not extract PDF URL from response");
      }

      if (actualPdfUrl) {
        const { data, error } = await supabase
          .from("cover_letters")
          .insert({
            user_id: user.id,
            company_name: companyName,
            position_title: positionTitle,
            job_description: jobDescription,
            cover_letter_url: actualPdfUrl, // Use the extracted PDF URL
            original_resume_name: resume.name,
            file_type: "pdf",
            industry,
            tone,
          })
          .select(
            "id, company_name, position_title, cover_letter_url, created_at"
          )
          .single();

        // ... rest of your existing code

        // Use actualPdfUrl in your toast action
        toast({
          title: "Success! 🎉",
          description:
            "Your personalized cover letter has been generated successfully.",
          action: (
            <Button
              size="sm"
              onClick={() =>
                handleDownload(
                  actualPdfUrl, // Use the extracted PDF URL
                  `${companyName}-cover-letter.pdf`
                )
              }
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          ),
        });

        // Also update the newLetter object
        if (data) {
          const newLetter: GeneratedCoverLetter = {
            id: data.id,
            company_name: data.company_name,
            position_title: data.position_title,
            cover_letter_url: actualPdfUrl, // Use extracted URL here too
            created_at: data.created_at,
          };
          setCurrentGeneratedLetter(newLetter);
          setShowGeneratedSection(true);
        }

        // Reset form
        setJobDescription("");
        setCompanyName("");
        setPositionTitle("");
        setResume(null);
        setIndustry("");
        setTone("professional");
        const fileInput = document.getElementById(
          "resume-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Scroll to results on mobile
        if (window.innerWidth < 768) {
          setTimeout(() => {
            const generatedSection = document.getElementById(
              "generated-letters-section"
            );
            if (generatedSection) {
              generatedSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);

      // Enhanced error handling with specific messages
      let errorTitle = "Generation Failed";
      let errorDescription =
        "Failed to generate cover letter. Please try again.";

      if (error.message.includes("Usage limit exceeded")) {
        errorTitle = "Usage Limit Reached";
        errorDescription =
          "You've reached your cover letter limit for your current plan.";
      } else if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        errorTitle = "Access Denied";
        errorDescription =
          "You don't have permission to generate cover letters with your current plan.";
      } else if (
        error.message.includes("Network") ||
        error.message.includes("fetch")
      ) {
        errorTitle = "Connection Error";
        errorDescription =
          "Please check your internet connection and try again.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
        description: "Your cover letter is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your cover letter.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSession = () => {
    setCurrentGeneratedLetter(null);
    setShowGeneratedSection(false);

    toast({
      title: "Removed",
      description: "Cover letter has been removed from current session.",
    });
  };

  const handleClearForm = () => {
    setJobDescription("");
    setCompanyName("");
    setPositionTitle("");
    setResume(null);
    setIndustry("");
    setTone("professional");
    localStorage.removeItem("coverLetterDraft");

    const fileInput = document.getElementById(
      "resume-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  const loadSampleData = () => {
    setCompanyName("Microsoft");
    setPositionTitle("Software Engineer");
    setIndustry("Technology");
    setJobDescription(`We are seeking a talented Software Engineer to join our dynamic development team. The ideal candidate will have experience with modern web technologies, cloud platforms, and agile development practices.

Key Responsibilities:
• Develop and maintain scalable web applications
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and efficient code
• Participate in code reviews and contribute to technical discussions
• Stay up-to-date with emerging technologies and industry best practices

Requirements:
• Bachelor's degree in Computer Science or related field
• 3+ years of experience in software development
• Proficiency in JavaScript, React, Node.js
• Experience with cloud platforms (AWS, Azure)
• Strong problem-solving skills and attention to detail
• Excellent communication and teamwork abilities`);

    toast({
      title: "Sample Data Loaded",
      description:
        "Form filled with example data. Don't forget to upload your resume!",
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
        <CoverLetterLoadingOverlay show={isGenerating} stage={loadingStage} />

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
                className="mb-6 p-4 rounded-xl w-fit mx-auto bg-appforge-blue/20 text-appforge-blue"
              >
                <Mail className="w-8 h-8 md:w-12 md:h-12" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                AI Cover Letter{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Generator
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground px-4"
              >
                Create personalized cover letters tailored to specific job
                opportunities
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                  <span>Generated in ~30s</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
                  <span>ATS Optimized</span>
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
                    <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span className="leading-tight">
                        Generate Cover Letter
                      </span>
                    </CardTitle>
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
                          Load sample data to see how it works
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

                <CardContent className="space-y-6">
                  {/* Company and Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="company-name"
                        className="flex items-center gap-2"
                      >
                        <Building className="w-4 h-4 flex-shrink-0" />
                        Company Name *
                      </Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Microsoft, Google, Apple"
                        className={`transition-colors ${
                          !validation.companyName ? "border-destructive" : ""
                        }`}
                      />
                      {!validation.companyName && (
                        <p className="text-sm text-destructive">
                          Company name is required
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="position-title"
                        className="flex items-center gap-2"
                      >
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        Position Title *
                      </Label>
                      <Input
                        id="position-title"
                        value={positionTitle}
                        onChange={(e) => setPositionTitle(e.target.value)}
                        placeholder="e.g., Software Engineer, Product Manager"
                        className={`transition-colors ${
                          !validation.positionTitle ? "border-destructive" : ""
                        }`}
                      />
                      {!validation.positionTitle && (
                        <p className="text-sm text-destructive">
                          Position title is required
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Industry and Tone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Job Description */}
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="job-description"
                        className="flex items-center gap-2"
                      >
                        Job Description *
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Paste the complete job posting here. The more
                              detailed, the better your cover letter will be!
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span
                          className={
                            wordCount < 50
                              ? "text-destructive"
                              : wordCount > 200
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {wordCount} words
                        </span>
                        {wordCount < 50 && (
                          <span className="text-destructive">(min 50)</span>
                        )}
                      </div>
                    </div>

                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job posting here including requirements, responsibilities, and company information..."
                      rows={8}
                      className={`transition-colors ${
                        !validation.jobDescription ? "border-destructive" : ""
                      }`}
                    />

                    {!validation.jobDescription && (
                      <p className="text-sm text-destructive">
                        Job description must be at least 50 characters long
                      </p>
                    )}
                  </motion.div>

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Upload Your Resume *
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Upload your most recent resume. We'll extract
                            relevant experience to personalize your cover
                            letter.
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

                  {/* Generate Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleGenerateCoverLetter}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-lg font-semibold shadow-lg"
                      size="lg"
                    >
                      {isGenerating ? (
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
                            <Mail className="w-5 h-5" />
                          </motion.div>
                          Generating Your Cover Letter...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Generate AI Cover Letter
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                        <span>~30 sec generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
                        <span>ATS Optimized</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generated Cover Letter Section */}
            <AnimatePresence>
              {showGeneratedSection && currentGeneratedLetter && (
                <motion.div
                  id="generated-letters-section"
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
                      className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                      Your Cover Letter is Ready! 🎉
                    </h2>
                    <p className="text-muted-foreground px-4">
                      Tailored specifically for{" "}
                      {currentGeneratedLetter.position_title} at{" "}
                      {currentGeneratedLetter.company_name}
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
                              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 text-white">
                                <Mail className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3
                                  className="font-semibold text-lg md:text-xl truncate"
                                  title={currentGeneratedLetter.position_title}
                                >
                                  {currentGeneratedLetter.position_title}
                                </h3>
                                <p
                                  className="text-muted-foreground truncate"
                                  title={currentGeneratedLetter.company_name}
                                >
                                  {currentGeneratedLetter.company_name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 text-xs"
                                  >
                                    AI Generated
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    PDF Format
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Generated on{" "}
                              {formatDateTime(
                                currentGeneratedLetter.created_at
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                            <Button
                              onClick={() =>
                                handleDownload(
                                  currentGeneratedLetter.cover_letter_url,
                                  `${currentGeneratedLetter.company_name}-cover-letter.pdf`
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
                      onClick={() => navigate("/saved-cover-letters")}
                      variant="outline"
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All Cover Letters
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

export default CoverLetterGenerator;
