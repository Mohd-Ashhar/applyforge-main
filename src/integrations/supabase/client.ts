import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Simple utility for database error handling
export const supabaseUtils = {
  handleDatabaseError: (error: any, context: string): string => {
    console.error(`Database error in ${context}:`, error);

    if (error?.message?.includes("JWT")) {
      return "Your session has expired. Please sign in again.";
    }

    if (error?.code === "23505") {
      return "This item already exists. Please try with different data.";
    }

    if (error?.code === "23503") {
      return "Cannot perform this action due to related data constraints.";
    }

    if (error?.code === "PGRST116") {
      return "No data found for your request.";
    }

    return error?.message || "An unexpected error occurred. Please try again.";
  },
};
