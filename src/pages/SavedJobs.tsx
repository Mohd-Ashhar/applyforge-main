
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Bookmark, Calendar, Trash2, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load saved jobs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Job Removed",
        description: "The job has been removed from your saved jobs.",
      });
    } catch (error) {
      console.error('Error removing job:', error);
      toast({
        title: "Remove Failed",
        description: "There was an error removing the job.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center mobile-container">
        <Card className="w-full max-w-md mobile-card">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4 mobile-text">Please log in to view your saved jobs.</p>
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
              Saved Jobs
            </h1>
            <p className="mobile-text text-muted-foreground px-2">
              View and manage your saved job opportunities
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mobile-text">Loading your saved jobs...</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <Bookmark className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Saved Jobs Yet</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 mobile-text px-2">
                You haven't saved any jobs yet. Start by using our job finder to discover opportunities.
              </p>
              <Link to="/job-finder">
                <Button className="w-full sm:w-auto mobile-transition">Find Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mobile-grid">
            {savedJobs.map((job) => (
              <Card key={job.id} className="mobile-card mobile-transition hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg md:text-xl mb-2 break-words">
                        {job.job_title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.job_location}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        Saved on {new Date(job.saved_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => window.open(job.apply_url, '_blank')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 flex-1 mobile-transition text-xs sm:text-sm"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Apply</span>
                      </Button>
                      <Button
                        onClick={() => handleRemove(job.id)}
                        size="sm"
                        variant="destructive"
                        className="px-2 sm:px-3 mobile-transition"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {job.job_description && (
                  <CardContent className="pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2">Job Description:</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                          {job.job_description.length > 150 
                            ? job.job_description.substring(0, 150) + '...' 
                            : job.job_description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
