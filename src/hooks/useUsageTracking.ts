import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// The types for identifying features remain the same.
export type UsageType =
  | "resume_tailors_used"
  | "cover_letters_used"
  | "job_searches_used"
  | "one_click_tailors_used"
  | "ats_checks_used";

// This interface is robustly typed to handle potential nulls from the DB.
interface UserUsage {
  user_id: string;
  plan_type: string;
  resume_tailors_used: number;
  cover_letters_used: number;
  job_searches_used: number;
  one_click_tailors_used: number;
  ats_checks_used: number;
  last_reset_date: string | null;
  billing_cycle_end: string | null;
}

// A simple map for the current plan's limits.
interface PlanLimits {
  [key: string]: number;
}

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [limits, setLimits] = useState<PlanLimits>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // We call the database function via RPC to trigger the auto-reset logic.
      // We also fetch all possible plan limits at the same time.
      const [usageRes, limitsRes] = await Promise.all([
        // FIX: Cast .rpc to 'any' to bypass strict type checking for this specific call.
        // This tells TypeScript to trust that this function exists on the backend.
        (supabase.rpc as any)("get_user_usage_secure", {
          p_target_user_id: user.id,
        }).single(),
        supabase
          .from("plan_limits")
          .select("plan_type, usage_type, usage_limit"),
      ]);

      // --- Process User Usage ---
      const { data: usageData, error: usageError } = usageRes;
      let effectiveUsageData: UserUsage | null = usageData as UserUsage | null;

      if (usageError) {
        // It's possible for the RPC to return no rows for a new user, which is not an error.
        if (usageError.code !== "PGRST116") {
          console.error("Error loading usage via RPC:", usageError);
        }
      }

      // If no usage record exists after the RPC call, it means they are a new user.
      // We create a default "Free" plan object for them on the client-side.
      if (!effectiveUsageData) {
        effectiveUsageData = {
          user_id: user.id,
          plan_type: "Free",
          resume_tailors_used: 0,
          cover_letters_used: 0,
          job_searches_used: 0,
          one_click_tailors_used: 0,
          ats_checks_used: 0,
          last_reset_date: null,
          billing_cycle_end: null,
        };
      }
      setUsage(effectiveUsageData);

      // --- Process Plan Limits ---
      const { data: limitsData, error: limitsError } = limitsRes;
      if (limitsError) {
        console.error("Error loading limits:", limitsError);
      } else if (limitsData) {
        // Filter the full list of limits to only include those for the user's current plan.
        const currentPlan = effectiveUsageData.plan_type;
        const limitsObj = limitsData
          .filter((limit) => limit.plan_type === currentPlan)
          .reduce((acc, limit) => {
            acc[limit.usage_type] = limit.usage_limit;
            return acc;
          }, {} as PlanLimits);
        setLimits(limitsObj);
      }
    } catch (error) {
      console.error("Error in loadData:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const checkUsageLimit = (usageType: UsageType): boolean => {
    if (!usage || isLoading) return true; // Default to limit reached if no data or loading

    const currentValue = usage[usageType] || 0;
    const limit = limits[usageType];

    if (limit === undefined) return true; // If no limit is defined, block by default.
    if (limit === -1) return false; // -1 means unlimited usage.

    return currentValue >= limit;
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Clear data when user logs out
      setIsLoading(false);
      setUsage(null);
      setLimits({});
    }
  }, [user, loadData]);

  return {
    usage,
    limits,
    isLoading,
    refreshUsage: loadData,
    checkUsageLimit,
  };
};
