
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      // Send feedback to webhook
      const response = await fetch('https://primary-production-800d.up.railway.app/webhook-test/feedback-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: profile?.full_name || 'Anonymous',
          userEmail: profile?.email || user.email,
          rating: rating,
          suggestion: suggestion,
          comment: comment
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const result = await response.text();
      
      // Show result in modal
      setResultMessage(result || "Thank you for your feedback!");
      setShowResultModal(true);

      // Reset form
      setRating(0);
      setSuggestion('');
      setComment('');

      // Auto-close modal and redirect after 5 seconds
      setTimeout(() => {
        setShowResultModal(false);
        navigate('/');
      }, 5000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <Card className="w-full max-w-md mx-auto mobile-card">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4 mobile-text">Please log in to submit feedback.</p>
              <Button onClick={() => navigate('/auth')} className="min-h-[44px]">Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background scroll-container">
      <div className="mobile-container py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-primary/10 min-h-[44px] touch-manipulation mobile-transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl w-fit mx-auto bg-purple-500/20 text-purple-500">
              <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <h1 className="mobile-title font-bold mb-2 sm:mb-4">
              Your <span className="gradient-text">Feedback</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mobile-text">
              Help us improve ApplyForge with your valuable insights
            </p>
          </div>

          <Card className="glass mobile-card">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Share Your Experience
              </CardTitle>
              <CardDescription className="mobile-text">
                Your feedback helps us make ApplyForge better for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label className="text-sm sm:text-base">Rating *</Label>
                  <div className="flex items-center gap-1 sm:gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className={`p-1 sm:p-2 hover:scale-110 transition-transform touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                      {rating > 0 && `${rating} star${rating !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="suggestion" className="text-sm sm:text-base">Suggestions</Label>
                  <Textarea
                    id="suggestion"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="What features or improvements would you like to see?"
                    className="mt-1 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base mobile-text"
                  />
                </div>

                <div>
                  <Label htmlFor="comment" className="text-sm sm:text-base">Comments</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience with ApplyForge..."
                    className="mt-1 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base mobile-text"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 min-h-[44px] touch-manipulation text-sm sm:text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="sm:max-w-md mobile-card">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 text-base sm:text-lg">Success!</DialogTitle>
            <DialogDescription className="text-center pt-4 mobile-text">
              {resultMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
            Redirecting to home page in 5 seconds...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedback;
