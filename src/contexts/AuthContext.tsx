import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Enhanced type definitions
interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
  [key: string]: any;
}

interface UserProfile {
  full_name?: string;
  avatar_url?: string;
  onboarding_completed?: boolean;
}

interface AuthResult<T = any> {
  data?: T;
  error?: EnhancedAuthError | null;
  success: boolean;
}

interface SignUpData {
  user: User | null;
  session: Session | null;
}

interface SignInData {
  user: User;
  session: Session;
}

// Enhanced error handling
enum AuthErrorType {
  INVALID_CREDENTIALS = "invalid_credentials",
  RATE_LIMITED = "rate_limited",
  NETWORK_ERROR = "network_error",
  VALIDATION_ERROR = "validation_error",
  SESSION_EXPIRED = "session_expired",
  UNKNOWN_ERROR = "unknown_error",
}

interface EnhancedAuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
  originalError?: AuthError;
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes
};

// ✅ FIXED: Browser-safe URL construction (from your original working code)
const getRedirectUrl = (path: string): string => {
  if (typeof window !== "undefined") {
    // Ensure path starts with single slash and no double slashes
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = window.location.origin;
    return `${baseUrl}${cleanPath}`;
  }
  // Server-side fallback
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath;
};

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128;
};

const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

const reportError = (error: any, context: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.error(`[ApplyForge Auth] ${context}:`, error);
  } else {
    // Replace with your actual error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, { 
        tags: { context, app: 'ApplyForge' } 
      });
    }
    
    // Also log critical auth errors to your backend
    if (error?.code || error?.status >= 500) {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message, context, timestamp: Date.now() })
      }).catch(() => {}); // Silently fail
    }
  }
};


// Enhanced interface
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  isRefreshing: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<AuthResult<SignUpData>>;
  signIn: (email: string, password: string) => Promise<AuthResult<SignInData>>;
  signInWithGoogle: () => Promise<AuthResult<any>>;
  signInWithLinkedIn: () => Promise<AuthResult<any>>;
  signOut: () => Promise<AuthResult<void>>;
  resetPassword: (email: string) => Promise<AuthResult<void>>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResult<User>>;
  refreshSession: () => Promise<AuthResult<Session>>;
  isAuthenticated: boolean;
  userMetadata: UserMetadata;
  authAttempts: number;
  isRateLimited: boolean;
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

// ✅ ADDED BACK: memo wrapper for better performance (from your original code)
export const AuthProvider = memo<{ children: React.ReactNode }>(
  ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Rate limiting state
    const [authAttempts, setAuthAttempts] = useState(0);
    const [lastAttempt, setLastAttempt] = useState(0);
    const [isRateLimited, setIsRateLimited] = useState(false);

    // Cleanup refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Memoized computed values
    const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
    const userMetadata = useMemo(
      (): UserMetadata => user?.user_metadata || {},
      [user]
    );

    // Rate limiting utilities
    const checkRateLimit = useCallback((): boolean => {
      const now = Date.now();
      const timeSinceLastAttempt = now - lastAttempt;

      if (timeSinceLastAttempt > RATE_LIMIT_CONFIG.WINDOW_MS) {
        setAuthAttempts(0);
        setIsRateLimited(false);
        return false;
      }

      if (authAttempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
        setIsRateLimited(true);
        return true;
      }

      return false;
    }, [authAttempts, lastAttempt]);

    const incrementAuthAttempts = useCallback(() => {
      const now = Date.now();
      setLastAttempt(now);
      setAuthAttempts((prev) => prev + 1);
    }, []);

    // Enhanced error handling
    const createEnhancedError = useCallback(
      (
        error: any,
        type: AuthErrorType = AuthErrorType.UNKNOWN_ERROR
      ): EnhancedAuthError => {
        let errorType = type;
        let message = "An unexpected error occurred";

        if (error?.message) {
          const errorMessage = error.message.toLowerCase();

          if (
            errorMessage.includes("invalid") ||
            errorMessage.includes("credentials")
          ) {
            errorType = AuthErrorType.INVALID_CREDENTIALS;
            message = "Invalid email or password";
          } else if (
            errorMessage.includes("network") ||
            errorMessage.includes("fetch")
          ) {
            errorType = AuthErrorType.NETWORK_ERROR;
            message = "Network error. Please check your connection";
          } else if (
            errorMessage.includes("rate") ||
            errorMessage.includes("limit")
          ) {
            errorType = AuthErrorType.RATE_LIMITED;
            message = "Too many attempts. Please try again later";
          } else if (
            errorMessage.includes("expired") ||
            errorMessage.includes("token")
          ) {
            errorType = AuthErrorType.SESSION_EXPIRED;
            message = "Session expired. Please sign in again";
          } else {
            message = error.message;
          }
        }

        return {
          type: errorType,
          message,
          code: error?.code,
          originalError: error,
        };
      },
      []
    );

    // Session refresh logic
    const refreshSession = useCallback(async (): Promise<
      AuthResult<Session>
    > => {
      if (isRefreshing) {
        return {
          success: false,
          error: createEnhancedError(new Error("Refresh already in progress")),
        };
      }

      setIsRefreshing(true);

      try {
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          return { success: true, data: data.session };
        }

        throw new Error("No session returned from refresh");
      } catch (err) {
        const enhancedError = createEnhancedError(
          err,
          AuthErrorType.SESSION_EXPIRED
        );
        reportError(err, "Session refresh");
        return { success: false, error: enhancedError };
      } finally {
        setIsRefreshing(false);
      }
    }, [isRefreshing, createEnhancedError]);

    // Check if token is expiring soon (within 5 minutes)
    const isTokenExpiringSoon = useCallback((expiresAt?: number): boolean => {
      if (!expiresAt) return false;
      const fiveMinutes = 5 * 60 * 1000;
      return expiresAt * 1000 - Date.now() < fiveMinutes;
    }, []);

    // ✅ FIXED: Browser-safe auth state handler
    const handleAuthStateChange = useCallback(
      (event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Reset rate limiting on successful auth
        if (session && event === "SIGNED_IN") {
          setAuthAttempts(0);
          setIsRateLimited(false);
        }

        // ✅ FIXED: Browser-safe development logging
        const isDevelopment =
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1");

        if (isDevelopment) {
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
      abortControllerRef.current = new AbortController();

      // Set up auth state listener

      // Get initial session
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          // This is now the ONLY place where loading is set to false
          // after the FIRST auth event is received.
          setLoading(false);
        }
      });

      // The getSession() call is no longer needed here because onAuthStateChange
      // fires immediately on load with the current session state.

      return () => {
        mounted = false;
        subscription.unsubscribe();
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, []);
    // ------------------------------

    // Session monitoring
    useEffect(() => {
      if (session && session.expires_at) {
        sessionCheckIntervalRef.current = setInterval(() => {
          if (isTokenExpiringSoon(session.expires_at)) {
            refreshSession();
          }
        }, 60000); // Check every minute

        return () => {
          if (sessionCheckIntervalRef.current) {
            clearInterval(sessionCheckIntervalRef.current);
          }
        };
      }
    }, [session, isTokenExpiringSoon, refreshSession]);

    // Enhanced sign up with validation
    const signUp = useCallback(
      async (
        email: string,
        password: string,
        fullName?: string
      ): Promise<AuthResult<SignUpData>> => {
        // Rate limiting check
        if (checkRateLimit()) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Too many attempts. Please try again later."),
              AuthErrorType.RATE_LIMITED
            ),
          };
        }

        // Input validation
        if (!validateEmail(email)) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Please enter a valid email address"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        if (!validatePassword(password)) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Password must be at least 8 characters long"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        if (fullName && !validateFullName(fullName)) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Full name must be between 2 and 100 characters"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        setIsSigningUp(true);
        incrementAuthAttempts();

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: getRedirectUrl("/auth/callback"), // ✅ Now browser-safe
              data: {
                full_name: fullName?.trim() || "",
                avatar_url: "",
                onboarding_completed: false,
              },
            },
          });

          if (error) {
            throw error;
          }

          return {
            data: {
              user: data.user,
              session: data.session,
            },
            success: true,
          };
        } catch (err) {
          const enhancedError = createEnhancedError(err);
          reportError(err, "Sign up");
          return {
            error: enhancedError,
            success: false,
          };
        } finally {
          setIsSigningUp(false);
        }
      },
      [checkRateLimit, createEnhancedError, incrementAuthAttempts]
    );

    // Enhanced sign in with validation
    const signIn = useCallback(
      async (
        email: string,
        password: string
      ): Promise<AuthResult<SignInData>> => {
        // Rate limiting check
        if (checkRateLimit()) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Too many attempts. Please try again later."),
              AuthErrorType.RATE_LIMITED
            ),
          };
        }

        // Input validation
        if (!validateEmail(email)) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Please enter a valid email address"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        if (!password.trim()) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Password is required"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        setIsSigningIn(true);
        incrementAuthAttempts();

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (error) {
            throw error;
          }

          return {
            data: {
              user: data.user,
              session: data.session,
            },
            success: true,
          };
        } catch (err) {
          const enhancedError = createEnhancedError(
            err,
            AuthErrorType.INVALID_CREDENTIALS
          );
          reportError(err, "Sign in");
          return {
            error: enhancedError,
            success: false,
          };
        } finally {
          setIsSigningIn(false);
        }
      },
      [checkRateLimit, createEnhancedError, incrementAuthAttempts]
    );

    // Enhanced Google sign in
    const signInWithGoogle = useCallback(async (): Promise<AuthResult<any>> => {
      if (checkRateLimit()) {
        return {
          success: false,
          error: createEnhancedError(
            new Error("Too many attempts. Please try again later."),
            AuthErrorType.RATE_LIMITED
          ),
        };
      }

      setIsSigningIn(true);
      incrementAuthAttempts();

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: getRedirectUrl("/auth/callback"), // ✅ Now browser-safe
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) {
          throw error;
        }

        return {
          data,
          success: true,
        };
      } catch (err) {
        const enhancedError = createEnhancedError(err);
        reportError(err, "Google sign in");
        return {
          error: enhancedError,
          success: false,
        };
      } finally {
        setIsSigningIn(false);
      }
    }, [checkRateLimit, createEnhancedError, incrementAuthAttempts]);

    // Enhanced LinkedIn sign in
    const signInWithLinkedIn = useCallback(async (): Promise<
      AuthResult<any>
    > => {
      if (checkRateLimit()) {
        return {
          success: false,
          error: createEnhancedError(
            new Error("Too many attempts. Please try again later."),
            AuthErrorType.RATE_LIMITED
          ),
        };
      }

      setIsSigningIn(true);
      incrementAuthAttempts();

      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "linkedin_oidc",
          options: {
            redirectTo: getRedirectUrl("/auth/callback"), // ✅ Now browser-safe
          },
        });

        if (error) {
          throw error;
        }

        return {
          data,
          success: true,
        };
      } catch (err) {
        const enhancedError = createEnhancedError(err);
        reportError(err, "LinkedIn sign in");
        return {
          error: enhancedError,
          success: false,
        };
      } finally {
        setIsSigningIn(false);
      }
    }, [checkRateLimit, createEnhancedError, incrementAuthAttempts]);

    // Enhanced sign out
    const signOut = useCallback(async (): Promise<AuthResult<void>> => {
      setIsSigningOut(true);

      try {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        // Clear local state immediately for better UX
        setUser(null);
        setSession(null);
        setAuthAttempts(0);
        setIsRateLimited(false);

        return {
          success: true,
        };
      } catch (err) {
        const enhancedError = createEnhancedError(err);
        reportError(err, "Sign out");
        return {
          error: enhancedError,
          success: false,
        };
      } finally {
        setIsSigningOut(false);
      }
    }, [createEnhancedError]);

    // Enhanced password reset
    const resetPassword = useCallback(
      async (email: string): Promise<AuthResult<void>> => {
        if (!validateEmail(email)) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("Please enter a valid email address"),
              AuthErrorType.VALIDATION_ERROR
            ),
          };
        }

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
              redirectTo: getRedirectUrl("/auth/reset-password"), // ✅ Now browser-safe
            }
          );

          if (error) {
            throw error;
          }

          return {
            success: true,
          };
        } catch (err) {
          const enhancedError = createEnhancedError(err);
          reportError(err, "Password reset");
          return {
            error: enhancedError,
            success: false,
          };
        }
      },
      [createEnhancedError]
    );

    // Update profile functionality
    const updateProfile = useCallback(
      async (updates: Partial<UserProfile>): Promise<AuthResult<User>> => {
        if (!user) {
          return {
            success: false,
            error: createEnhancedError(
              new Error("User must be authenticated to update profile"),
              AuthErrorType.SESSION_EXPIRED
            ),
          };
        }

        try {
          const { data, error } = await supabase.auth.updateUser({
            data: updates,
          });

          if (error) {
            throw error;
          }

          return {
            data: data.user,
            success: true,
          };
        } catch (err) {
          const enhancedError = createEnhancedError(err);
          reportError(err, "Profile update");
          return {
            error: enhancedError,
            success: false,
          };
        }
      },
      [user, createEnhancedError]
    );

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(
      () => ({
        user,
        session,
        loading,
        isSigningIn,
        isSigningUp,
        isSigningOut,
        isRefreshing,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        resetPassword,
        updateProfile,
        refreshSession,
        isAuthenticated,
        userMetadata,
        authAttempts,
        isRateLimited,
      }),
      [
        user,
        session,
        loading,
        isSigningIn,
        isSigningUp,
        isSigningOut,
        isRefreshing,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        resetPassword,
        updateProfile,
        refreshSession,
        isAuthenticated,
        userMetadata,
        authAttempts,
        isRateLimited,
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

// Enhanced utility hooks
export const useAuthLoading = () => {
  const { loading, isSigningIn, isSigningUp, isSigningOut, isRefreshing } =
    useAuth();
  return loading || isSigningIn || isSigningUp || isSigningOut || isRefreshing;
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
    updateProfile,
    refreshSession,
  } = useAuth();
  return {
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
  };
};

// Rate limiting hook
export const useAuthRateLimit = () => {
  const { authAttempts, isRateLimited } = useAuth();
  return { authAttempts, isRateLimited };
};

// Export types for use in other components
export type {
  AuthContextType,
  EnhancedAuthError,
  AuthErrorType,
  UserMetadata,
  UserProfile,
  AuthResult,
};
