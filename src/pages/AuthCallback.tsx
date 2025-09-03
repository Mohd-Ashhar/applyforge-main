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
        // Fix: Ensure proper URL formatting
        navigate(
          `/auth?error=${encodeURIComponent(errorDescription || error)}`,
          {
            replace: true,
          }
        );
        return;
      }

      // Wait for auth state to be determined
      if (!loading) {
        if (user) {
          // **FIX: Redirect to dashboard instead of root**
          const returnTo = searchParams.get("returnTo") || "/dashboard";
          // Ensure clean path formatting
          const cleanPath = returnTo.startsWith("/")
            ? returnTo
            : `/${returnTo}`;
          navigate(cleanPath, { replace: true });
        } else {
          // No user found - redirect to auth
          navigate("/auth", { replace: true });
        }
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
