import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// Types remain the same
export type UsageType =
  | "resume_tailors_used"
  | "cover_letters_used"
  | "job_searches_used"
  | "one_click_tailors_used"
  | "ats_checks_used";

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

interface PlanLimits {
  [key: string]: number;
}

// The combined data structure that our fetching function will return
interface UsageAndLimits {
  usage: UserUsage;
  limits: PlanLimits;
}

/**
 * The core data fetching logic is now isolated in this function.
 * This function is used by TanStack Query.
 */
const fetchUsageAndLimits = async (
  userId?: string
): Promise<UsageAndLimits | null> => {
  if (!userId) return null;

  // We fetch usage data and all plan limits in parallel, just like before.
  const [usageRes, limitsRes] = await Promise.all([
    (supabase.rpc as any)("get_user_usage_secure", {
      p_target_user_id: userId,
    }).single(),
    supabase.from("plan_limits").select("plan_type, usage_type, usage_limit"),
  ]);

  // --- Process User Usage ---
  const { data: usageData, error: usageError } = usageRes;
  let effectiveUsageData: UserUsage;

  if (usageError && usageError.code !== "PGRST116") {
    console.error("Error loading usage via RPC:", usageError);
    throw new Error("Failed to fetch user usage.");
  }

  // If no usage record exists, create a default "Free" plan object.
  if (!usageData) {
    effectiveUsageData = {
      user_id: userId,
      plan_type: "Free",
      resume_tailors_used: 0,
      cover_letters_used: 0,
      job_searches_used: 0,
      one_click_tailors_used: 0,
      ats_checks_used: 0,
      last_reset_date: null,
      billing_cycle_end: null,
    };
  } else {
    effectiveUsageData = usageData as UserUsage;
  }

  // --- Process Plan Limits ---
  const { data: limitsData, error: limitsError } = limitsRes;
  let limitsObj: PlanLimits = {};
  if (limitsError) {
    console.error("Error loading limits:", limitsError);
    // Non-fatal, we can proceed with empty limits
  } else if (limitsData) {
    const currentPlan = effectiveUsageData.plan_type;
    limitsObj = limitsData
      .filter((limit) => limit.plan_type === currentPlan)
      .reduce((acc, limit) => {
        acc[limit.usage_type] = limit.usage_limit;
        return acc;
      }, {} as PlanLimits);
  }

  return { usage: effectiveUsageData, limits: limitsObj };
};

// Define a type for the options you can pass to your hook
type UsageTrackingOptions = Omit<
  UseQueryOptions<UsageAndLimits | null>,
  "queryKey" | "queryFn"
>;

/**
 * This is the refactored hook using TanStack Query.
 * It now accepts an options object to control fetching behavior.
 */
export const useUsageTracking = (options?: UsageTrackingOptions) => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    refetch: refreshUsage, // TanStack Query's refetch function is aliased to refreshUsage
  } = useQuery<UsageAndLimits | null>({
    // The query key uniquely identifies this data based on the user.
    queryKey: ["usageAndLimits", user?.id],
    // The query function is the one we defined above.
    queryFn: () => fetchUsageAndLimits(user?.id),
    // The query will only run if there is a logged-in user.
    enabled: !!user,
    // **This is the key change:** it applies any options passed in,
    // such as { refetchOnWindowFocus: false }
    ...options,
  });

  // Re-create the checkUsageLimit function using the data from useQuery.
  // useMemo ensures this function isn't re-created on every render.
  const checkUsageLimit = useMemo(
    () =>
      (usageType: UsageType): boolean => {
        if (!data || isLoading) return true; // Default to limit reached if no data

        const { usage, limits } = data;
        const currentValue = usage[usageType] || 0;
        const limit = limits[usageType];

        if (limit === undefined) return true; // Block if no limit defined
        if (limit === -1) return false; // -1 is unlimited

        return currentValue >= limit;
      },
    [data, isLoading]
  );

  return {
    // The returned values have the same names as before to avoid breaking changes.
    usage: data?.usage ?? null,
    limits: data?.limits ?? {},
    isLoading,
    refreshUsage,
    checkUsageLimit,
  };
};
