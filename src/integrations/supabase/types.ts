export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];


export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      applied_jobs: {
        Row: {
          applied_at: string;
          apply_url: string;
          company_linkedin_url: string | null;
          company_name: string;
          employment_type: string | null;
          id: string;
          industries: string | null;
          job_description: string | null;
          job_function: string | null;
          job_link: string | null;
          job_location: string;
          job_title: string;
          posted_at: string;
          seniority_level: string | null;
          user_id: string;
        };
        Insert: {
          applied_at?: string;
          apply_url: string;
          company_linkedin_url?: string | null;
          company_name: string;
          employment_type?: string | null;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_link?: string | null;
          job_location: string;
          job_title: string;
          posted_at: string;
          seniority_level?: string | null;
          user_id: string;
        };
        Update: {
          applied_at?: string;
          apply_url?: string;
          company_linkedin_url?: string | null;
          company_name?: string;
          employment_type?: string | null;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_link?: string | null;
          job_location?: string;
          job_title?: string;
          posted_at?: string;
          seniority_level?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      cover_letters: {
        Row: {
          company_name: string;
          cover_letter_url: string;
          created_at: string;
          file_type: string;
          generated_at: string | null;
          id: string;
          job_description: string;
          original_resume_name: string | null;
          position_title: string;
          user_id: string;
        };
        Insert: {
          company_name: string;
          cover_letter_url: string;
          created_at?: string;
          file_type?: string;
          generated_at?: string | null;
          id?: string;
          job_description: string;
          original_resume_name?: string | null;
          position_title: string;
          user_id: string;
        };
        Update: {
          company_name?: string;
          cover_letter_url?: string;
          created_at?: string;
          file_type?: string;
          generated_at?: string | null;
          id?: string;
          job_description?: string;
          original_resume_name?: string | null;
          position_title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      // =================================================================
      // NEW: Added job_data table definition
      // =================================================================
      job_data: {
        Row: {
          apply_link: string | null;
          company_name: string | null;
          created_at: string;
          experience_level: string | null;
          industries: string | null;
          job_description: string | null;
          job_id: number;
          job_title: string | null;
          job_type: string | null;
          linkedin_apply_link: string | null;
          location: string | null;
          posted_at: string | null;
        };
        Insert: {
          apply_link?: string | null;
          company_name?: string | null;
          created_at?: string;
          experience_level?: string | null;
          industries?: string | null;
          job_description?: string | null;
          job_id: number;
          job_title?: string | null;
          job_type?: string | null;
          linkedin_apply_link?: string | null;
          location?: string | null;
          posted_at?: string | null;
        };
        Update: {
          apply_link?: string | null;
          company_name?: string | null;
          created_at?: string;
          experience_level?: string | null;
          industries?: string | null;
          job_description?: string | null;
          job_id?: number;
          job_title?: string | null;
          job_type?: string | null;
          linkedin_apply_link?: string | null;
          location?: string | null;
          posted_at?: string | null;
        };
        Relationships: [];
      };
      job_search_results: {
        Row: {
          apply_link: string;
          company_linkedin_url: string | null;
          company_name: string;
          created_at: string;
          employment_type: string | null;
          experience_level: string;
          id: string;
          industries: string | null;
          job_description: string | null;
          job_function: string | null;
          job_title: string;
          job_type: string;
          location: string;
          posted_at: string;
          salary_info: Json | null;
          search_query: Json | null;
          seniority_level: string | null;
          user_id: string;
          work_type: string;
        };
        Insert: {
          apply_link: string;
          company_linkedin_url?: string | null;
          company_name: string;
          created_at?: string;
          employment_type?: string | null;
          experience_level: string;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_title: string;
          job_type: string;
          location: string;
          posted_at: string;
          salary_info?: Json | null;
          search_query?: Json | null;
          seniority_level?: string | null;
          user_id: string;
          work_type: string;
        };
        Update: {
          apply_link?: string;
          company_linkedin_url?: string | null;
          company_name?: string;
          created_at?: string;
          employment_type?: string | null;
          experience_level?: string;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_title?: string;
          job_type?: string;
          location?: string;
          posted_at?: string;
          salary_info?: Json | null;
          search_query?: Json | null;
          seniority_level?: string | null;
          user_id?: string;
          work_type?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          payment_id: string | null;
          plan: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          payment_id?: string | null;
          plan?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          payment_id?: string | null;
          plan?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          apply_url: string;
          company_linkedin_url: string | null;
          company_name: string;
          employment_type: string | null;
          id: string;
          industries: string | null;
          job_description: string | null;
          job_function: string | null;
          job_link: string | null;
          job_location: string;
          job_title: string;
          posted_at: string;
          saved_at: string;
          seniority_level: string | null;
          user_id: string;
        };
        Insert: {
          apply_url: string;
          company_linkedin_url?: string | null;
          company_name: string;
          employment_type?: string | null;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_link?: string | null;
          job_location: string;
          job_title: string;
          posted_at: string;
          saved_at?: string;
          seniority_level?: string | null;
          user_id: string;
        };
        Update: {
          apply_url?: string;
          company_linkedin_url?: string | null;
          company_name?: string;
          employment_type?: string | null;
          id?: string;
          industries?: string | null;
          job_description?: string | null;
          job_function?: string | null;
          job_link?: string | null;
          job_location?: string;
          job_title?: string;
          posted_at?: string;
          saved_at?: string;
          seniority_level?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      tailored_resumes: {
        Row: {
          created_at: string;
          file_type: string;
          id: string;
          job_description: string;
          resume_data: string;
          title: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          file_type?: string;
          id?: string;
          job_description: string;
          resume_data: string;
          title?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          file_type?: string;
          id?: string;
          job_description?: string;
          resume_data?: string;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_usage: {
        Row: {
          ats_checks_used: number | null;
          // auto_applies_used: number | null;
          cover_letters_used: number | null;
          job_searches_used: number | null;
          last_reset_date: string | null;
          one_click_tailors_used: number | null;
          plan_type: string | null;
          resume_tailors_used: number | null;
          user_id: string;
        };
        Insert: {
          ats_checks_used?: number | null;
          // auto_applies_used?: number | null;
          cover_letters_used?: number | null;
          job_searches_used?: number | null;
          last_reset_date?: string | null;
          one_click_tailors_used?: number | null;
          plan_type?: string | null;
          resume_tailors_used?: number | null;
          user_id: string;
        };
        Update: {
          ats_checks_used?: number | null;
          // auto_applies_used?: number | null;
          cover_letters_used?: number | null;
          job_searches_used?: number | null;
          last_reset_date?: string | null;
          one_click_tailors_used?: number | null;
          plan_type?: string | null;
          resume_tailors_used?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      plan_limits: {
        Row: {
          // Based on your screenshot
          id: number;
          created_at: string;
          plan_type: string;
          usage_type: string;
          usage_limit: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          plan_type: string;
          usage_type: string;
          usage_limit: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          plan_type?: string;
          usage_type?: string;
          usage_limit?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_usage_secure: {
        Args: {
          p_target_user_id: string; // Corresponds to uuid
          p_usage_type: string; // Corresponds to text
          p_increment_amount: number; // Corresponds to integer
          p_current_version: number; // Corresponds to integer
          p_audit_metadata: Json; // Corresponds to jsonb
        };
        Returns: {
          // This structure must match the TABLE returned by your function
          user_id: string;
          plan_type: string;
          resume_tailors_used: number;
          cover_letters_used: number;
          job_searches_used: number;
          one_click_tailors_used: number;
          ats_checks_used: number;
          last_reset_date: string;
          last_updated: string;
          version: number;
          created_at: string;
          billing_cycle_start: string;
          billing_cycle_end: string;
        }[]; // The return is a set of records, so it's an array
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};


type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;


type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];


export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;


export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;


export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;


export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;


export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;


export const Constants = {
  public: {
    Enums: {},
  },
} as const;