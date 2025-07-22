
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Building, 
  ExternalLink,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AppliedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_description: string | null;
  applied_at: string;
  seniority_level: string | null;
  employment_type: string | null;
  apply_url: string;
  job_link: string | null;
  company_linkedin_url: string | null;
  posted_at: string;
  job_function: string | null;
  industries: string | null;
}

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  const fetchAppliedJobs = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching applied jobs for user:', user.id);
      const { data, error } = await supabase
        .from('applied_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applied jobs:', error);
        throw error;
      }
      
      console.log('Applied jobs fetched successfully:', data);
      setAppliedJobs(data || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedAt = (posted: string) => {
    if (posted.includes('-') && posted.length === 10) {
      const date = new Date(posted);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return posted;
  };

  const truncateDescription = (description: string, maxLength: number = 200) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <Card className="w-full max-w-md mx-auto mobile-card">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4 mobile-text">Please log in to view applied jobs.</p>
              <Button onClick={() => navigate('/auth')} className="min-h-[44px]">Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground mobile-text">Loading applied jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background scroll-container">
      <div className="mobile-container py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-primary/10 min-h-[44px] touch-manipulation mobile-transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-green-500/20 text-green-500">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <h1 className="mobile-title font-bold mb-2 sm:mb-4">
              Applied <span className="gradient-text">Jobs</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mobile-text">
              {appliedJobs.length} {appliedJobs.length === 1 ? 'application' : 'applications'} tracked
            </p>
          </div>

          {appliedJobs.length === 0 ? (
            <Card className="glass text-center p-6 sm:p-8 mobile-card">
              <CardContent className="space-y-4">
                <div className="mb-4 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-muted/20">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Applied Jobs Yet</h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 mobile-text">
                  Start applying to jobs and track your applications here.
                </p>
                <Button 
                  onClick={() => navigate('/job-finder')} 
                  className="bg-primary hover:bg-primary/80 text-primary-foreground min-h-[44px] touch-manipulation"
                >
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mobile-grid">
              {appliedJobs.map((job) => (
                <Card key={job.id} className="glass hover-lift group mobile-card">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                          <Badge className="bg-green-500/20 text-green-500 text-xs">Applied</Badge>
                        </div>
                        <CardTitle className="text-base sm:text-xl group-hover:text-primary transition-colors">
                          {job.job_title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 sm:mt-2 text-muted-foreground">
                          <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium truncate">{job.company_name}</span>
                          {job.company_linkedin_url && (
                            <Button variant="ghost" size="sm" asChild className="p-1 h-auto">
                              <a href={job.company_linkedin_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-primary/20 text-primary flex-shrink-0">
                        Applied: {new Date(job.applied_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{job.job_location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{job.seniority_level}</span>
                        {job.employment_type && (
                          <Badge variant="outline" className="text-xs">
                            {job.employment_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {job.job_function && (
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge variant="outline" className="text-xs">{job.job_function}</Badge>
                        {job.industries && <Badge variant="outline" className="text-xs">{job.industries}</Badge>}
                      </div>
                    )}

                    {job.job_description && (
                      <div className="p-2 sm:p-3 bg-muted/20 rounded-lg">
                        <p className="text-xs sm:text-sm text-muted-foreground" 
                           dangerouslySetInnerHTML={{ 
                             __html: truncateDescription(job.job_description.replace(/&gt;/g, '>').replace(/&lt;/g, '<'))
                           }} 
                        />
                      </div>
                    )}
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Originally posted {formatPostedAt(job.posted_at)}</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button 
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px] sm:min-h-[36px] touch-manipulation flex-1 sm:flex-none"
                        >
                          <a 
                            href={job.apply_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2"
                          >
                            View Application
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        
                        {job.job_link && (
                          <Button 
                            asChild
                            size="sm"
                            variant="outline"
                            className="min-h-[44px] sm:min-h-[36px] touch-manipulation flex-1 sm:flex-none"
                          >
                            <a 
                              href={job.job_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2"
                            >
                              View Job
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
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

export default AppliedJobs;
