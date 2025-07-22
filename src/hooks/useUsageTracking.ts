
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UsageType = 'resume_tailors_used' | 'cover_letters_used' | 'job_searches_used' | 'one_click_tailors_used' | 'ats_checks_used';

interface UserUsage {
  user_id: string;
  plan_type: string;
  resume_tailors_used: number;
  cover_letters_used: number;
  job_searches_used: number;
  one_click_tailors_used: number;
  ats_checks_used: number;
  last_reset_date: string | null;
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user usage data (read-only)
  const loadUsage = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading usage:', error);
        return;
      }

      if (data) {
        setUsage(data);
      } else {
        // If no usage record exists, set default values for display
        setUsage({
          user_id: user.id,
          plan_type: 'Free',
          resume_tailors_used: 0,
          cover_letters_used: 0,
          job_searches_used: 0,
          one_click_tailors_used: 0,
          ats_checks_used: 0,
          last_reset_date: null
        });
      }
    } catch (error) {
      console.error('Error in loadUsage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has reached limit for a feature (read-only utility)
  const checkUsageLimit = (usageType: UsageType): boolean => {
    if (!usage) return false;

    const currentValue = usage[usageType] || 0;
    
    // Define limits based on plan type
    const limits = {
      'Free': {
        resume_tailors_used: 5,
        cover_letters_used: 3,
        job_searches_used: 10,
        one_click_tailors_used: 2,
        ats_checks_used: 3
      },
      'Basic': {
        resume_tailors_used: 50,
        cover_letters_used: 25,
        job_searches_used: 100,
        one_click_tailors_used: 20,
        ats_checks_used: 25
      },
      'Pro': {
        resume_tailors_used: -1, // unlimited
        cover_letters_used: -1,
        job_searches_used: -1,
        one_click_tailors_used: -1,
        ats_checks_used: -1
      }
    };

    const planLimits = limits[usage.plan_type as keyof typeof limits] || limits['Free'];
    const limit = planLimits[usageType];

    // -1 means unlimited
    if (limit === -1) return false;

    return currentValue >= limit;
  };

  // Refresh usage data (useful for polling or manual refresh)
  const refreshUsage = () => {
    if (user) {
      loadUsage();
    }
  };

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user]);

  return {
    usage,
    isLoading,
    loadUsage,
    checkUsageLimit,
    refreshUsage
  };
};
