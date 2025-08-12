import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for error in URL params
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("Auth callback error:", error, errorDescription);
        navigate(
          "/auth?error=" + encodeURIComponent(errorDescription || error),
          { replace: true }
        );
        return;
      }

      // Wait for auth state to be determined
      if (!loading) {
        if (user) {
          // Successful authentication - redirect to dashboard
          const returnTo = searchParams.get("returnTo") || "/";
          navigate(returnTo, { replace: true });
        } else {
          // No user found - redirect to auth
          navigate("/auth", { replace: true });
        }
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
