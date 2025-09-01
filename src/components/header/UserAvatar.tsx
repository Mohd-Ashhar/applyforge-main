import React, { memo, useMemo, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Crown,
  Star,
  Zap,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock,
  Minus,
  Bot,
  Sparkles,
  Shield,
  Activity,
} from "lucide-react";
import { useUsageTracking } from "@/hooks/useUsageTracking";

// **ENHANCED: More comprehensive status and plan types**
type UserStatus = "online" | "away" | "busy" | "offline";
type PlanType = "Free" | "Basic" | "Pro" | "Enterprise";

interface UserAvatarProps {
  user: User;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showOnlineIndicator?: boolean;
  userStatus?: UserStatus;
  showPlanBadge?: boolean;
  plan?: PlanType;
  interactive?: boolean;
  variant?: "default" | "premium" | "minimal" | "glass" | "agent"; // **NEW: agent variant**
  showTooltip?: boolean;
  showUploadOption?: boolean;
  className?: string;
  onClick?: () => void;
  onUpload?: (file: File) => void;
}

const UserAvatar = memo<UserAvatarProps>(
  ({
    user,
    size = "md",
    showOnlineIndicator = false,
    userStatus = "online",
    showPlanBadge = false,
    plan,
    interactive = false,
    variant = "default",
    showTooltip = true,
    showUploadOption = false,
    className = "",
    onClick,
    onUpload,
  }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadUI, setShowUploadUI] = useState(false);

    // **INTEGRATED: Using centralized usage tracking**
    const { usage } = useUsageTracking();
    const actualPlan = plan || usage?.plan_type || "Free";

    // **ENHANCED: Better user data extraction**
    const userData = useMemo(() => {
      const fullName = user?.user_metadata?.full_name || "";
      const email = user?.email || "";
      const displayName = user?.user_metadata?.display_name || "";

      // Smarter name extraction
      const name = fullName || displayName || email.split("@") || "User";
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts[1] || "";

      // Enhanced initials generation
      let initials = "";
      if (lastName) {
        initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
      } else if (firstName.length >= 2) {
        initials = `${firstName[0]}${firstName[1]}`.toUpperCase();
      } else {
        initials = firstName[0]?.toUpperCase() || "U";
      }

      return {
        fullName: name,
        email,
        firstName,
        lastName,
        initials,
        avatarUrl: user?.user_metadata?.avatar_url,
      };
    }, [user]);

    // **ENHANCED: Modern size configurations with better scaling**
    const sizeConfig = useMemo(
      () => ({
        xs: {
          avatar: "w-6 h-6",
          text: "text-xs",
          ring: "ring-1",
          indicator: "w-1.5 h-1.5 -top-0.5 -right-0.5",
          badge: "w-3 h-3 -bottom-0.5 -right-0.5",
          upload: "w-3 h-3",
          glow: "blur-sm",
        },
        sm: {
          avatar: "w-8 h-8",
          text: "text-xs",
          ring: "ring-2",
          indicator: "w-2 h-2 -top-0.5 -right-0.5",
          badge: "w-4 h-4 -bottom-0.5 -right-0.5",
          upload: "w-4 h-4",
          glow: "blur-sm",
        },
        md: {
          avatar: "w-9 h-9 md:w-10 md:h-10",
          text: "text-sm",
          ring: "ring-2",
          indicator: "w-2.5 h-2.5 -top-0.5 -right-0.5",
          badge: "w-4 h-4 -bottom-0.5 -right-0.5",
          upload: "w-5 h-5",
          glow: "blur-md",
        },
        lg: {
          avatar: "w-12 h-12 md:w-14 md:h-14",
          text: "text-base",
          ring: "ring-2",
          indicator: "w-3 h-3 -top-1 -right-1",
          badge: "w-5 h-5 -bottom-1 -right-1",
          upload: "w-6 h-6",
          glow: "blur-md",
        },
        xl: {
          avatar: "w-16 h-16 md:w-20 md:h-20",
          text: "text-lg",
          ring: "ring-3",
          indicator: "w-3.5 h-3.5 -top-1 -right-1",
          badge: "w-6 h-6 -bottom-1 -right-1",
          upload: "w-7 h-7",
          glow: "blur-lg",
        },
        "2xl": {
          avatar: "w-24 h-24 md:w-28 md:h-28",
          text: "text-xl",
          ring: "ring-4",
          indicator: "w-4 h-4 -top-1.5 -right-1.5",
          badge: "w-7 h-7 -bottom-1.5 -right-1.5",
          upload: "w-8 h-8",
          glow: "blur-xl",
        },
      }),
      []
    );

    // **MODERNIZED: Enhanced variant styles with glassmorphism**
    const variantStyles = useMemo(() => {
      switch (variant) {
        case "premium":
          return {
            ring: "ring-blue-400/30 group-hover:ring-blue-400/50",
            fallback:
              "bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-xl",
            shadow:
              "shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20",
            glow: "bg-gradient-to-r from-blue-400/20 via-indigo-400/15 to-purple-400/20",
            glowHover: "from-blue-400/30 via-indigo-400/25 to-purple-400/30",
          };
        case "agent":
          return {
            ring: "ring-amber-400/30 group-hover:ring-amber-400/50",
            fallback:
              "bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-xl",
            shadow:
              "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20",
            glow: "bg-gradient-to-r from-amber-400/20 via-orange-400/15 to-yellow-400/20",
            glowHover: "from-amber-400/30 via-orange-400/25 to-yellow-400/30",
          };
        case "glass":
          return {
            ring: "ring-white/20 group-hover:ring-white/30",
            fallback:
              "bg-white/5 backdrop-blur-xl text-white border border-white/10",
            shadow:
              "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10",
            glow: "bg-gradient-to-r from-white/10 to-white/5",
            glowHover: "from-white/20 to-white/10",
          };
        case "minimal":
          return {
            ring: "ring-slate-400/20 group-hover:ring-slate-400/30",
            fallback:
              "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
            shadow: "shadow-sm hover:shadow-md",
            glow: "bg-gradient-to-r from-slate-200/50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-800/50",
            glowHover:
              "from-slate-200/70 to-slate-100/70 dark:from-slate-700/70 dark:to-slate-800/70",
          };
        default:
          return {
            ring: "ring-slate-400/20 group-hover:ring-slate-400/30",
            fallback:
              "bg-gradient-to-br from-slate-800/50 to-slate-900/50 text-slate-300 border border-slate-700/50 backdrop-blur-xl",
            shadow: "shadow-md hover:shadow-lg shadow-slate-900/10",
            glow: "bg-gradient-to-r from-slate-400/10 to-slate-500/10",
            glowHover: "from-slate-400/20 to-slate-500/20",
          };
      }
    }, [variant]);

    // **ENHANCED: Better status configurations**
    const statusConfig = useMemo(
      () => ({
        online: {
          color: "bg-green-400",
          pulseColor: "bg-green-300",
          icon: Wifi,
          label: "Online",
          ringColor: "ring-green-400/30",
        },
        away: {
          color: "bg-yellow-400",
          pulseColor: "bg-yellow-300",
          icon: Clock,
          label: "Away",
          ringColor: "ring-yellow-400/30",
        },
        busy: {
          color: "bg-red-400",
          pulseColor: "bg-red-300",
          icon: Minus,
          label: "Busy",
          ringColor: "ring-red-400/30",
        },
        offline: {
          color: "bg-slate-400",
          pulseColor: "bg-slate-300",
          icon: WifiOff,
          label: "Offline",
          ringColor: "ring-slate-400/30",
        },
      }),
      []
    );

    // **MODERNIZED: Enhanced plan badge styling**
    const planBadgeConfig = useMemo(
      () => ({
        Enterprise: {
          icon: Crown,
          color: "bg-gradient-to-r from-purple-500 to-purple-600",
          shadow: "shadow-lg shadow-purple-500/30",
          ring: "ring-2 ring-purple-400/30",
          glow: "shadow-purple-400/20",
        },
        Pro: {
          icon: Crown,
          color: "bg-gradient-to-r from-blue-500 to-blue-600",
          shadow: "shadow-lg shadow-blue-500/30",
          ring: "ring-2 ring-blue-400/30",
          glow: "shadow-blue-400/20",
        },
        Basic: {
          icon: Star,
          color: "bg-gradient-to-r from-green-500 to-green-600",
          shadow: "shadow-lg shadow-green-500/30",
          ring: "ring-2 ring-green-400/30",
          glow: "shadow-green-400/20",
        },
        Free: {
          icon: Zap,
          color: "bg-gradient-to-r from-slate-500 to-slate-600",
          shadow: "shadow-lg shadow-slate-500/30",
          ring: "ring-2 ring-slate-400/30",
          glow: "shadow-slate-400/20",
        },
      }),
      []
    );

    const currentSize = sizeConfig[size];
    const currentVariant = variantStyles;
    const currentStatus = statusConfig[userStatus];
    const currentPlan =
      planBadgeConfig[actualPlan as keyof typeof planBadgeConfig];
    const PlanIcon = currentPlan.icon;
    const StatusIcon = currentStatus.icon;

    // **ENHANCED: Better loading and error handling**
    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setIsLoading(false);
    }, []);

    // **IMPROVED: Upload handling with better UX**
    const handleFileUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onUpload) {
          setIsUploading(true);
          onUpload(file);
          setTimeout(() => {
            setIsUploading(false);
            setShowUploadUI(false);
          }, 2000);
        }
      },
      [onUpload]
    );

    const avatarContent = (
      <div className="relative group">
        {/* **ENHANCED: Main avatar with better animations** */}
        <motion.div
          className="relative"
          whileHover={interactive ? { scale: 1.05 } : {}}
          whileTap={interactive ? { scale: 0.95 } : {}}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Avatar
            className={`
            relative ${currentSize.avatar} ${currentSize.ring} ${
              currentVariant.ring
            }
            transition-all duration-300 ${currentVariant.shadow}
            ${interactive ? "cursor-pointer" : ""}
            ${className}
          `}
            onClick={onClick}
          >
            {/* **ENHANCED: Sophisticated loading state** */}
            {isLoading && !imageError && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-800/30 via-slate-700/50 to-slate-800/30 backdrop-blur-sm"
                animate={{
                  background: [
                    "linear-gradient(90deg, rgb(30 41 59 / 0.3), rgb(51 65 85 / 0.5), rgb(30 41 59 / 0.3))",
                    "linear-gradient(90deg, rgb(51 65 85 / 0.5), rgb(30 41 59 / 0.3), rgb(51 65 85 / 0.5))",
                    "linear-gradient(90deg, rgb(30 41 59 / 0.3), rgb(51 65 85 / 0.5), rgb(30 41 59 / 0.3))",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* Avatar Image */}
            <AvatarImage
              src={!imageError ? userData.avatarUrl : undefined}
              alt={`${userData.fullName} avatar`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="object-cover"
            />

            {/* **MODERNIZED: Enhanced fallback with better styling** */}
            <AvatarFallback
              className={`
              ${currentVariant.fallback} ${currentSize.text} font-semibold 
              transition-all duration-300 group-hover:scale-105
              relative overflow-hidden
            `}
            >
              {userData.initials}

              {/* **NEW: Background pattern for fallback** */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
              </div>
            </AvatarFallback>
          </Avatar>

          {/* **ENHANCED: Sophisticated glow effect** */}
          <motion.div
            className={`
            absolute inset-0 rounded-full ${currentVariant.glow} ${currentSize.glow}
            opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10
          `}
            animate={{
              opacity: interactive ? [0, 0.3, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* **ENHANCED: Modern status indicator with better animations** */}
        {showOnlineIndicator && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`
            absolute ${currentSize.indicator} ${currentStatus.color} 
            rounded-full border-2 border-background shadow-lg z-10
            ${currentStatus.ringColor} ring-2
          `}
          >
            {userStatus === "online" && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`w-full h-full ${currentStatus.pulseColor} rounded-full`}
              />
            )}
          </motion.div>
        )}

        {/* **ENHANCED: Modern plan badge with better styling** */}
        {showPlanBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ delay: 0.3, type: "spring" }}
            className={`
            absolute ${currentSize.badge} ${currentPlan.color} ${currentPlan.ring}
            rounded-full border-2 border-background ${currentPlan.shadow}
            flex items-center justify-center z-10 backdrop-blur-sm
            hover:${currentPlan.glow}
          `}
          >
            <PlanIcon className="w-1/2 h-1/2 text-white drop-shadow-sm" />

            {/* **NEW: Plan badge glow animation** */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* **ENHANCED: Modern upload overlay** */}
        {showUploadOption && (
          <motion.div
            className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 cursor-pointer border-2 border-white/20"
            onClick={() => setShowUploadUI(!showUploadUI)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload
                  className={`${currentSize.upload} text-white drop-shadow-lg`}
                />
              </motion.div>
            ) : (
              <Camera
                className={`${currentSize.upload} text-white drop-shadow-lg`}
              />
            )}
          </motion.div>
        )}

        {/* **MODERNIZED: Enhanced tooltip with better styling** */}
        {interactive && showTooltip && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-3 
                     bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl 
                     shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 
                     pointer-events-none z-30 whitespace-nowrap"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="text-sm font-semibold text-white mb-1">
              {userData.fullName}
            </div>
            <div className="text-xs text-slate-400 mb-2">{userData.email}</div>

            {showOnlineIndicator && (
              <div className="text-xs flex items-center gap-1.5 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${currentStatus.color}`}
                />
                <span className="text-slate-300">{currentStatus.label}</span>
              </div>
            )}

            {showPlanBadge && (
              <div className="flex items-center gap-1.5 mb-2">
                <PlanIcon className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">
                  {actualPlan} Plan
                </span>
              </div>
            )}

            {/* **ENHANCED: Usage information with better formatting** */}
            {usage && (
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                {usage.plan_type === "Pro" ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Zap className="w-3 h-3" />
                    <span>Unlimited AI agent usage</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    <span>
                      {[
                        usage.resume_tailors_used || 0,
                        usage.cover_letters_used || 0,
                        usage.job_searches_used || 0,
                      ].reduce((sum, val) => sum + val, 0)}{" "}
                      agent uses this month
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* **ENHANCED: Modern tooltip arrow** */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900/95 border-l border-t border-slate-700/50 rotate-45" />
          </motion.div>
        )}

        {/* **MODERNIZED: Enhanced upload UI** */}
        <AnimatePresence>
          {showUploadUI && showUploadOption && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 p-4 
                       bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 
                       rounded-xl shadow-2xl z-40"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id={`avatar-upload-${user.id}`}
              />
              <label
                htmlFor={`avatar-upload-${user.id}`}
                className="cursor-pointer flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/50"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    return interactive ? (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-block"
      >
        {avatarContent}
      </motion.div>
    ) : (
      avatarContent
    );
  }
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
