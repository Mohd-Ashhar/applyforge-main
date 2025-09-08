import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Edit,
  Info,
  Clock,
  Save,
  AlertCircle,
  FileCheck,
  Zap,
  BarChart3,
  Award,
  RefreshCw,
  Brain,
  Bot,
  Search,
  Eye,
  Home,
  ArrowRight,
  Star,
  Crown,
  Activity,
  FileSearch,
  Users,
  ChevronRight,
  Download,
  Trash2,
  Settings,
  Palette,
  Wand2,
  Briefcase,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";
import ResumeTemplateViewer from "@/components/ResumeTemplateViewer";
import { templates } from "@/lib/templates"; // --- CHANGE: Import templates ---

// --- CHANGE: Removed 'resumeStyle' from schema ---
const resumeOptimizerSchema = z.object({
  jobRole: z.string().min(2, "Job role must be at least 2 characters"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  industry: z.string().optional(),
});

type ResumeOptimizerForm = z.infer<typeof resumeOptimizerSchema>;

interface GeneratedResume {
  id: string;
  title: string;
  resume_data: string;
  file_type: string;
  created_at: string;
}

// ... (OptimizationAgentLoadingOverlay component remains the same)
const OptimizationAgentLoadingOverlay = memo(
  ({ show, stage = 0 }: { show: boolean; stage?: number }) => {
    const agentMessages = [
      "🔍 Analyzing your resume structure and content...",
      "🧠 Understanding job requirements and keywords...",
      "⚡ Optimizing formatting and ATS compatibility...",
      "🎯 Tailoring content for maximum impact...",
      "✨ Applying advanced styling and layout...",
      "🚀 Finalizing your optimized resume...",
    ];

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/90 p-4"
          >
            {/* Agent Avatar with Optimization Animation */}
            <motion.div
              className="relative mb-6 sm:mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center backdrop-blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-blue-400" />

                {/* Optimization rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/30"
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
              className="text-center space-y-3 sm:space-y-4 max-w-sm sm:max-w-md"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Resume Tailoring Agent
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-blue-400 font-medium leading-relaxed">
                {agentMessages[stage] || agentMessages[0]}
              </p>

              <div className="space-y-2 sm:space-y-3">
                <Progress
                  value={(stage + 1) * 16.67}
                  className="w-full max-w-80 h-2 sm:h-3 bg-slate-700/50 mx-auto"
                />
                <p className="text-xs sm:text-sm text-slate-400">
                  {Math.round((stage + 1) * 16.67)}% Complete • Optimizing with
                  AI precision
                </p>
              </div>
            </motion.div>

            {/* --- ADDED SECTION START --- */}
            {/* User Wait Time Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-6 sm:mt-8 max-w-md text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/60"
            >
              <p className="text-sm text-slate-300 leading-relaxed">
                This can take 1-2 minutes. Feel free to explore other features
                &mdash; we'll notify you when it's done! You can find all
                generated resumes later in the{" "}
                <Link
                  to="/tailored-resumes"
                  className="font-semibold text-blue-400 hover:underline"
                >
                  Tailored Resumes
                </Link>{" "}
                section.
              </p>
            </motion.div>
            {/* --- ADDED SECTION END --- */}

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                Your resume is being optimized securely
              </span>
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-blue-400/30 rounded-full"
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
  }
);
// ... (AgentFileUploadArea component remains the same)
const AgentFileUploadArea = memo(
  ({
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

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => setDragOver(false), []);

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
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
      },
      [onFileSelect]
    );

    const formatFileSize = useCallback((bytes: number) => {
      return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }, []);

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (
          file &&
          (file.type === "application/pdf" || file.name.endsWith(".docx"))
        ) {
          onFileSelect(file);
        }
      },
      [onFileSelect]
    );

    return (
      <motion.div
        className={`
        relative border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all duration-300
        ${
          dragOver
            ? "border-blue-400 bg-blue-500/5 scale-105"
            : selectedFile
            ? "border-blue-500/40 bg-blue-500/5"
            : "border-slate-600 hover:border-blue-400/60 hover:bg-blue-500/5"
        }
        ${error ? "border-red-400 bg-red-500/5" : ""}
      `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: dragOver ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />

        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="font-semibold text-blue-400 text-sm sm:text-base md:text-lg">
                Resume Ready for Optimization! ✨
              </p>
              <p className="text-xs sm:text-sm text-slate-400 truncate max-w-[250px] sm:max-w-xs mx-auto">
                {selectedFile.name} • {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-xs text-slate-500">
                Click to select a different file
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div className="space-y-2 sm:space-y-4">
              <p className="font-semibold text-white text-sm sm:text-base md:text-lg">
                Upload Your Resume
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Drop your resume here or click to browse
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-500">
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-400 text-xs"
                >
                  PDF
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-400 text-xs"
                >
                  DOCX
                </Badge>
                <span className="whitespace-nowrap">Max 10MB</span>
              </div>
            </div>
          </motion.div>
        )}

        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 rounded-xl flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-400 font-semibold text-sm sm:text-base">
                Drop your resume here! ⚡
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);
// ... (AgentOptimizationResults component remains the same)
const AgentOptimizationResults = memo(
  ({
    results,
    onNewOptimization,
    onViewAllResumes,
  }: {
    results: GeneratedResume;
    onNewOptimization: () => void;
    onViewAllResumes: () => void;
  }) => {
    const handleDownload = async (url: string, fileName: string) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Agent Completion Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/20 rounded-full flex items-center justify-center border border-blue-500/20 backdrop-blur-xl"
          >
            <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Optimization Complete! 🚀
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto">
              Your Resume Tailoring Agent has crafted your perfect resume
            </p>
          </div>
        </div>

        {/* Results Card */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-purple-600/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white flex-shrink-0"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-bold text-base sm:text-lg md:text-xl text-white truncate"
                      title={results.title}
                    >
                      {results.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {results.file_type.toUpperCase()} Format • Optimized for
                      ATS
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs whitespace-nowrap">
                    <Bot className="w-3 h-3 mr-1 flex-shrink-0" />
                    AI Optimized
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs whitespace-nowrap">
                    <Target className="w-3 h-3 mr-1 flex-shrink-0" />
                    ATS Compatible
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs whitespace-nowrap">
                    <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
                    Enhanced Design
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-400">
                  Generated on {formatDateTime(results.created_at)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() =>
                    handleDownload(
                      results.resume_data,
                      `${results.title}.${results.file_type}`
                    )
                  }
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Download Resume</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onNewOptimization}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Optimize Another</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Insights */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-blue-600/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-purple-400 text-sm sm:text-base md:text-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span className="truncate">Agent Optimization Insights</span>
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs sm:text-sm">
              Key improvements your Resume Tailoring Agent applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {[
                {
                  icon: Target,
                  title: "ATS Optimization",
                  desc: "Enhanced keyword density and formatting for ATS compatibility",
                },
                {
                  icon: Palette,
                  title: "Visual Enhancement",
                  desc: "Improved layout, typography, and visual hierarchy",
                },
                {
                  icon: Brain,
                  title: "Content Refinement",
                  desc: "Optimized bullet points and experience descriptions",
                },
                {
                  icon: Zap,
                  title: "Impact Maximization",
                  desc: "Strengthened achievements and quantified results",
                },
              ].map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 flex-shrink-0">
                    <insight.icon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-purple-400 mb-1 text-sm sm:text-base">
                      {insight.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {insight.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center">
          <Button
            onClick={onViewAllResumes}
            variant="outline"
            className="bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-400 hover:text-blue-300 px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
          >
            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">View All Optimized Resumes</span>
          </Button>
        </div>
      </motion.div>
    );
  }
);
// **MAIN MOBILE-ENHANCED RESUME Tailoring AGENT COMPONENT**
const ResumeOptimizationAgent: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<GeneratedResume | null>(null);
  const [isTemplateViewerOpen, setIsTemplateViewerOpen] = useState(false);
  // --- CHANGE: State for selected template ---
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    templates[0].id
  );

  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshUsage } = useUsageTracking();
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<ResumeOptimizerForm>({
    resolver: zodResolver(resumeOptimizerSchema),
    defaultValues: {
      jobRole: "",
      jobDescription: "",
      industry: "",
    },
  });

  useEffect(() => {
    // Check if state was passed from the ATS checker page
    if (state?.resumeFile && state?.jobDescription) {
      console.log("Data received from ATS Checker:", state);

      // Pre-populate the selected file
      setSelectedFile(state.resumeFile as File);

      // Pre-populate the job description in the form
      form.setValue("jobDescription", state.jobDescription);

      toast({
        title: "Data Loaded from ATS Checker! 🚀",
        description: "Your resume and job description are ready.",
      });
    }
  }, [state, form, toast]);

  const jobDescription = form.watch("jobDescription");

  // --- CHANGE: Find the display name for the selected template ---
  const selectedTemplateName = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplate)?.name || "Default";
  }, [selectedTemplate]);

  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0] ||
      "there"
    );
  }, [user?.user_metadata?.full_name, user?.email]);

  const industries = useMemo(
    () => [
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
    ],
    []
  );

  // --- CHANGE: Removed unused resumeStyles memo ---

  const simulateLoadingStages = useCallback(() => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 3000);
    });
  }, []);

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

  const loadAgentExample = useCallback(() => {
    form.setValue("jobRole", "Senior Software Engineer");
    form.setValue("industry", "technology");
    form.setValue(
      "jobDescription",
      `We are seeking an experienced Senior Software Engineer to join our growing engineering team. The ideal candidate will have 5+ years of experience in full-stack development and will be responsible for architecting scalable solutions.

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
• Previous experience in a senior or lead role`
    );

    toast({
      title: "Example Loaded! 🚀",
      description:
        "Agent training data loaded. Upload your resume to begin optimization!",
    });
  }, [form, toast]);

  const handleResetAgent = useCallback(() => {
    form.reset();
    setSelectedFile(null);
    setResults(null);
    setSelectedTemplate(templates[0].id); // Reset to default template

    toast({
      title: "Agent Reset ✨",
      description: "Ready for your next resume optimization!",
    });
  }, [form, toast]);

  const onSubmit = async (formData: ResumeOptimizerForm) => {
    if (!selectedFile) {
      toast({
        title: "Resume Required 📄",
        description: "Please upload your resume for the agent to optimize.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required 🔐",
        description:
          "Please log in to activate your Resume Tailoring Agent.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsProcessing(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      const currentVersion = await getCurrentUserVersion(user.id);

      const { data: usageData, error: usageError } = await supabase.rpc(
        "increment_usage_secure",
        {
          p_target_user_id: user.id,
          p_usage_type: "resume_tailors_used",
          p_increment_amount: 1,
          p_current_version: currentVersion,
          p_audit_metadata: {
            action: "resume_optimization_agent",
            job_role: formData.jobRole,
            industry: formData.industry || "unspecified",
            // --- CHANGE: Changed resume_style to resume_template ---
            resume_template: selectedTemplate,
            file_type: selectedFile.type === "application/pdf" ? "pdf" : "docx",
            file_size: selectedFile.size,
          },
        }
      );

      if (usageError) {
        if (usageError.message.includes("Usage limit exceeded")) {
          toast({
            title: "Agent Limit Reached 🤖",
            description:
              "You've reached your Resume Tailoring Agent limit. Upgrade to activate unlimited optimization!",
            variant: "destructive",
            action: (
              <Button
                size="sm"
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
            "Unable to activate your Resume Tailoring Agent. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const requestFormData = new FormData();
      // requestFormData.append("user_id", user.id);
      requestFormData.append("feature", "resume_optimization_agent");
      requestFormData.append("jobDescription", formData.jobDescription);
      requestFormData.append("jobIndustry", formData.industry || "");
      // --- CHANGE: Changed resumeStyle to resumeTemplate ---
      requestFormData.append("resumeTemplate", selectedTemplate);
      requestFormData.append("jobRole", formData.jobRole);
      requestFormData.append(
        "fileType",
        selectedFile.type === "application/pdf" ? "pdf" : "docx"
      );
      requestFormData.append("resume", selectedFile);

      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        throw new Error("User not authenticated");
      }

      // Securely call your new Edge Function instead of n8n directly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-tailor-proxy`,
        {
          method: "POST",
          body: requestFormData,
          headers: {
            // Add the Authorization header to authenticate the user
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Agent optimization failed: ${response.status} ${response.statusText}`
        );
      }

      const optimizedResumeUrl = await response.text();

      if (
        optimizedResumeUrl.includes("allowed") &&
        optimizedResumeUrl.includes("false")
      ) {
        toast({
          title: "Agent Access Denied 🚫",
          description:
            "Unable to access Resume Tailoring Agent with your current plan.",
          variant: "destructive",
        });
        return;
      }

      if (!optimizedResumeUrl || !optimizedResumeUrl.startsWith("http")) {
        throw new Error("Received an invalid URL from the agent.");
      }

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

      const resumeTitle = `${userName} ${formData.jobRole} Resume (Optimized)`;

      const { data, error } = await supabase
        .from("tailored_resumes")
        .insert({
          user_id: user.id,
          job_description: formData.jobDescription,
          resume_data: optimizedResumeUrl,
          title: resumeTitle,
          file_type: "pdf",
        })
        .select("id, title, resume_data, file_type, created_at")
        .single();

      if (error) {
        console.error("Error saving optimized resume:", error);
        toast({
          title: "Save Error",
          description:
            "Resume optimized but failed to save. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const newResume: GeneratedResume = {
          id: data.id,
          title: data.title || resumeTitle,
          resume_data: data.resume_data,
          file_type: data.file_type,
          created_at: data.created_at,
        };
        setResults(newResume);
      }

      refreshUsage();

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      toast({
        title: "Agent Optimization Complete! 🚀",
        description:
          "Your Resume Tailoring Agent has crafted your perfect resume.",
        action: (
          <Button size="sm" onClick={() => navigate("/tailored-resumes")}>
            <Eye className="w-4 h-4 mr-1" />
            View All
          </Button>
        ),
      });
    } catch (error) {
      console.error("Agent optimization error:", error);

      toast({
        title: "Agent Error 🤖",
        description:
          "Your Resume Tailoring Agent encountered an issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setLoadingStage(0);
    }
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
        <OptimizationAgentLoadingOverlay
          show={isProcessing}
          stage={loadingStage}
        />

        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Hero Section - AI Agent Focused */}
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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/20 rounded-full flex items-center justify-center border border-blue-500/20 backdrop-blur-xl"
                  >
                    <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Optimization
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Resume Optimization{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
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
                      <span className="text-blue-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent resume agent is ready to craft your
                      perfect, job-winning resume
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Get AI-powered resume optimization, enhanced design, and
                      ATS compatibility in one powerful package
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Capabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Wand2,
                    title: "AI Optimization",
                    desc: "Intelligent content enhancement",
                  },
                  {
                    icon: Palette,
                    title: "Design Enhancement",
                    desc: "Professional visual styling",
                  },
                  {
                    icon: Target,
                    title: "ATS Compatibility",
                    desc: "Optimized for applicant tracking",
                  },
                  {
                    icon: Brain,
                    title: "Smart Tailoring",
                    desc: "Job-specific customization",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Agent Interface */}
            {!results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3 text-white">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                          <span className="truncate">Configure Your Agent</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2 text-sm sm:text-base">
                          Provide your job details and resume for intelligent
                          optimization
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={loadAgentExample}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm"
                            >
                              <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">Try Example</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Load sample data to test your Resume Optimization
                            Agent
                          </TooltipContent>
                        </Tooltip>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetAgent}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs sm:text-sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Reset Agent</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 sm:space-y-8"
                      >
                        {/* Resume Upload and Template Selection */}
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                            <span className="truncate">
                              Upload Your Resume *
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  Your agent will optimize this resume with
                                  AI-powered enhancements and job-specific
                                  tailoring
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <AgentFileUploadArea
                            onFileSelect={setSelectedFile}
                            selectedFile={selectedFile}
                            error={!selectedFile}
                          />
                          {/* --- CHANGE: Updated template selection display --- */}
                          <div className="pt-4 text-center flex flex-col items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsTemplateViewerOpen(true)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Choose Resume Template
                            </Button>
                            <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg">
                              Selected Template:{" "}
                              <span className="font-semibold text-blue-400">
                                {selectedTemplateName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Job Role and Industry */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="jobRole"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                                  <span className="truncate">
                                    Job Role/Title *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Senior Software Engineer, Product Manager"
                                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 text-sm sm:text-base h-10 sm:h-11"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                                  <span className="truncate">
                                    Industry (Optional)
                                  </span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-10 sm:h-11 text-sm sm:text-base">
                                      <SelectValue placeholder="Select industry for enhanced optimization" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {industries.map((industry) => (
                                      <SelectItem
                                        key={industry}
                                        value={industry.toLowerCase()}
                                      >
                                        {industry}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Job Description */}
                        <FormField
                          control={form.control}
                          name="jobDescription"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <FileSearch className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                                  <span className="truncate">
                                    Job Description *
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p>
                                        Paste the complete job posting for
                                        optimal resume optimization and keyword
                                        matching
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                  <span
                                    className={
                                      wordCount < 100
                                        ? "text-red-400"
                                        : wordCount > 200
                                        ? "text-emerald-400"
                                        : "text-amber-400"
                                    }
                                  >
                                    {wordCount} words
                                  </span>
                                  {wordCount < 50 && (
                                    <span className="text-red-400 text-xs whitespace-nowrap">
                                      (min 50)
                                    </span>
                                  )}
                                </div>
                              </div>
                              <FormControl>
                                <Textarea
                                  placeholder="Paste the complete job posting here including requirements, responsibilities, and preferred qualifications..."
                                  className="min-h-[150px] sm:min-h-[200px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 text-sm sm:text-base resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Activate Agent Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="pt-2 sm:pt-4"
                        >
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg"
                            disabled={isProcessing}
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
                                  className="mr-2 sm:mr-3 flex-shrink-0"
                                >
                                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                                <span className="truncate">
                                  Agent Optimizing Resume...
                                </span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                                <span className="truncate">
                                  Start Resume Tailoring
                                </span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                              </>
                            )}
                          </Button>
                        </motion.div>

                        {/* Agent Features */}
                        <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-xl p-4 sm:p-6 border border-slate-700/30">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                              <span className="truncate">
                                Secure Processing
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">
                                ~45 sec optimization
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                              <span className="truncate">
                                AI-Enhanced Results
                              </span>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Agent Results */}
            {results && (
              <div ref={resultsRef}>
                <AgentOptimizationResults
                  results={results}
                  onNewOptimization={handleResetAgent}
                  onViewAllResumes={() => navigate("/tailored-resumes")}
                />
              </div>
            )}
          </motion.div>
        </div>
        {/* --- CHANGE: Pass new props to viewer --- */}
        <ResumeTemplateViewer
          isOpen={isTemplateViewerOpen}
          onOpenChange={setIsTemplateViewerOpen}
          currentTemplateId={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
        />
      </div>
    </TooltipProvider>
  );
};

export default ResumeOptimizationAgent;
