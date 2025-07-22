import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Trash2, 
  ArrowLeft,
  Building,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CoverLetter {
  id: string;
  company_name: string;
  position_title: string;
  cover_letter_url: string;
  created_at: string;
  original_resume_name: string | null;
  file_type: string;
}

const SavedCoverLetters = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCoverLetters();
    }
  }, [user]);

  const fetchCoverLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user?.id)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      toast({
        title: "Error",
        description: "Failed to load cover letters.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!user) return;

    setDeletingIds(prev => new Set(prev).add(id));
    
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCoverLetters(prev => prev.filter(letter => letter.id !== id));
      toast({
        title: "Deleted",
        description: `Cover letter "${fileName}" has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to delete cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <Card className="w-full max-w-md mx-auto mobile-card">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4 mobile-text">Please log in to view cover letters.</p>
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
            <p className="mt-4 text-muted-foreground mobile-text">Loading cover letters...</p>
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
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-primary/20 text-primary">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <h1 className="mobile-title font-bold mb-2 sm:mb-4">
              Saved <span className="gradient-text">Cover Letters</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mobile-text">
              {coverLetters.length} {coverLetters.length === 1 ? 'cover letter' : 'cover letters'} saved
            </p>
          </div>

          {coverLetters.length === 0 ? (
            <Card className="glass text-center p-6 sm:p-8 mobile-card">
              <CardContent className="space-y-4">
                <div className="mb-4 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-muted/20">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Cover Letters Yet</h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 mobile-text">
                  Generate your first cover letter to get started.
                </p>
                <Button 
                  onClick={() => navigate('/cover-letter-generator')} 
                  className="bg-primary hover:bg-primary/80 text-primary-foreground min-h-[44px] touch-manipulation"
                >
                  Generate Cover Letter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mobile-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {coverLetters.map((letter) => (
                <Card key={letter.id} className="glass hover-lift group mobile-card">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                          {letter.position_title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 sm:mt-2 text-muted-foreground">
                          <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium truncate">{letter.company_name}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(letter.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    {letter.original_resume_name && (
                      <div className="text-xs sm:text-sm text-muted-foreground p-2 sm:p-3 bg-muted/20 rounded-lg">
                        <span className="font-medium">Original Resume:</span>
                        <br />
                        <span className="truncate block">{letter.original_resume_name}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(letter.cover_letter_url, `${letter.company_name}_${letter.position_title}_cover_letter.pdf`)}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px] sm:min-h-[36px] touch-manipulation flex-1 sm:flex-none"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(letter.id, `${letter.company_name}_${letter.position_title}`)}
                        disabled={deletingIds.has(letter.id)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground min-h-[44px] sm:min-h-[36px] touch-manipulation flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deletingIds.has(letter.id) ? 'Deleting...' : 'Delete'}
                      </Button>
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

export default SavedCoverLetters;
