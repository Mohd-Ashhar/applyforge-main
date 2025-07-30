import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthButtons = memo(() => {
  const navigate = useNavigate();

  const handleSignIn = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const handleGetStarted = useCallback(() => {
    navigate("/auth?mode=signup");
  }, [navigate]);

  return (
    <div className="flex items-center gap-3 shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignIn}
        className="text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
      >
        Sign in
      </Button>

      <Button
        size="sm"
        onClick={handleGetStarted}
        className="text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Get Started
      </Button>
    </div>
  );
});

AuthButtons.displayName = "AuthButtons";

export default AuthButtons;
