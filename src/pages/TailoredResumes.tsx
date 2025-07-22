
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TailoredResume {
  id: string;
  job_description: string;
  resume_data: string;
  file_type: string;
  created_at: string;
  title: string | null;
}

const TailoredResumes = () => {
  const [resumes, setResumes] = useState<TailoredResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTailoredResumes();
    }
  }, [user]);

  const fetchTailoredResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('tailored_resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching tailored resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load tailored resumes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (resume: TailoredResume) => {
    try {
      if (!resume.resume_data || !resume.file_type) {
        throw new Error("Missing resume download URL or file type");
      }

      const a = document.createElement("a");
      a.href = resume.resume_data;
      a.download = `tailored-resume-${new Date(
        resume.created_at
      ).toLocaleDateString()}.${resume.file_type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your tailored resume is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your resume.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      const { error } = await supabase
        .from('tailored_resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;

      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      toast({
        title: "Resume Deleted",
        description: "The tailored resume has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the resume.",
        variant: "destructive",
      });
    }
  };

  const formatJobDescription = (description: string) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center mobile-container">
        <Card className="w-full max-w-md mobile-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4 mobile-text">Please log in to view your tailored resumes.</p>
            <Link to="/auth">
              <Button className="w-full sm:w-auto">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-container py-4 sm:py-6 md:py-8 lg:py-12 max-w-6xl mx-auto">
        {/* Header with Back to Home Button */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6 mobile-transition hover:scale-105">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Button>
          </Link>
          
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="mobile-title font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
              Tailored Resumes
            </h1>
            <p className="mobile-text text-muted-foreground px-2">
              View and download your previously tailored resumes
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mobile-text">Loading your tailored resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Tailored Resumes Yet</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 mobile-text px-2">
                You haven't created any tailored resumes yet. Start by using our ATS checker to tailor your resume for specific job descriptions.
              </p>
              <Link to="/ats-checker">
                <Button className="w-full sm:w-auto mobile-transition">Create Tailored Resume</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mobile-grid">
            {resumes.map((resume) => (
              <Card key={resume.id} className="mobile-card mobile-transition hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex flex-col gap-2 mb-2 text-base sm:text-lg md:text-xl">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="truncate text-sm sm:text-base">{resume.title || 'Tailored Resume'}</span>
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          {resume.file_type.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Created on {new Date(resume.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => handleDownload(resume)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 flex-1 mobile-transition text-xs sm:text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Download</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(resume.id)}
                        size="sm"
                        variant="destructive"
                        className="px-2 sm:px-3 mobile-transition"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Job Description:</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                        {formatJobDescription(resume.job_description)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TailoredResumes;
