import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Shield,
  Clock,
  Save,
  AlertCircle,
  FileCheck,
  Zap,
  BarChart3,
  Award,
  RefreshCw,
  Brain,
  Scan,
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

const atsCheckerSchema = z.object({
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
});

type ATSCheckerForm = z.infer<typeof atsCheckerSchema>;

interface ATSResult {
  matchScore: string;
  missingSkills: string[];
  feedback: string;
}

// **MOBILE-ENHANCED AI AGENT LOADING EXPERIENCE**
const ATSAgentLoadingOverlay = memo(
  ({ show, stage = 0 }: { show: boolean; stage?: number }) => {
    const agentMessages = [
      "🔍 Scanning your resume structure...",
      "🧠 Understanding job requirements...",
      "⚡ Running ATS compatibility checks...",
      "📊 Analyzing keyword density...",
      "🎯 Identifying optimization opportunities...",
      "✨ Preparing personalized recommendations...",
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
            {/* Agent Avatar with Scanning Animation */}
            <motion.div
              className="relative mb-6 sm:mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl"
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
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 text-emerald-400" />

                {/* Scanning rings */}
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
              className="text-center space-y-3 sm:space-y-4 max-w-sm sm:max-w-md"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                ATS Screening Agent
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-emerald-400 font-medium leading-relaxed">
                {agentMessages[stage] || agentMessages[0]}
              </p>

              <div className="space-y-2 sm:space-y-3">
                <Progress
                  value={(stage + 1) * 16.67}
                  className="w-full max-w-80 h-2 sm:h-3 bg-slate-700/50 mx-auto"
                />
                <p className="text-xs sm:text-sm text-slate-400">
                  {Math.round((stage + 1) * 16.67)}% Complete • Analyzing with
                  AI precision
                </p>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                Your data is encrypted and processed securely
              </span>
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-emerald-400/30 rounded-full"
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

ATSAgentLoadingOverlay.displayName = "ATSAgentLoadingOverlay";

// **MOBILE-ENHANCED AI AGENT FILE UPLOAD**
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
            ? "border-emerald-400 bg-emerald-500/5 scale-105"
            : selectedFile
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-slate-600 hover:border-emerald-400/60 hover:bg-emerald-500/5"
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
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="font-semibold text-emerald-400 text-sm sm:text-base md:text-lg">
                Resume Ready for Analysis! ✨
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
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
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
            className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400 rounded-xl flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-emerald-400 font-semibold text-sm sm:text-base">
                Drop your resume here! ⚡
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AgentFileUploadArea.displayName = "AgentFileUploadArea";

// **MOBILE-ENHANCED AI AGENT RESULTS COMPONENT**
const AgentAnalysisResults = memo(
  ({
    results,
    onNewAnalysis,
    onImproveResume,
  }: {
    results: ATSResult;
    onNewAnalysis: () => void;
    onImproveResume: () => void;
  }) => {
    const getScoreLevel = useCallback((score: string) => {
      const numScore = parseInt(score.replace("%", ""));
      if (numScore >= 80)
        return {
          level: "excellent",
          color: "emerald",
          bgClass: "bg-gradient-to-br from-emerald-500/5 to-emerald-600/10",
          borderClass: "border-emerald-500/20 hover:border-emerald-400/40",
          textClass: "text-emerald-400",
          gradientClass: "bg-gradient-to-r from-emerald-400 to-emerald-600",
          strokeClass: "stroke-emerald-400",
          message: "Outstanding ATS compatibility! 🚀",
        };
      if (numScore >= 60)
        return {
          level: "good",
          color: "blue",
          bgClass: "bg-gradient-to-br from-blue-500/5 to-blue-600/10",
          borderClass: "border-blue-500/20 hover:border-blue-400/40",
          textClass: "text-blue-400",
          gradientClass: "bg-gradient-to-r from-blue-400 to-blue-600",
          strokeClass: "stroke-blue-400",
          message: "Good foundation, with room for optimization 📈",
        };
      return {
        level: "needs-work",
        color: "amber",
        bgClass: "bg-gradient-to-br from-amber-500/5 to-amber-600/10",
        borderClass: "border-amber-500/20 hover:border-amber-400/40",
        textClass: "text-amber-400",
        gradientClass: "bg-gradient-to-r from-amber-400 to-amber-600",
        strokeClass: "stroke-amber-400",
        message: "Significant improvements recommended 🎯",
      };
    }, []);

    const scoreInfo = getScoreLevel(results.matchScore);
    const scoreValue = parseInt(results.matchScore.replace("%", ""));

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
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl"
          >
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Analysis Complete! 🎯
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto">
              Your ATS Screening Agent has finished the analysis
            </p>
          </div>
        </div>

        {/* Score Card - FIXED className */}
        <Card
          className={`${scoreInfo.bgClass} backdrop-blur-xl border ${scoreInfo.borderClass} transition-all duration-300`}
        >
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-300">
                  ATS Compatibility Score
                </h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold ${scoreInfo.gradientClass} bg-clip-text text-transparent`}
                >
                  {results.matchScore}
                </motion.div>
                <p
                  className={`${scoreInfo.textClass} font-medium text-sm sm:text-base md:text-lg`}
                >
                  {scoreInfo.message}
                </p>
              </div>

              {/* Progress Ring Visualization */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                <svg
                  className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="stroke-slate-700"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className={scoreInfo.strokeClass}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${scoreValue} 100` }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-lg sm:text-2xl font-bold ${scoreInfo.textClass}`}
                  >
                    {scoreValue}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  onClick={onImproveResume}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base"
                >
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Optimize with AI Resume Tailor
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onNewAnalysis}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white h-11 sm:h-12 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Analyze Another Resume</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        {results.missingSkills && results.missingSkills.length > 0 && (
          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/10 backdrop-blur-xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-amber-400 text-sm sm:text-base md:text-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span className="truncate">Missing Keywords Detected</span>
              </CardTitle>
              <CardDescription className="text-slate-300 text-xs sm:text-sm">
                The agent found these important keywords from the job
                description that aren't in your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {results.missingSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Badge
                      variant="outline"
                      className="border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors px-2 sm:px-3 py-1 text-xs whitespace-nowrap flex-shrink-0"
                    >
                      <Search className="w-3 h-3 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {skill}
                      </span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agent Recommendations */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-blue-400 text-sm sm:text-base md:text-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span className="truncate">AI Agent Recommendations</span>
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs sm:text-sm">
              Personalized optimization strategies from your ATS Screening Agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {results.feedback.split(". ").map((sentence, index) => {
                if (sentence.trim() === "") return null;

                if (sentence.includes(":")) {
                  const [header, content] = sentence.split(":", 2);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <h4 className="font-semibold text-blue-400 flex items-center gap-2 text-sm sm:text-base">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{header.trim()}:</span>
                      </h4>
                      {content && (
                        <p className="text-slate-300 ml-4 sm:ml-6 leading-relaxed text-xs sm:text-sm">
                          {content.trim()}
                        </p>
                      )}
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-2 sm:gap-3 ml-4 sm:ml-6"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                      <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {sentence.trim()}.
                      </p>
                    </motion.div>
                  );
                }
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

AgentAnalysisResults.displayName = "AgentAnalysisResults";

// **MAIN MOBILE-ENHANCED ATS SCREENING AGENT COMPONENT**
const ATSScreeningAgent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<ATSResult | null>(null);
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkUsageLimit, refreshUsage } = useUsageTracking();
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<ATSCheckerForm>({
    resolver: zodResolver(atsCheckerSchema),
    defaultValues: {
      jobDescription: "",
    },
  });

  const jobDescription = form.watch("jobDescription");

  // Calculate user name for personalized greeting
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

  const simulateLoadingStages = useCallback(() => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2500);
    });
  }, []);

  // Helper function with proper error handling
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
    setIndustry("technology");
    form.setValue(
      "jobDescription",
      `We are seeking a Senior Software Engineer to join our dynamic development team. The ideal candidate will have 5+ years of experience in full-stack development and will be responsible for building scalable web applications.

Key Requirements:
• Bachelor's degree in Computer Science or related field
• 5+ years of software development experience
• Proficiency in JavaScript, React, Node.js
• Experience with cloud platforms (AWS, Azure, GCP)
• Strong understanding of databases (PostgreSQL, MongoDB)
• Knowledge of microservices architecture
• Experience with DevOps tools (Docker, Kubernetes)
• Excellent problem-solving and communication skills

Responsibilities:
• Design and develop scalable web applications
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews and technical discussions
• Mentor junior developers

Preferred Qualifications:
• Experience with TypeScript and modern frameworks
• Knowledge of machine learning or AI technologies
• Previous experience in a senior or lead role
• Open source contributions`
    );

    toast({
      title: "Example Loaded! 🚀",
      description:
        "Agent training data loaded. Upload your resume to begin analysis!",
    });
  }, [form, toast]);

  const handleResetAgent = useCallback(() => {
    form.reset();
    setSelectedFile(null);
    setIndustry("");
    setResults(null);
    localStorage.removeItem("atsCheckerDraft");

    toast({
      title: "Agent Reset ✨",
      description: "Ready for your next resume analysis!",
    });
  }, [form, toast]);

  const onSubmit = async (formData: ATSCheckerForm) => {
    if (!selectedFile) {
      toast({
        title: "Resume Required 📄",
        description: "Please upload your resume for the agent to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required 🔐",
        description: "Please log in to activate your ATS Screening Agent.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      const currentVersion = await getCurrentUserVersion(user.id);

      const { data: usageData, error: usageError } = await supabase.rpc(
        "increment_usage_secure",
        {
          p_target_user_id: user.id,
          p_usage_type: "ats_checks_used",
          p_increment_amount: 1,
          p_current_version: currentVersion,
          p_audit_metadata: {
            action: "ats_screening_agent",
            industry: industry || "unspecified",
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
              "You've reached your ATS Screening Agent limit. Upgrade to activate unlimited screening!",
            variant: "destructive",
            action: (
              <Button
                size="sm"
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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
            "Unable to activate your ATS Screening Agent. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Convert file to base64
      const base64Resume = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const { data: responseData, error: functionError } =
        await supabase.functions.invoke(
          "ats-checker-proxy", // The name of your edge function
          {
            body: {
              // user_id is now handled securely by the backend
              feature: "ats_screening_agent",
              resume: base64Resume,
              jobDescription: formData.jobDescription,
              industry: industry,
              fileType:
                selectedFile.type === "application/pdf" ? "pdf" : "docx",
            },
          }
        );

      if (functionError) {
        // This will catch network errors or function-level errors (like 5xx)
        throw new Error(`Agent analysis failed: ${functionError.message}`);
      }

      // ✅ THE REDUNDANT LINE IS NOW REMOVED.
      // The code will now correctly use the responseData from the invoke call above.

      if (responseData.allowed === false) {
        toast({
          title: "Agent Access Denied 🚫",
          description:
            responseData.message ||
            "Unable to access ATS Screening Agent with your current plan.",
          variant: "destructive",
        });
        return;
      }

      const result = responseData.results || responseData;
      setResults(result);

      refreshUsage();

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      toast({
        title: "Agent Analysis Complete! 🎯",
        description: "Your ATS Screening Agent has completed its analysis.",
        action: (
          <Button size="sm" onClick={() => navigate("/ai-resume-tailor")}>
            <Bot className="w-4 h-4 mr-1" />
            Optimize Resume
          </Button>
        ),
      });
    } catch (error) {
      console.error("Agent analysis error:", error);

      toast({
        title: "Agent Error 🤖",
        description:
          "Your ATS Screening Agent encountered an issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <ATSAgentLoadingOverlay show={isLoading} stage={loadingStage} />

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
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl"
                  >
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Screening
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    ATS Screening{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
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
                      <span className="text-emerald-400 font-semibold">
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent ATS agent is ready to analyze and
                      optimize your resume
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Get AI-powered insights on ATS compatibility, keyword
                      optimization, and personalized improvement strategies
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
                    icon: Scan,
                    title: "Deep Resume Scan",
                    desc: "Comprehensive ATS analysis",
                  },
                  {
                    icon: Brain,
                    title: "AI Intelligence",
                    desc: "Smart keyword matching",
                  },
                  {
                    icon: Target,
                    title: "Precision Scoring",
                    desc: "Accurate compatibility rating",
                  },
                  {
                    icon: Sparkles,
                    title: "Feedback & Guidance",
                    desc: "Detailed improvement tips",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mx-auto mb-2 sm:mb-3" />
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
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3 text-white">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">Configure Your Agent</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2 text-sm sm:text-base">
                          Provide the job details and your resume for
                          intelligent ATS analysis
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
                            Load sample data to test your ATS Screening Agent
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
                        {/* Resume Upload */}
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                            <span className="truncate">
                              Upload Your Resume *
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  Your agent will analyze this resume against
                                  the job requirements for ATS compatibility
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <AgentFileUploadArea
                            onFileSelect={setSelectedFile}
                            selectedFile={selectedFile}
                            error={!selectedFile}
                          />
                        </div>

                        {/* Industry Selection */}
                        <div className="space-y-2 sm:space-y-3">
                          <Label
                            htmlFor="industry"
                            className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white"
                          >
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                            <span className="truncate">
                              Industry Context (Optional)
                            </span>
                          </Label>
                          <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-10 sm:h-11 text-sm sm:text-base">
                              <SelectValue placeholder="Select industry for enhanced analysis" />
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

                        {/* Job Description */}
                        <FormField
                          control={form.control}
                          name="jobDescription"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <FileSearch className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
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
                                        accurate ATS compatibility analysis and
                                        keyword matching
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
                                  placeholder="Paste the complete job description here including requirements, responsibilities, and preferred qualifications..."
                                  className="min-h-[150px] sm:min-h-[200px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 text-sm sm:text-base resize-none"
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
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
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
                                  Agent Analyzing Resume...
                                </span>
                              </>
                            ) : (
                              <>
                                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                                <span className="truncate">
                                  Analyze My Resume
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
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                              <span className="truncate">Secure Analysis</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                              <span className="truncate">
                                ~30 sec processing
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">
                                AI-Powered Insights
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
                <AgentAnalysisResults
                  results={results}
                  onNewAnalysis={handleResetAgent}
                  onImproveResume={() => navigate("/ai-resume-tailor")}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ATSScreeningAgent;
