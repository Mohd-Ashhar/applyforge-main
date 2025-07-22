import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // ✅ ADD THIS MISSING IMPORT
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Upload, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsageTracking } from '@/hooks/useUsageTracking';

const atsCheckerSchema = z.object({
  jobDescription: z.string().min(100, 'Job description must be at least 100 characters'),
});

type ATSCheckerForm = z.infer<typeof atsCheckerSchema>;

interface ATSResult {
  matchScore: string;
  missingSkills: string[];
  feedback: string;
}

// Enhanced Loading Overlay with ATS-specific stages
const ATSLoadingOverlay = ({ show, stage = 0 }: { show: boolean; stage?: number }) => {
  const stages = [
    "Parsing your resume content...",
    "Analyzing job requirements...",
    "Checking ATS compatibility...",
    "Scoring keyword matches...",
    "Identifying skill gaps...",
    "Generating improvement recommendations..."
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
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 shadow-2xl"
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
            <span>Your resume data is encrypted and secure</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced File Upload Component
const FileUploadArea = ({ onFileSelect, selectedFile, error }: {
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
    const validFile = files.find(file => 
      ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );
    
    if (validFile) {
      onFileSelect(validFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${error ? 'border-destructive' : ''}
          ${selectedFile ? 'border-green-500 bg-green-50/5' : ''}
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
            if (file) {
              if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
                onFileSelect(file);
              }
            }
          }}
          className="hidden"
          id="resume-upload"
        />

        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <FileCheck className="w-8 h-8 text-green-500" />
            <div className="text-left">
              <p className="font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)} • Click to change
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Drop your resume here or click to browse</p>
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
          <AlertCircle className="w-4 h-4" />
          Please upload your resume
        </motion.p>
      )}
    </div>
  );
};

const ATSChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<ATSResult | null>(null);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkUsageLimit, refreshUsage } = useUsageTracking();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ATSCheckerForm>({
    resolver: zodResolver(atsCheckerSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const jobDescription = form.watch('jobDescription');

  // Auto-save draft functionality
  useEffect(() => {
    if (saveAsDraft) {
      const draftData = { jobDescription, industry };
      localStorage.setItem('atsCheckerDraft', JSON.stringify(draftData));
    }
  }, [jobDescription, industry, saveAsDraft]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('atsCheckerDraft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        if (draftData.jobDescription) {
          toast({
            title: "Draft Found",
            description: "We found a saved draft. Click 'Load Draft' to restore it.",
            action: (
              <Button
                size="sm"
                onClick={() => {
                  form.setValue('jobDescription', draftData.jobDescription || '');
                  setIndustry(draftData.industry || '');
                }}
              >
                Load Draft
              </Button>
            ),
          });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [toast, form]);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Marketing', 'Sales',
    'Education', 'Manufacturing', 'Retail', 'Consulting', 'Engineering',
    'Design', 'Media', 'Legal', 'Real Estate', 'Other'
  ];

  const simulateLoadingStages = () => {
    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, index) => {
      setTimeout(() => setLoadingStage(stage), index * 2500);
    });
  };

  const loadSampleData = () => {
    setIndustry('technology');
    form.setValue('jobDescription', `We are seeking a Senior Software Engineer to join our dynamic development team. The ideal candidate will have 5+ years of experience in full-stack development and will be responsible for building scalable web applications.

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
• Open source contributions`);
    
    toast({
      title: "Sample Data Loaded",
      description: "Form filled with example data. Don't forget to upload your resume!",
    });
  };

  const handleClearForm = () => {
    form.reset();
    setSelectedFile(null);
    setIndustry('');
    setResults(null);
    localStorage.removeItem('atsCheckerDraft');
    
    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  const onSubmit = async (formData: ATSCheckerForm) => { // ✅ FIXED: Renamed parameter to avoid confusion
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a resume file to check.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the ATS checker.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Check usage limit
    if (checkUsageLimit('ats_checks_used')) {
      toast({
        title: "Usage Limit Reached",
        description: "You have reached your ATS check limit for this plan. Please upgrade to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingStage(0);
    simulateLoadingStages();
    
    try {
      // Convert file to base64
      const base64Resume = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch('https://n8n.applyforge.cloud/webhook-test/ats-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          feature: "ats_checks",
          resume: base64Resume,
          jobDescription: formData.jobDescription, // ✅ FIXED: Using formData parameter instead of undefined 'data'
          industry: industry,
          fileType: selectedFile.type === 'application/pdf' ? 'pdf' : 'docx'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check ATS compatibility');
      }

      const responseData = await response.json();
      
      // Check if limit reached
      if (responseData.allowed === false) {
        toast({
          title: "Limit Reached",
          description: responseData.message || "You've reached your limit for this feature.",
          variant: "destructive",
        });
        return;
      }

      const result = responseData.results || responseData;
      setResults(result);

      // Clear draft
      localStorage.removeItem('atsCheckerDraft');
      
      // Refresh usage data to get updated counts
      refreshUsage();
      
      // Scroll to results section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
      toast({
        title: "ATS Analysis Complete! 🎯",
        description: "Your resume has been analyzed for ATS compatibility.",
        action: (
          <Button
            size="sm"
            onClick={() => navigate('/ai-resume-tailor')}
          >
            Improve Now
          </Button>
        ),
      });
      
    } catch (error) {
      console.error('Error checking ATS compatibility:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to check ATS compatibility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingStage(0);
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score.replace('%', ''));
    if (numScore >= 80) return 'text-green-500';
    if (numScore >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: string) => {
    const numScore = parseInt(score.replace('%', ''));
    if (numScore >= 80) return 'bg-green-500/20';
    if (numScore >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const getScoreGradient = (score: string) => {
    const numScore = parseInt(score.replace('%', ''));
    if (numScore >= 80) return 'from-green-500 to-emerald-500';
    if (numScore >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getJobDescriptionWordCount = () => jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  const wordCount = getJobDescriptionWordCount();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <ATSLoadingOverlay show={isLoading} stage={loadingStage} />

        <div className="container mx-auto px-4 py-8 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-6 hover:bg-appforge-blue/10">
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
                <Target className="w-12 h-12" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                ATS Resume <span className="gradient-text">Checker</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                Check your resume's compatibility with Applicant Tracking Systems
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>ATS Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>Detailed Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Score & Insights</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        Analyze Your Resume
                      </CardTitle>
                      <CardDescription>
                        Upload your resume and job description to get detailed ATS compatibility insights
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSampleData}
                            className="text-xs"
                          >
                            Try Example
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Load sample job data to test ATS checker</TooltipContent>
                      </Tooltip>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearForm}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Resume Upload */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Upload Your Resume *
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Upload your resume to analyze its ATS compatibility against the job description.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        
                        <FileUploadArea
                          onFileSelect={setSelectedFile}
                          selectedFile={selectedFile}
                          error={!selectedFile}
                        />
                      </div>

                      {/* Industry Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry (Optional)</Label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry for better analysis" />
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
                            <div className="flex items-center justify-between">
                              <FormLabel className="flex items-center gap-2">
                                Job Description *
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>Paste the complete job posting to get accurate ATS compatibility analysis and keyword matching.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={wordCount < 100 ? 'text-destructive' : wordCount > 200 ? 'text-green-600' : 'text-yellow-600'}>
                                  {wordCount} words
                                </span>
                                {wordCount < 100 && <span className="text-destructive">(min 100)</span>}
                              </div>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Paste the complete job description here including requirements, responsibilities, and skills..." 
                                className="min-h-[200px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Advanced Options */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="save-draft"
                          checked={saveAsDraft}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveAsDraft(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="save-draft" className="text-sm flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Auto-save as draft while typing
                        </Label>
                      </div>

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-12 text-lg font-semibold shadow-lg"
                          disabled={isLoading}
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Target className="w-5 h-5" />
                              </motion.div>
                              Analyzing Resume...
                            </>
                          ) : (
                            <>
                              <Target className="w-5 h-5 mr-2" />
                              Check ATS Compatibility
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Trust Indicators */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Secure Analysis</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>~30 sec analysis</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-500" />
                            <span>AI Powered</span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Results Section */}
            <AnimatePresence>
              {results && (
                <motion.div
                  className="space-y-6"
                  ref={resultsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Success Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
                    >
                      <BarChart3 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-2">ATS Analysis Complete! 📊</h2>
                    <p className="text-muted-foreground">
                      Here's how your resume performs against ATS systems
                    </p>
                  </div>

                  {/* Enhanced Match Score Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle className="text-2xl text-appforge-blue flex items-center gap-3">
                          <TrendingUp className="w-6 h-6" />
                          ATS Compatibility Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-center p-8 rounded-xl ${getScoreBgColor(results.matchScore)} border-2 border-opacity-20`}>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className={`text-7xl font-bold mb-3 bg-gradient-to-r ${getScoreGradient(results.matchScore)} bg-clip-text text-transparent`}
                          >
                            {results.matchScore}
                          </motion.div>
                          <p className="text-lg font-medium text-muted-foreground">Match Score</p>
                          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              {parseInt(results.matchScore.replace('%', '')) >= 80 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="text-muted-foreground">
                                {parseInt(results.matchScore.replace('%', '')) >= 80 ? 'Excellent' : 
                                 parseInt(results.matchScore.replace('%', '')) >= 60 ? 'Good' : 'Needs Improvement'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mt-6">
                          <Button 
                            onClick={() => navigate('/ai-resume-tailor')}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Improve Resume
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex-1"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Analyze Another
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Enhanced Missing Skills Card */}
                  {results.missingSkills && results.missingSkills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="glass border-yellow-200 dark:border-yellow-800">
                        <CardHeader>
                          <CardTitle className="text-xl flex items-center gap-3 text-yellow-600">
                            <AlertTriangle className="w-5 h-5" />
                            Missing Keywords & Skills
                          </CardTitle>
                          <CardDescription>
                            These keywords from the job description weren't found in your resume
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {results.missingSkills.map((skill, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                              >
                                <Badge 
                                  variant="outline" 
                                  className="border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Enhanced Detailed Feedback Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="glass border-green-200 dark:border-green-800">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-3 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          Detailed Recommendations
                        </CardTitle>
                        <CardDescription>
                          AI-powered suggestions to improve your ATS compatibility
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {results.feedback.split('. ').map((sentence, index) => {
                            if (sentence.trim() === '') return null;
                            
                            // Check if it's a section header (contains a colon)
                            if (sentence.includes(':')) {
                              const [header, content] = sentence.split(':', 2);
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="mb-4"
                                >
                                  <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    {header.trim()}:
                                  </h4>
                                  {content && <p className="text-muted-foreground ml-6">{content.trim()}</p>}
                                </motion.div>
                              );
                            } else {
                              return (
                                <motion.p
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="text-muted-foreground mb-2 ml-6 flex items-start gap-2"
                                >
                                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                  {sentence.trim()}.
                                </motion.p>
                              );
                            }
                          })}
                        </div>
                      </CardContent>
                    </Card>
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

export default ATSChecker;
