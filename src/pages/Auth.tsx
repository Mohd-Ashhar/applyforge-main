import React, { memo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/Logo";

const FormField = memo(
  ({
    id,
    label,
    type,
    value,
    onChange,
    required,
    error,
    icon: Icon,
    placeholder,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword,
  }: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    icon: React.ElementType;
    placeholder?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          id={id}
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
          pl-12 ${showPasswordToggle ? "pr-12" : "pr-4"} h-12
          bg-background border-border 
          focus:border-primary focus:ring-1 focus:ring-primary/20
          ${error ? "border-red-500/50" : ""}
        `}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
);

FormField.displayName = "FormField";

const Auth = memo(() => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? false : true;

  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasProcessedUser, setHasProcessedUser] = useState(false);

  const { signIn, signUp, signInWithGoogle, user, isSigningIn, isSigningUp } =
    useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle user authentication and navigation
  useEffect(() => {
    if (user && !hasProcessedUser) {
      setHasProcessedUser(true);

      // Determine user type and show appropriate message
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;
      const isNewUser = diffSeconds < 120; // 2 minutes window

      const isGoogleUser =
        user.app_metadata?.providers?.includes("google") ||
        user.identities?.some(
          (identity: any) => identity.provider === "google"
        );

      if (isNewUser && isGoogleUser) {
        toast({
          title: "Welcome to ApplyForge! 🎉",
          description:
            "Check your email for a welcome message from hey@applyforge.ai",
        });
      } else if (isGoogleUser) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "You have been signed in successfully.",
        });
      }

      // Navigate to dashboard
      setTimeout(() => navigate("/"), 1000);
    }
  }, [user, hasProcessedUser, navigate, toast]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setErrors({});

      try {
        if (isLogin) {
          const { success, error } = await signIn(
            formData.email,
            formData.password
          );
          if (!success) {
            toast({
              title: "Sign in failed",
              description: error?.message || "Please check your credentials.",
              variant: "destructive",
            });
          }
        } else {
          const { success, error } = await signUp(
            formData.email,
            formData.password,
            formData.fullName
          );
          if (success) {
            toast({
              title: "Account created! 🎉",
              description:
                "Please check your email from verification@applyforge.ai to verify your account.",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error?.message || "Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, isLogin, validateForm, signIn, signUp, toast]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setHasProcessedUser(false);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        toast({
          title: "Google sign in failed",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "OAuth error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  }, [signInWithGoogle, toast]);

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: "", password: "", fullName: "" });
    setShowPassword(false);
  }, [isLogin]);

  const isProcessing = loading || isSigningIn || isSigningUp;

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Logo
              linkTo={null}
              showTagline={true}
              className="pointer-events-none"
            />
          </div>

          <Card className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Sign in to your ApplyForge account"
                  : "Join ApplyForge and transform your career"}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full h-12 transition-all hover:scale-[1.02] hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <FormField
                  id="fullName"
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required={!isLogin}
                  error={errors.fullName}
                  icon={User}
                  placeholder="Enter your full name"
                />
              )}

              <FormField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                error={errors.email}
                icon={Mail}
                placeholder="Enter your email"
              />

              <FormField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                error={errors.password}
                icon={Lock}
                placeholder="Enter your password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mt-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:text-primary/80 ml-2 font-medium transition-colors hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Secure & Encrypted
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Privacy Protected
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});

Auth.displayName = "Auth";
export default Auth;
