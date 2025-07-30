import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Enhanced interface with better error handling and loading states
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{
    data?: any;
    error?: AuthError | null;
    success: boolean;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data?: any;
    error?: AuthError | null;
    success: boolean;
  }>;
  signInWithGoogle: () => Promise<{
    data?: any;
    error?: AuthError | null;
    success: boolean;
  }>;
  signInWithLinkedIn: () => Promise<{
    data?: any;
    error?: AuthError | null;
    success: boolean;
  }>;
  signOut: () => Promise<{
    error?: AuthError | null;
    success: boolean;
  }>;
  resetPassword: (email: string) => Promise<{
    error?: AuthError | null;
    success: boolean;
  }>;
  isAuthenticated: boolean;
  userMetadata: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook with enhanced error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Enhanced AuthProvider with premium features
export const AuthProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Memoized computed values
    const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
    const userMetadata = useMemo(() => user?.user_metadata || {}, [user]);

    // Enhanced auth state handler
    const handleAuthStateChange = useCallback(
      (event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Enhanced logging for development
        if (process.env.NODE_ENV === "development") {
          console.log(`[ApplyForge Auth] ${event}:`, {
            user: session?.user?.email || "No user",
            session: !!session,
            timestamp: new Date().toISOString(),
          });
        }
      },
      []
    );

    // Initialize auth state
    useEffect(() => {
      let mounted = true;

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(handleAuthStateChange);

      // Get initial session
      const initializeAuth = async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (mounted) {
            if (error) {
              console.error(
                "[ApplyForge Auth] Session initialization error:",
                error
              );
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        } catch (error) {
          console.error("[ApplyForge Auth] Initialization failed:", error);
          if (mounted) {
            setLoading(false);
          }
        }
      };

      initializeAuth();

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }, [handleAuthStateChange]);

    // Enhanced sign up with better error handling
    const signUp = useCallback(
      async (email: string, password: string, fullName?: string) => {
        setIsSigningUp(true);

        try {
          const redirectUrl = `${window.location.origin}/auth/callback`;

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                full_name: fullName || "",
                avatar_url: "", // Placeholder for future avatar feature
                onboarding_completed: false,
              },
            },
          });

          return {
            data,
            error,
            success: !error,
          };
        } catch (err) {
          console.error("[ApplyForge Auth] Sign up error:", err);
          return {
            error: err as AuthError,
            success: false,
          };
        } finally {
          setIsSigningUp(false);
        }
      },
      []
    );

    // Enhanced sign in with better error handling
    const signIn = useCallback(async (email: string, password: string) => {
      setIsSigningIn(true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return {
          data,
          error,
          success: !error,
        };
      } catch (err) {
        console.error("[ApplyForge Auth] Sign in error:", err);
        return {
          error: err as AuthError,
          success: false,
        };
      } finally {
        setIsSigningIn(false);
      }
    }, []);

    // Enhanced Google sign in
    const signInWithGoogle = useCallback(async () => {
      setIsSigningIn(true);

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        return {
          data,
          error,
          success: !error,
        };
      } catch (err) {
        console.error("[ApplyForge Auth] Google sign in error:", err);
        return {
          error: err as AuthError,
          success: false,
        };
      } finally {
        setIsSigningIn(false);
      }
    }, []);

    // Enhanced LinkedIn sign in
    const signInWithLinkedIn = useCallback(async () => {
      setIsSigningIn(true);

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        return {
          data,
          error,
          success: !error,
        };
      } catch (err) {
        console.error("[ApplyForge Auth] LinkedIn sign in error:", err);
        return {
          error: err as AuthError,
          success: false,
        };
      } finally {
        setIsSigningIn(false);
      }
    }, []);

    // Enhanced sign out
    const signOut = useCallback(async () => {
      setIsSigningOut(true);

      try {
        const { error } = await supabase.auth.signOut();

        // Clear local state immediately for better UX
        if (!error) {
          setUser(null);
          setSession(null);
        }

        return {
          error,
          success: !error,
        };
      } catch (err) {
        console.error("[ApplyForge Auth] Sign out error:", err);
        return {
          error: err as AuthError,
          success: false,
        };
      } finally {
        setIsSigningOut(false);
      }
    }, []);

    // Password reset functionality
    const resetPassword = useCallback(async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        return {
          error,
          success: !error,
        };
      } catch (err) {
        console.error("[ApplyForge Auth] Password reset error:", err);
        return {
          error: err as AuthError,
          success: false,
        };
      }
    }, []);

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(
      () => ({
        user,
        session,
        loading,
        isSigningIn,
        isSigningUp,
        isSigningOut,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        resetPassword,
        isAuthenticated,
        userMetadata,
      }),
      [
        user,
        session,
        loading,
        isSigningIn,
        isSigningUp,
        isSigningOut,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        resetPassword,
        isAuthenticated,
        userMetadata,
      ]
    );

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  }
);

AuthProvider.displayName = "AuthProvider";

// Additional utility hooks for specific auth states
export const useAuthLoading = () => {
  const { loading, isSigningIn, isSigningUp, isSigningOut } = useAuth();
  return loading || isSigningIn || isSigningUp || isSigningOut;
};

export const useAuthUser = () => {
  const { user, isAuthenticated, userMetadata } = useAuth();
  return { user, isAuthenticated, userMetadata };
};

export const useAuthActions = () => {
  const {
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    resetPassword,
  } = useAuth();
  return {
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    resetPassword,
  };
};
