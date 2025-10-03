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
  Mail,
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
  Building,
  Briefcase,
  User,
  PenTool,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/DashboardHeader";
import UserAvatar from "@/components/header/UserAvatar";

import CoverLetterTemplateViewer from "@/components/CoverLetterTemplateViewer";
import { coverLetterTemplates } from "@/lib/coverLetterTemplates";
import { Helmet } from "react-helmet-async";

const coverLetterSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  positionTitle: z
    .string()
    .min(2, "Position title must be at least 2 characters"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  industry: z.string().optional(),
  tone: z.string().default("professional"),
});

type CoverLetterForm = z.infer<typeof coverLetterSchema>;

interface GeneratedCoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
}

const AGENT_COLORS = {
  primary: "purple-400",
  secondary: "pink-500",
  accent: "rose-500",
  background: "from-purple-500/5 via-pink-500/5 to-rose-500/10",
  cardBackground: "from-purple-500/20 via-pink-500/15 to-rose-500/20",
  border: "border-purple-500/20",
  borderHover: "hover:border-purple-400/40",
  button:
    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
  icon: "text-purple-400",
  badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// ... (CraftingAgentLoadingOverlay, AgentFileUploadArea, and AgentCraftingResults components remain the same)
// **ENHANCED: Mobile Loading Experience with Consistent Colors**
const CraftingAgentLoadingOverlay = memo(
  ({ show, stage = 0 }: { show: boolean; stage?: number }) => {
    const agentMessages = [
      "✍️ Analyzing your resume and experience...",
      "🧠 Understanding the job requirements...",
      "📝 Crafting personalized content...",
      "🎯 Tailoring tone and messaging...",
      "✨ Applying professional formatting...",
      "📋 Finalizing your cover letter...",
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
            {/* Agent Avatar with Crafting Animation - CONSISTENT COLORS */}
            <motion.div
              className="relative mb-6 sm:mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${AGENT_COLORS.cardBackground} border ${AGENT_COLORS.border} flex items-center justify-center backdrop-blur-xl`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <PenTool
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 ${AGENT_COLORS.icon}`}
                />

                {/* Crafting rings - CONSISTENT COLORS */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/30"
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

            {/* Agent Status - CONSISTENT COLORS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-3 sm:space-y-4 max-w-sm sm:max-w-md"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Cover Letter Crafting Agent
              </h3>
              <p
                className={`text-sm sm:text-base md:text-lg ${AGENT_COLORS.icon} font-medium leading-relaxed`}
              >
                {agentMessages[stage] || agentMessages[0]}
              </p>

              <div className="space-y-2 sm:space-y-3">
                <Progress
                  value={(stage + 1) * 16.67}
                  className="w-full max-w-80 h-2 sm:h-3 bg-slate-700/50 mx-auto"
                />
                <p className="text-xs sm:text-sm text-slate-400">
                  {Math.round((stage + 1) * 16.67)}% Complete • Crafting with AI
                  precision
                </p>
              </div>
            </motion.div>

            {/* --- CHANGE: Add informational message for user --- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 max-w-md text-center p-4 sm:p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm space-y-2"
            >
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                This can take upto 30 seconds. Feel free to explore other
                features!
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                We'll notify you in the app once your letter is crafted. You can
                also find it in your saved cover letters section.
              </p>
            </motion.div>

            {/* Security Badge - CONSISTENT COLORS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50"
            >
              <Shield
                className={`w-3 h-3 sm:w-4 sm:h-4 ${AGENT_COLORS.icon} flex-shrink-0`}
              />
              <span className="text-xs sm:text-sm">
                Your letter is being crafted securely
              </span>
            </motion.div>

            {/* Floating particles - CONSISTENT COLORS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-purple-500/30 rounded-full"
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

CraftingAgentLoadingOverlay.displayName = "CraftingAgentLoadingOverlay";

// **ENHANCED: File Upload with Consistent Colors**
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
            "application/msword",
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
        if (file) {
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
            ? "border-purple-400 bg-purple-500/10 scale-105"
            : selectedFile
            ? `${AGENT_COLORS.border} bg-gradient-to-br ${AGENT_COLORS.cardBackground}`
            : "border-slate-600 hover:border-purple-400/40 hover:bg-purple-500/5"
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
          accept=".pdf,.doc,.docx"
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
            <div
              className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-xl flex items-center justify-center border ${AGENT_COLORS.border}`}
            >
              <FileCheck
                className={`w-6 h-6 sm:w-8 sm:h-8 ${AGENT_COLORS.icon}`}
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p
                className={`font-semibold ${AGENT_COLORS.icon} text-sm sm:text-base md:text-lg`}
              >
                Resume Ready for Crafting! ✨
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
            <div
              className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${AGENT_COLORS.cardBackground} rounded-xl flex items-center justify-center border ${AGENT_COLORS.border}`}
            >
              <Upload
                className={`w-6 h-6 sm:w-8 sm:h-8 ${AGENT_COLORS.icon}`}
              />
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
                  DOC
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-400 text-xs"
                >
                  DOCX
                </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-purple-500/10 border-2 border-purple-400 rounded-xl flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <PenTool
                className={`w-6 h-6 sm:w-8 sm:h-8 ${AGENT_COLORS.icon} mx-auto mb-2`}
              />
              <p
                className={`${AGENT_COLORS.icon} font-semibold text-sm sm:text-base`}
              >
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

// **ENHANCED: Results Component with Consistent Colors**
const AgentCraftingResults = memo(
  ({
    results,
    onNewCraft,
    onViewAllLetters,
  }: {
    results: GeneratedCoverLetter;
    onNewCraft: () => void;
    onViewAllLetters: () => void;
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

    const formatDateTime = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Agent Completion Header - CONSISTENT COLORS */}
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${AGENT_COLORS.cardBackground} rounded-full flex items-center justify-center border ${AGENT_COLORS.border} backdrop-blur-xl`}
          >
            <PenTool
              className={`w-8 h-8 sm:w-10 sm:h-10 ${AGENT_COLORS.icon}`}
            />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Crafting Complete! 📋
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto">
              Your Cover Letter Crafting Agent has created your personalized
              cover letter
            </p>
          </div>
        </div>

        {/* Results Card - CONSISTENT COLORS */}
        <Card
          className={`bg-gradient-to-br ${AGENT_COLORS.cardBackground} backdrop-blur-xl border ${AGENT_COLORS.border} ${AGENT_COLORS.borderHover} transition-all duration-300`}
        >
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className={`p-2 sm:p-3 rounded-xl bg-purple-500/20 border ${AGENT_COLORS.border} flex-shrink-0`}
                  >
                    <Mail
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${AGENT_COLORS.icon}`}
                    />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-bold text-base sm:text-lg md:text-xl text-white truncate"
                      title={results.position_title}
                    >
                      {results.position_title}
                    </h3>
                    <p
                      className="text-slate-400 text-sm sm:text-base font-medium truncate"
                      title={results.company_name}
                    >
                      {results.company_name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <Badge
                    className={`${AGENT_COLORS.badge} text-xs whitespace-nowrap flex-shrink-0`}
                  >
                    <Bot className="w-3 h-3 mr-1 flex-shrink-0" />
                    AI Crafted
                  </Badge>
                  <Badge
                    className={`${AGENT_COLORS.badge} text-xs whitespace-nowrap flex-shrink-0`}
                  >
                    <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                    Personalized
                  </Badge>
                  <Badge
                    className={`${AGENT_COLORS.badge} text-xs whitespace-nowrap flex-shrink-0`}
                  >
                    <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                    Professional
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-400">
                  Crafted on {formatDateTime(results.created_at)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() =>
                    handleDownload(
                      results.cover_letter_url,
                      `${results.company_name}-cover-letter.pdf`
                    )
                  }
                  className={`${AGENT_COLORS.button} text-white font-semibold px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base`}
                >
                  <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Download Letter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onNewCraft}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Craft Another</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Crafting Insights - CONSISTENT COLORS */}
        <Card
          className={`bg-gradient-to-br ${AGENT_COLORS.cardBackground} backdrop-blur-xl border ${AGENT_COLORS.border} ${AGENT_COLORS.borderHover} transition-all duration-300`}
        >
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle
              className={`flex items-center gap-2 sm:gap-3 ${AGENT_COLORS.icon} text-sm sm:text-base md:text-lg`}
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span className="truncate">Agent Crafting Insights</span>
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs sm:text-sm">
              Key elements your Cover Letter Crafting Agent applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: PenTool,
                  title: "Personalized Content",
                  desc: "Tailored messaging specific to the role and company",
                },
                {
                  icon: Mail,
                  title: "Professional Tone",
                  desc: "Appropriate writing style for the industry and position",
                },
                {
                  icon: Star,
                  title: "Impact Highlighting",
                  desc: "Emphasized your most relevant achievements and skills",
                },
                {
                  icon: Zap,
                  title: "ATS Optimization",
                  desc: "Structured format that passes applicant tracking systems",
                },
              ].map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div
                    className={`p-1.5 sm:p-2 rounded-lg bg-purple-500/20 border ${AGENT_COLORS.border} flex-shrink-0`}
                  >
                    <insight.icon
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${AGENT_COLORS.icon}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`font-semibold ${AGENT_COLORS.icon} mb-1 text-sm sm:text-base`}
                    >
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

        {/* Next Steps - CONSISTENT COLORS */}
        <div className="text-center">
          <Button
            onClick={onViewAllLetters}
            variant="outline"
            className={`bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 ${AGENT_COLORS.icon} hover:text-purple-300 hover:border-purple-400/40 px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base`}
          >
            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">View All Cover Letters</span>
          </Button>
        </div>
      </motion.div>
    );
  }
);

AgentCraftingResults.displayName = "AgentCraftingResults";

// **MAIN COVER LETTER CRAFTING AGENT COMPONENT WITH CONSISTENT COLORS**
const CoverLetterCraftingAgent: React.FC = () => {
  const [isCrafting, setIsCrafting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<GeneratedCoverLetter | null>(null);
  // --- CHANGE: Add state for template viewer modal ---
  const [isTemplateViewerOpen, setIsTemplateViewerOpen] = useState(false);
  // --- CHANGE: Add state for selected template ID ---
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    coverLetterTemplates[0].id
  );

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { refreshUsage } = useUsageTracking();
  const resultsRef = useRef<HTMLDivElement>(null);

  const form = useForm<CoverLetterForm>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      positionTitle: "",
      jobDescription: "",
      industry: "",
      tone: "professional",
    },
  });

  const jobDescription = form.watch("jobDescription");

  // --- CHANGE: Add memo to get the display name of the selected template ---
  const selectedTemplateName = useMemo(() => {
    return (
      coverLetterTemplates.find((t) => t.id === selectedTemplate)?.name ||
      "Default"
    );
  }, [selectedTemplate]);

  // Calculate user name for personalized greeting
  const userName = useMemo(() => {
    if (!user) return "there";
    return (
      user.user_metadata?.full_name?.split(" ")?.[0] ||
      user.email?.split("@")?.[0]
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

  const tones = useMemo(
    () => [
      {
        value: "professional",
        label: "Professional",
        desc: "Formal and business-appropriate",
      },
      {
        value: "enthusiastic",
        label: "Enthusiastic",
        desc: "Energetic and passionate",
      },
      {
        value: "confident",
        label: "Confident",
        desc: "Direct and self-assured",
      },
      {
        value: "creative",
        label: "Creative",
        desc: "Innovative and expressive",
      },
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
    form.setValue("companyName", "Microsoft");
    form.setValue("positionTitle", "Software Engineer");
    form.setValue("industry", "technology");
    form.setValue(
      "jobDescription",
      `We are seeking a talented Software Engineer to join our dynamic development team. The ideal candidate will have experience with modern web technologies, cloud platforms, and agile development practices.

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
• Excellent communication and teamwork abilities`
    );

    toast({
      title: "Example Loaded! 🚀",
      description:
        "Agent training data loaded. Upload your resume to begin crafting!",
    });
  }, [form, toast]);

  const handleResetAgent = useCallback(() => {
    form.reset();
    setSelectedFile(null);
    setResults(null);
    // --- CHANGE: Reset selected template to default ---
    setSelectedTemplate(coverLetterTemplates[0].id);

    toast({
      title: "Agent Reset ✨",
      description: "Ready for your next cover letter crafting!",
    });
  }, [form, toast]);

  const onSubmit = async (formData: CoverLetterForm) => {
    if (!selectedFile) {
      toast({
        title: "Resume Required 📄",
        description:
          "Please upload your resume for the agent to craft your cover letter.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required 🔐",
        description:
          "Please log in to activate your Cover Letter Crafting Agent.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsCrafting(true);
    setLoadingStage(0);
    simulateLoadingStages();

    try {
      const currentVersion = await getCurrentUserVersion(user.id);

      const { data: usageData, error: usageError } = await supabase.rpc(
        "increment_usage_secure",
        {
          p_target_user_id: user.id,
          p_usage_type: "cover_letters_used",
          p_increment_amount: 1,
          p_current_version: currentVersion,
          p_audit_metadata: {
            action: "cover_letter_crafting_agent",
            company: formData.companyName,
            position: formData.positionTitle,
            industry: formData.industry || "unspecified",
            tone: formData.tone,
            // --- CHANGE: Add selected template to audit metadata ---
            template: selectedTemplate,
          },
        }
      );

      if (usageError) {
        if (usageError.message.includes("Usage limit exceeded")) {
          toast({
            title: "Agent Limit Reached 🤖",
            description:
              "You've reached your Cover Letter Crafting Agent limit. Upgrade to activate unlimited crafting!",
            variant: "destructive",
            action: (
              <Button
                size="sm"
                onClick={() => navigate("/pricing")}
                className={`${AGENT_COLORS.button}`}
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
            "Unable to activate your Cover Letter Crafting Agent. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Send request to webhook
      const formRequestData = new FormData();

      formRequestData.append("feature", "cover_letter_crafting_agent");
      formRequestData.append("jobDescription", formData.jobDescription);
      formRequestData.append("companyName", formData.companyName);
      formRequestData.append("positionTitle", formData.positionTitle);
      formRequestData.append("industry", formData.industry || "");
      formRequestData.append("tone", formData.tone);
      formRequestData.append("resume", selectedFile);
      formRequestData.append(
        "fileType",
        selectedFile.type === "application/pdf" ? "pdf" : "docx"
      );
      // --- CHANGE: Add selected template to webhook data ---
      formRequestData.append("coverLetterTemplate", selectedTemplate);

      // Get the user's session token for authentication
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        throw new Error("User not authenticated");
      }

      // Securely call your new Edge Function instead of n8n directly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cover-letter-proxy`,
        {
          method: "POST",
          body: formRequestData,
          headers: {
            // Add the Authorization header to authenticate the request
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Agent crafting failed: ${response.status} ${response.statusText}`
        );
      }

      // The response text IS the URL
      const craftedLetterUrl = await response.text();

      // Add a simple validation to ensure the URL is not empty and looks like a URL
      if (!craftedLetterUrl || !craftedLetterUrl.startsWith("http")) {
        throw new Error("Received an invalid URL from the agent.");
      }

      if (craftedLetterUrl) {
        const { data, error } = await supabase
          .from("cover_letters")
          .insert({
            user_id: user.id,
            company_name: formData.companyName,
            position_title: formData.positionTitle,
            job_description: formData.jobDescription,
            cover_letter_url: craftedLetterUrl,
            original_resume_name: selectedFile.name,
            file_type: "pdf",
            industry: formData.industry,
            tone: formData.tone,
          })
          .select(
            "id, company_name, position_title, cover_letter_url, created_at"
          )
          .single();

        if (error) {
          console.error("Error saving crafted cover letter:", error);
          toast({
            title: "Save Error",
            description:
              "Cover letter crafted but failed to save. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const newLetter: GeneratedCoverLetter = {
            id: data.id,
            company_name: data.company_name,
            position_title: data.position_title,
            cover_letter_url: craftedLetterUrl,
            created_at: data.created_at,
          };
          setResults(newLetter);
        }

        refreshUsage();

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);

        toast({
          title: "Agent Crafting Complete! 📋",
          description:
            "Your Cover Letter Crafting Agent has created your personalized cover letter.",
          action: (
            <Button size="sm" onClick={() => navigate("/saved-cover-letters")}>
              <Eye className="w-4 h-4 mr-1" />
              View All
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error("Agent crafting error:", error);

      toast({
        title: "Agent Error 🤖",
        description:
          "Your Cover Letter Crafting Agent encountered an issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCrafting(false);
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
      <Helmet>
        <title>
          AI Cover Letter Generator | Create a Custom Cover Letter in Seconds
        </title>
        <meta
          name="description"
          content="Generate a personalized cover letter tailored to any job description. Our AI helps you stand out and land more interviews. Get your custom cover letter in seconds!"
        />
        <link
          rel="canonical"
          href="https://applyforge.ai/cover-letter-generator"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <CraftingAgentLoadingOverlay show={isCrafting} stage={loadingStage} />

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
            {/* Hero Section - AI Agent Focused with CONSISTENT COLORS */}
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
                    className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${AGENT_COLORS.cardBackground} rounded-full flex items-center justify-center border ${AGENT_COLORS.border} backdrop-blur-xl`}
                  >
                    <PenTool
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${AGENT_COLORS.icon}`}
                    />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      className={`${AGENT_COLORS.badge} text-xs sm:text-sm`}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Crafting
                    </Badge>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight"
                  >
                    Cover Letter Crafting{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-purple-400 to-pink-600 bg-clip-text text-transparent">
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
                      <span className={`${AGENT_COLORS.icon} font-semibold`}>
                        {userName}
                      </span>
                      ! 👋
                      <br />
                      Your intelligent cover letter agent is ready to craft
                      personalized, compelling cover letters
                    </p>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                      Get AI-powered cover letter crafting, tailored messaging,
                      and professional formatting in one powerful package
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Agent Capabilities - CONSISTENT COLORS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: PenTool,
                    title: "AI Crafting",
                    desc: "Intelligent content generation",
                  },
                  {
                    icon: Mail,
                    title: "Personal Touch",
                    desc: "Customized for each role",
                  },
                  {
                    icon: Brain,
                    title: "Smart Matching",
                    desc: "Skills-to-job alignment",
                  },
                  {
                    icon: Star,
                    title: "Professional Format",
                    desc: "ATS-friendly structure",
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50"
                  >
                    <capability.icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${AGENT_COLORS.icon} mx-auto mb-2 sm:mb-3`}
                    />
                    <h3 className="font-semibold text-white mb-1 sm:mb-2 text-xs sm:text-sm">
                      {capability.title}
                    </h3>
                    <p className="text-xs text-slate-400">{capability.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Agent Interface - CONSISTENT COLORS */}
            {!results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300`}
                >
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 sm:gap-3 text-white">
                          <Bot
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${AGENT_COLORS.icon} flex-shrink-0`}
                          />
                          <span className="truncate">Configure Your Agent</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2 text-sm sm:text-base">
                          Provide your job details and resume for intelligent
                          cover letter crafting
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
                            Load sample data to test your Cover Letter Crafting
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
                        {/* Resume Upload */}
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                            <FileText
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${AGENT_COLORS.icon} flex-shrink-0`}
                            />
                            <span className="truncate">
                              Upload Your Resume *
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  Your agent will extract relevant experience to
                                  personalize your cover letter
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <AgentFileUploadArea
                            onFileSelect={setSelectedFile}
                            selectedFile={selectedFile}
                            error={!selectedFile}
                          />
                          {/* --- CHANGE: Add template selection UI --- */}
                          <div className="pt-4 text-center flex flex-col items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsTemplateViewerOpen(true)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Change Cover Letter Template
                            </Button>
                            <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg">
                              Selected Template:{" "}
                              <span
                                className={`font-semibold ${AGENT_COLORS.icon}`}
                              >
                                {selectedTemplateName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Company Name and Position Title */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <Building className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                                  <span className="truncate">
                                    Company Name *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Microsoft, Google, Apple"
                                    className={`bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400 text-sm sm:text-base h-10 sm:h-11`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="positionTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <Briefcase
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${AGENT_COLORS.icon} flex-shrink-0`}
                                  />
                                  <span className="truncate">
                                    Position Title *
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Software Engineer, Product Manager"
                                    className={`bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400 text-sm sm:text-base h-10 sm:h-11`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Industry and Tone */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
                                      <SelectValue placeholder="Select industry for enhanced crafting" />
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

                          <FormField
                            control={form.control}
                            name="tone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
                                  <span className="truncate">Writing Tone</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-10 sm:h-11 text-sm sm:text-base">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {tones.map((tone) => (
                                      <SelectItem
                                        key={tone.value}
                                        value={tone.value}
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {tone.label}
                                          </span>
                                          <span className="text-xs text-slate-400">
                                            {tone.desc}
                                          </span>
                                        </div>
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
                                  <FileSearch className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
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
                                        optimal cover letter crafting and
                                        personalization
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <div className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                  <span
                                    className={
                                      wordCount < 50
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
                                  placeholder="Paste the complete job posting here including requirements, responsibilities, and company information..."
                                  className="min-h-[150px] sm:min-h-[200px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-400 text-sm sm:text-base resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Activate Agent Button - CONSISTENT COLORS */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="pt-2 sm:pt-4"
                        >
                          <Button
                            type="submit"
                            className={`w-full ${AGENT_COLORS.button} text-white h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg`}
                            disabled={isCrafting}
                          >
                            {isCrafting ? (
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
                                  Agent Crafting Letter...
                                </span>
                              </>
                            ) : (
                              <>
                                <PenTool className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                                <span className="truncate">
                                  Craft My Cover Letter
                                </span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                              </>
                            )}
                          </Button>
                        </motion.div>

                        {/* Agent Features - CONSISTENT COLORS */}
                        <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-xl p-4 sm:p-6 border border-slate-700/30">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Shield
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${AGENT_COLORS.icon} flex-shrink-0`}
                              />
                              <span className="truncate">Secure Crafting</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Clock
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${AGENT_COLORS.icon} flex-shrink-0`}
                              />
                              <span className="truncate">
                                ~30 sec generation
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
                              <Brain
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${AGENT_COLORS.icon} flex-shrink-0`}
                              />
                              <span className="truncate">AI-Personalized</span>
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
                <AgentCraftingResults
                  results={results}
                  onNewCraft={handleResetAgent}
                  onViewAllLetters={() => navigate("/saved-cover-letters")}
                />
              </div>
            )}
          </motion.div>
        </div>
        {/* --- CHANGE: Render the template viewer modal --- */}
        <CoverLetterTemplateViewer
          isOpen={isTemplateViewerOpen}
          onOpenChange={setIsTemplateViewerOpen}
          currentTemplateId={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
        />
      </div>
    </TooltipProvider>
  );
};

export default CoverLetterCraftingAgent;
