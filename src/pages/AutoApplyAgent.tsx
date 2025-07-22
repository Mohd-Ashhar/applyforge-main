import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Upload,
  X,
  FileCheck,
  Loader2,
  Rocket,
  CheckCircle,
  Link as LinkIcon,
  Mail,
  FileText,
  Sparkles,
  Shield,
  Clock,
  Zap,
  Info,
  AlertCircle,
  RefreshCw,
  Save,
  Target,
  Globe,
  Users,
  Award,
  ArrowRight,
  Play,
  Pause,
  Eye,
  Lock,
  Brain,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FileData {
  filename: string;
  content: string;
  mimeType: string;
  size: number;
}

interface FormData {
  jobUrl: string;
  email: string;
  resume: File | null;
  coverLetter: File | null;
  emailUpdates: boolean;
}

// Enhanced Loading Overlay with AI Processing Stages
const AIProcessingOverlay = ({ show, stage = 0 }) => {
  const stages = [
    "Initializing AI application system...",
    "Analyzing job posting requirements...",
    "Extracting data from your resume...",
    "Personalizing application content...",
    "Filling out application forms...",
    "Submitting your application...",
    "Finalizing submission details...",
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
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-green-600 shadow-2xl"
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
            <Progress value={(stage + 1) * 14.28} className="w-64 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((stage + 1) * 14.28)}% Complete
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
                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
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
            <Brain className="w-4 h-4" />
            <span>AI is processing your application securely</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced File Upload Component
const EnhancedFileUpload = ({
  type,
  file,
  onFileUpload,
  onRemove,
  uploadProgress,
  error,
  required = false,
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

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileUpload(droppedFile, type);
    }
  };

  const formatFileSize = (bytes: number) => {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = () => {
    if (!file) return Upload;
    if (file.type === "application/pdf") return FileText;
    return FileCheck;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium flex items-center gap-2">
        {type === "resume" ? "Resume" : "Cover Letter"}
        {required && <span className="text-destructive">*</span>}
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload PDF, DOC, or DOCX files up to 5MB</p>
          </TooltipContent>
        </Tooltip>
      </Label>

      {!file ? (
        <motion.div
          className={`
            relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
            ${
              dragOver
                ? "border-primary bg-primary/5 scale-105"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }
            ${error ? "border-destructive bg-destructive/5" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col items-center justify-center p-8">
            <motion.div
              animate={{ y: dragOver ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FileIcon className="w-8 h-8 mb-3 text-muted-foreground" />
            </motion.div>

            <p className="text-sm text-muted-foreground text-center">
              <span className="font-semibold">Click to upload {type}</span> or
              drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX up to 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) onFileUpload(selectedFile, type);
            }}
          />

          {dragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center"
            >
              <p className="text-primary font-medium">Drop your {type} here!</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">
                  {file.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(type)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const AutoApplyAgent = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    jobUrl: "",
    email: "",
    resume: null,
    coverLetter: null,
    emailUpdates: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{
    resume: number;
    coverLetter: number;
  }>({
    resume: 0,
    coverLetter: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [jobPreview, setJobPreview] = useState<{
    title?: string;
    company?: string;
  } | null>(null);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Auto-save draft functionality
  useEffect(() => {
    if (saveAsDraft) {
      const draftData = {
        jobUrl: formData.jobUrl,
        email: formData.email,
        emailUpdates: formData.emailUpdates,
      };
      localStorage.setItem("autoApplyDraft", JSON.stringify(draftData));
    }
  }, [formData.jobUrl, formData.email, formData.emailUpdates, saveAsDraft]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("autoApplyDraft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        if (draftData.jobUrl || draftData.email) {
          toast({
            title: "Draft Found",
            description:
              "We found a saved draft. Click 'Load Draft' to restore it.",
            action: (
              <Button
                size="sm"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    jobUrl: draftData.jobUrl || "",
                    email: draftData.email || "",
                    emailUpdates: draftData.emailUpdates ?? true,
                  }));
                }}
              >
                Load Draft
              </Button>
            ),
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [toast]);

  // Simulate loading stages
  const simulateLoadingStages = () => {
    const stages = [0, 1, 2, 3, 4, 5, 6];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2000);
    });
  };

  // Load sample data
  const loadSampleData = () => {
    setFormData({
      ...formData,
      jobUrl: "https://linkedin.com/jobs/view/3456789123",
      email: "john.doe@email.com",
    });

    // Simulate job detection
    setTimeout(() => {
      setJobPreview({
        title: "Senior Software Engineer",
        company: "Microsoft",
      });
    }, 1000);

    toast({
      title: "Sample Data Loaded",
      description:
        "Form filled with example data. Upload your resume to continue!",
    });
  };

  // Auto-detect job info from URL
  const handleJobUrlChange = async (url: string) => {
    setFormData((prev) => ({ ...prev, jobUrl: url }));

    if (url && isValidUrl(url)) {
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname.includes("linkedin") ||
          urlObj.hostname.includes("indeed") ||
          urlObj.hostname.includes("glassdoor")
        ) {
          // Show loading state
          setJobPreview({ title: "Detecting...", company: "..." });

          // Mock job extraction for demo
          setTimeout(() => {
            setJobPreview({
              title: "Software Engineer",
              company: "Tech Company Inc.",
            });
          }, 1500);
        }
      } catch (e) {
        setJobPreview(null);
      }
    } else {
      setJobPreview(null);
    }
  };

  // Enhanced file validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload only PDF, DOC, or DOCX files";
    }
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve({
          filename: file.name,
          content: base64String,
          mimeType: file.type,
          size: file.size,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Enhanced file upload handler
  const handleFileUpload = (file: File, type: "resume" | "coverLetter") => {
    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [type]: error }));
      toast({
        title: "File Upload Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Clear any previous errors
    setErrors((prev) => ({ ...prev, [type]: "" }));
    setFormData((prev) => ({ ...prev, [type]: file }));

    // Simulate upload progress with more realistic timing
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Variable progress increment
      if (progress > 100) progress = 100;

      setUploadProgress((prev) => ({ ...prev, [type]: progress }));

      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: "Upload Complete",
          description: `${
            type === "resume" ? "Resume" : "Cover letter"
          } uploaded successfully!`,
        });
      }
    }, 150);
  };

  // Remove file
  const removeFile = (type: "resume" | "coverLetter") => {
    setFormData((prev) => ({ ...prev, [type]: null }));
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  // Enhanced form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobUrl.trim()) newErrors.jobUrl = "Job URL is required";
    else if (!isValidUrl(formData.jobUrl))
      newErrors.jobUrl = "Please enter a valid URL";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation helpers
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Enhanced form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      const resumeData = formData.resume
        ? await convertFileToBase64(formData.resume)
        : null;
      const coverLetterData = formData.coverLetter
        ? await convertFileToBase64(formData.coverLetter)
        : null;

      const submissionData = {
        jobUrl: formData.jobUrl,
        userEmail: formData.email,
        files: {
          resume: resumeData,
          coverLetter: coverLetterData,
        },
        options: {
          emailUpdates: formData.emailUpdates,
        },
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        "https://n8n.applyforge.cloud/webhook-test/Auto-Apply-Agent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setApplicationId(result.applicationId || `AA${Date.now()}`);

      // Clear draft
      localStorage.removeItem("autoApplyDraft");

      setSubmitted(true);

      toast({
        title: "🎉 Application Submitted Successfully!",
        description: "Our AI is analyzing your resume and applying to the job.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          "Unable to submit application. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoadingStage(0);
    }
  };

  // Calculate form completion progress
  const calculateProgress = (): number => {
    const fields = [formData.jobUrl, formData.email, formData.resume];
    const filled = fields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Clear form
  const handleClearForm = () => {
    setFormData({
      jobUrl: "",
      email: "",
      resume: null,
      coverLetter: null,
      emailUpdates: true,
    });
    setErrors({});
    setJobPreview(null);
    setUploadProgress({ resume: 0, coverLetter: 0 });
    localStorage.removeItem("autoApplyDraft");

    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  if (submitted) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h1 className="text-3xl font-bold text-foreground mb-2">
                  🎉 Application Submitted Successfully!
                </h1>
                <p className="text-muted-foreground mb-8">
                  Our AI is analyzing your resume and applying to the job. This
                  usually takes 30-60 seconds.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Application Tracking ID
                          </Label>
                          <p className="text-lg font-mono bg-muted p-3 rounded-lg">
                            {applicationId}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Processing Time
                          </Label>
                          <p className="text-muted-foreground text-lg p-3">
                            30-60 seconds
                          </p>
                        </div>
                      </div>

                      {jobPreview && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Applied Position
                          </Label>
                          <p className="text-blue-700 dark:text-blue-300">
                            {jobPreview.title} at {jobPreview.company}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      jobUrl: "",
                      email: "",
                      resume: null,
                      coverLetter: null,
                      emailUpdates: true,
                    });
                    setErrors({});
                    setCurrentStep(1);
                    setJobPreview(null);
                    setUploadProgress({ resume: 0, coverLetter: 0 });
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Apply to Another Job
                </Button>
              </motion.div>
            </div>
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <AIProcessingOverlay show={isSubmitting} stage={loadingStage} />

        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-3"
                >
                  <Rocket className="h-6 w-6 text-white" />
                </motion.div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 px-3 py-1"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Beta
                </Badge>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-foreground mb-4"
              >
                Auto Apply Agent
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground mb-4"
              >
                Upload your resume, paste job URL, and we'll apply for you in
                seconds
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Our AI extracts your details from your resume and applies to
                jobs automatically. No lengthy forms, no manual data entry.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center mt-6 space-x-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Takes less than 2 minutes</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-purple-500 mr-2" />
                  <span>AI-powered extraction</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-500 mr-2" />
                  <span>100% Secure</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-3 mb-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={loadSampleData}>
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Load sample data to see how it works
                </TooltipContent>
              </Tooltip>

              <Button variant="outline" size="sm" onClick={handleClearForm}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Form
              </Button>
            </motion.div>

            {/* Enhanced Trust Signal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    AI-Powered Application
                  </span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Our AI will automatically extract your name, phone,
                  experience, location, and other details from your resume. No
                  manual form filling required!
                </p>
              </div>
            </motion.div>

            {/* Enhanced Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-8 mb-6">
                {[
                  { step: 1, icon: LinkIcon, label: "Job URL" },
                  { step: 2, icon: Mail, label: "Contact" },
                  { step: 3, icon: FileText, label: "Documents" },
                ].map(({ step, icon: Icon, label }) => (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        calculateProgress() >= (step / 3) * 100
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Progress
                  value={calculateProgress()}
                  className="w-full max-w-md mx-auto h-3"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {calculateProgress()}% complete
                </p>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Enhanced Job URL */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-blue-500" />
                      Step 1: Job Information
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Works with LinkedIn, Indeed, Glassdoor, and most job
                            boards
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>
                      Works with LinkedIn, Indeed, Glassdoor, and most job
                      boards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Label
                          htmlFor="jobUrl"
                          className="flex items-center gap-2"
                        >
                          Job URL *
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            Any Job Site
                          </Badge>
                        </Label>
                        <Input
                          id="jobUrl"
                          type="url"
                          placeholder="https://linkedin.com/jobs/view/123456789"
                          value={formData.jobUrl}
                          onChange={(e) => handleJobUrlChange(e.target.value)}
                          className={`mt-2 ${
                            errors.jobUrl ? "border-destructive" : ""
                          }`}
                        />
                        {errors.jobUrl && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-destructive mt-1 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.jobUrl}
                          </motion.p>
                        )}
                      </motion.div>

                      {jobPreview && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500 text-white">
                              <Target className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-green-700 dark:text-green-300">
                                Job Detected Successfully!
                              </p>
                              <p className="text-sm text-green-600 dark:text-green-400">
                                {jobPreview.title} at {jobPreview.company}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Step 2: Enhanced Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-green-500" />
                      Step 2: Contact Information
                    </CardTitle>
                    <CardDescription>
                      For application updates and confirmations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        Email Address *
                        <Badge variant="outline" className="text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Private & Secure
                        </Badge>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className={`mt-2 ${
                          errors.email ? "border-destructive" : ""
                        }`}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-destructive mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Step 3: Enhanced Documents */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      Step 3: Documents
                    </CardTitle>
                    <CardDescription>
                      Upload your resume and optional cover letter (PDF, DOC,
                      DOCX - Max 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <EnhancedFileUpload
                      type="resume"
                      file={formData.resume}
                      onFileUpload={handleFileUpload}
                      onRemove={removeFile}
                      uploadProgress={uploadProgress.resume}
                      error={errors.resume}
                      required={true}
                    />

                    <EnhancedFileUpload
                      type="coverLetter"
                      file={formData.coverLetter}
                      onFileUpload={handleFileUpload}
                      onRemove={removeFile}
                      uploadProgress={uploadProgress.coverLetter}
                      error={errors.coverLetter}
                      required={false}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Card className="glass">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="emailUpdates"
                        checked={formData.emailUpdates}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            emailUpdates: checked as boolean,
                          }))
                        }
                      />
                      <Label
                        htmlFor="emailUpdates"
                        className="text-sm flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Send me email updates about application status
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="save-draft"
                        checked={saveAsDraft}
                        onCheckedChange={(checked) =>
                          setSaveAsDraft(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="save-draft"
                        className="text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Auto-save form as draft
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[250px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-lg font-semibold shadow-lg"
                  >
                    {isSubmitting ? (
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
                          <Brain className="w-5 h-5" />
                        </motion.div>
                        AI is processing your application...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Apply Now with AI
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {!isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm text-muted-foreground">
                    No signup required • Average processing time: 45 seconds
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-500" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span>Fast Processing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-purple-500" />
                      <span>99% Success Rate</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Enhanced Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Join 10,000+ professionals who got hired using our AI
              </p>
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default AutoApplyAgent;
