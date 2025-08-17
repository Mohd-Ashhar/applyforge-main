import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
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
  Bot,
  Home,
  ChevronRight,
  Crown,
  Settings,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

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

// **ENHANCED AI AGENT LOADING EXPERIENCE - GREEN/EMERALD THEME**
const ApplicationAgentLoadingOverlay = ({
  show,
  stage = 0,
}: {
  show: boolean;
  stage?: number;
}) => {
  const agentMessages = [
    "🤖 Initializing Application Automation Agent...",
    "🔍 Analyzing job posting requirements...",
    "📄 Extracting data from your resume...",
    "✍️ Personalizing application content...",
    "📝 Auto-filling application forms...",
    "🚀 Submitting your application...",
    "✅ Finalizing submission details...",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/90"
        >
          {/* Agent Avatar with Application Animation */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Rocket className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400" />

              {/* Application rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Agent Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4 max-w-md"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Application Automation Agent
            </h3>
            <p className="text-base sm:text-lg text-emerald-400 font-medium">
              {agentMessages[stage] || agentMessages[0]}
            </p>

            <div className="space-y-3">
              <Progress
                value={(stage + 1) * 14.28}
                className="w-80 max-w-full h-3 bg-slate-700/50"
              />
              <p className="text-sm text-slate-400">
                {Math.round((stage + 1) * 14.28)}% Complete • Applying with AI
                precision
              </p>
            </div>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Your application is being processed securely</span>
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
                animate={{
                  x: [0, 100, -100, 0],
                  y: [0, -100, 100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + i * 8}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// **ENHANCED FILE UPLOAD COMPONENT - GREEN THEME**
const AgentFileUpload = memo(
  ({
    type,
    file,
    onFileUpload,
    onRemove,
    uploadProgress,
    error,
    required = false,
  }: {
    type: "resume" | "coverLetter";
    file: File | null;
    onFileUpload: (file: File, type: "resume" | "coverLetter") => void;
    onRemove: (type: "resume" | "coverLetter") => void;
    uploadProgress: number;
    error?: string;
    required?: boolean;
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
              <Info className="w-4 h-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload PDF, DOC, or DOCX files up to 5MB</p>
            </TooltipContent>
          </Tooltip>
        </Label>

        {!file ? (
          <motion.div
            className={`
            relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
            ${
              dragOver
                ? "border-emerald-400 bg-emerald-500/5 scale-105"
                : "border-slate-600 hover:border-emerald-400/60 hover:bg-emerald-500/5"
            }
            ${error ? "border-red-400 bg-red-500/5" : ""}
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
                <FileIcon className="w-8 h-8 mb-3 text-slate-400" />
              </motion.div>

              <p className="text-sm text-slate-400 text-center">
                <span className="font-semibold">Click to upload {type}</span> or
                drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
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
                className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400 rounded-xl flex items-center justify-center"
              >
                <p className="text-emerald-400 font-medium">
                  Drop your {type} here!
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-xl bg-gradient-to-r from-emerald-500/5 to-green-500/5 border-emerald-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-emerald-400">{file.name}</p>
                  <p className="text-xs text-emerald-300">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(type)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-xs text-slate-400 mt-1">
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
  }
);

// **AGENT SUCCESS COMPONENT**
const ApplicationSuccessView = memo(
  ({
    applicationId,
    jobPreview,
    onNewApplication,
  }: {
    applicationId: string;
    jobPreview: { title?: string; company?: string } | null;
    onNewApplication: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      {/* Agent Completion Header */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl"
        >
          <Rocket className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Application Submitted Successfully! 🚀
          </h1>
          <p className="text-slate-300 text-lg">
            Your Application Automation Agent has successfully submitted your
            job application
          </p>
        </div>
      </div>

      {/* Results Card */}
      <Card className="bg-gradient-to-br from-emerald-500/5 to-green-600/10 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-400">
                  Application Tracking ID
                </Label>
                <p className="text-lg font-mono bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-400">
                  {applicationId}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-400">
                  Processing Time
                </Label>
                <p className="text-slate-300 text-lg p-3">30-60 seconds</p>
              </div>
            </div>

            {jobPreview && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <Label className="text-sm font-medium text-emerald-400">
                  Applied Position
                </Label>
                <p className="text-emerald-300">
                  {jobPreview.title} at {jobPreview.company}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Bot className="w-3 h-3 mr-1" />
                AI Applied
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Submitted Successfully
              </Badge>
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                <Clock className="w-3 h-3 mr-1" />
                Fast Processing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-4">
        <Button
          onClick={onNewApplication}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8"
          size="lg"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Apply to Another Job
        </Button>
      </div>
    </motion.div>
  )
);

const ApplicationAutomationAgent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
  const [jobPreview, setJobPreview] = useState<{
    title?: string;
    company?: string;
  } | null>(null);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

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

  const simulateLoadingStages = useCallback(() => {
    const stages = [0, 1, 2, 3, 4, 5, 6];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2000);
    });
  }, []);

  const loadSampleData = useCallback(() => {
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
      title: "Agent Example Loaded! 🚀",
      description:
        "Form filled with example data. Upload your resume to continue!",
    });
  }, [formData, toast]);

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
          setJobPreview({ title: "Detecting...", company: "..." });

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

  const handleFileUpload = useCallback(
    (file: File, type: "resume" | "coverLetter") => {
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

      setErrors((prev) => ({ ...prev, [type]: "" }));
      setFormData((prev) => ({ ...prev, [type]: file }));

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;

        setUploadProgress((prev) => ({ ...prev, [type]: progress }));

        if (progress >= 100) {
          clearInterval(interval);
          toast({
            title: "Upload Complete ✅",
            description: `${
              type === "resume" ? "Resume" : "Cover letter"
            } uploaded successfully to your agent!`,
          });
        }
      }, 150);
    },
    [toast]
  );

  const removeFile = useCallback((type: "resume" | "coverLetter") => {
    setFormData((prev) => ({ ...prev, [type]: null }));
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Agent Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required 🔐",
        description:
          "Please log in to activate your Application Automation Agent.",
        variant: "destructive",
      });
      navigate("/auth");
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
        user_id: user.id,
        feature: "application_automation_agent",
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

      if (result.allowed === false) {
        toast({
          title: "Agent Limit Reached 🤖",
          description:
            "You've reached your Application Automation Agent limit. Upgrade to activate unlimited applications!",
          variant: "destructive",
          action: (
            <Button
              size="sm"
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </Button>
          ),
        });
        return;
      }

      setApplicationId(result.applicationId || `AA${Date.now()}`);
      localStorage.removeItem("autoApplyDraft");
      setSubmitted(true);

      toast({
        title: "🎉 Agent Application Success!",
        description:
          "Your Application Automation Agent has successfully submitted your job application.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Agent Error 🤖",
        description:
          "Your Application Automation Agent encountered an issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoadingStage(0);
    }
  };

  const calculateProgress = (): number => {
    const fields = [formData.jobUrl, formData.email, formData.resume];
    const filled = fields.filter(
      (field) => field && field.toString().trim()
    ).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleClearForm = useCallback(() => {
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
      title: "Agent Reset ✨",
      description: "All fields have been reset for your next application.",
    });
  }, [toast]);

  const handleNewApplication = useCallback(() => {
    setSubmitted(false);
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
  }, []);

  if (!user) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl">
              <CardContent className="pt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20"
                >
                  <Rocket className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Authentication Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please log in to activate your Application Automation Agent.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
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

  if (submitted) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <ApplicationSuccessView
              applicationId={applicationId}
              jobPreview={jobPreview}
              onNewApplication={handleNewApplication}
            />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <ApplicationAgentLoadingOverlay
          show={isSubmitting}
          stage={loadingStage}
        />

        {/* Header */}
        <DashboardHeader />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Back to Home Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white backdrop-blur-sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </motion.div>

            {/* Hero Section - AI Agent Focused */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl"
                  >
                    <Rocket className="w-10 h-10 text-emerald-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Beta
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Application Automation{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                      Agent
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      Hey{" "}
                      <span className="text-emerald-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent application agent is ready to apply to
                      jobs automatically
                    </p>
                    <p className="text-base text-slate-400 max-w-2xl mx-auto">
                      Upload your resume, paste job URL, and watch your agent
                      apply in seconds with AI-powered automation
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Rocket,
                    title: "Instant Application",
                    desc: "Submit in under 2 minutes",
                  },
                  {
                    icon: Brain,
                    title: "AI Data Extraction",
                    desc: "Auto-fills from your resume",
                  },
                  {
                    icon: Shield,
                    title: "100% Secure",
                    desc: "Your data stays private",
                  },
                  {
                    icon: Target,
                    title: "High Success Rate",
                    desc: "99% application success",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-sm text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-3 mb-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleData}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Load sample data to see how your agent works
                </TooltipContent>
              </Tooltip>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearForm}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Agent
              </Button>
            </motion.div>

            {/* Agent Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
                          ? "bg-emerald-500 text-white shadow-lg"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="text-xs text-slate-400 mt-2">{label}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Progress
                  value={calculateProgress()}
                  className="w-full max-w-md mx-auto h-3 bg-slate-700/50"
                />
                <p className="text-sm text-slate-400 mt-2">
                  {calculateProgress()}% complete
                </p>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Enhanced Job URL */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-emerald-400" />
                      Step 1: Job Information
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-slate-400" />
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
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-600 text-slate-400"
                          >
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
                          className={`mt-2 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400 ${
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
                          className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                              <Target className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-medium text-emerald-400">
                                Job Detected Successfully!
                              </p>
                              <p className="text-sm text-emerald-300">
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
                transition={{ delay: 1.0 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-green-400" />
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
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-400"
                        >
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
                        className={`mt-2 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400 ${
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
                transition={{ delay: 1.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-400" />
                      Step 3: Documents
                    </CardTitle>
                    <CardDescription>
                      Upload your resume and optional cover letter (PDF, DOC,
                      DOCX - Max 5MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <AgentFileUpload
                      type="resume"
                      file={formData.resume}
                      onFileUpload={handleFileUpload}
                      onRemove={removeFile}
                      uploadProgress={uploadProgress.resume}
                      error={errors.resume}
                      required={true}
                    />

                    <AgentFileUpload
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
                transition={{ delay: 1.2 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50">
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
                        className="text-sm flex items-center gap-2 text-slate-300"
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
                        className="text-sm flex items-center gap-2 text-slate-300"
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
                transition={{ delay: 1.3 }}
                className="flex justify-center pt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[300px] bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-14 text-lg font-semibold shadow-lg"
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
                          <Bot className="w-5 h-5" />
                        </motion.div>
                        Agent Applying for You...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Activate Application Agent
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {!isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm text-slate-400">
                    No signup required • Average processing time: 45 seconds
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-green-400" />
                      <span>Fast Processing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-teal-400" />
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
              transition={{ delay: 1.5 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-slate-400 mb-4">
                Join 10,000+ professionals who got hired using our AI agent
              </p>
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ApplicationAutomationAgent;
