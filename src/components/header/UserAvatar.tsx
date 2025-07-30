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
} from "lucide-react";
import { useUsageTracking } from "@/hooks/useUsageTracking"; // **INTEGRATED WITH USAGE SYSTEM**

// **ENHANCED: More comprehensive status options**
type UserStatus = "online" | "away" | "busy" | "offline";
type PlanType = "Free" | "Basic" | "Pro";

interface UserAvatarProps {
  user: User;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"; // **ADDED: 2xl size**
  showOnlineIndicator?: boolean;
  userStatus?: UserStatus; // **ENHANCED: More status options**
  showPlanBadge?: boolean;
  plan?: PlanType;
  interactive?: boolean;
  variant?: "default" | "premium" | "minimal" | "glass"; // **ADDED: glass variant**
  showTooltip?: boolean; // **ADDED: Optional tooltip control**
  showUploadOption?: boolean; // **NEW: Avatar upload functionality**
  className?: string;
  onClick?: () => void;
  onUpload?: (file: File) => void; // **NEW: Upload callback**
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

    // **ENHANCED: Memoized user data with better name handling**
    const userData = useMemo(() => {
      const fullName = user?.user_metadata?.full_name || "";
      const email = user?.email || "";
      const displayName = user?.user_metadata?.display_name || "";

      // Better name extraction logic
      const name = fullName || displayName || email.split("@")[0] || "User";
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts[1] || "";

      // Better initials generation
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

    // **ENHANCED: More comprehensive size configurations**
    const sizeConfig = useMemo(
      () => ({
        xs: {
          avatar: "w-6 h-6",
          text: "text-xs",
          ring: "ring-1",
          indicator: "w-1.5 h-1.5 -top-0.5 -right-0.5",
          badge: "w-3 h-3 -bottom-0.5 -right-0.5",
          upload: "w-4 h-4",
        },
        sm: {
          avatar: "w-8 h-8",
          text: "text-xs",
          ring: "ring-2",
          indicator: "w-2 h-2 -top-0.5 -right-0.5",
          badge: "w-4 h-4 -bottom-0.5 -right-0.5",
          upload: "w-5 h-5",
        },
        md: {
          avatar: "w-9 h-9 md:w-10 md:h-10",
          text: "text-sm",
          ring: "ring-2",
          indicator: "w-2.5 h-2.5 -top-0.5 -right-0.5",
          badge: "w-4 h-4 -bottom-0.5 -right-0.5",
          upload: "w-6 h-6",
        },
        lg: {
          avatar: "w-12 h-12 md:w-14 md:h-14",
          text: "text-base",
          ring: "ring-2",
          indicator: "w-3 h-3 -top-1 -right-1",
          badge: "w-5 h-5 -bottom-1 -right-1",
          upload: "w-7 h-7",
        },
        xl: {
          avatar: "w-16 h-16 md:w-20 md:h-20",
          text: "text-lg",
          ring: "ring-3",
          indicator: "w-3.5 h-3.5 -top-1 -right-1",
          badge: "w-6 h-6 -bottom-1 -right-1",
          upload: "w-8 h-8",
        },
        "2xl": {
          avatar: "w-24 h-24 md:w-28 md:h-28",
          text: "text-xl",
          ring: "ring-4",
          indicator: "w-4 h-4 -top-1.5 -right-1.5",
          badge: "w-7 h-7 -bottom-1.5 -right-1.5",
          upload: "w-10 h-10",
        },
      }),
      []
    );

    // **ENHANCED: More sophisticated variant styles**
    const variantStyles = useMemo(() => {
      switch (variant) {
        case "premium":
          return {
            ring: "ring-blue-400/40 group-hover:ring-blue-400/60",
            fallback:
              "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 text-blue-400 border border-blue-400/20",
            shadow:
              "shadow-lg shadow-blue-400/10 hover:shadow-xl hover:shadow-blue-400/20",
            glow: "from-blue-400/20 to-purple-500/20",
          };
        case "glass":
          return {
            ring: "ring-white/20 group-hover:ring-white/30",
            fallback:
              "bg-white/10 backdrop-blur-sm text-white border border-white/20",
            shadow:
              "shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20",
            glow: "from-white/10 to-white/5",
          };
        case "minimal":
          return {
            ring: "ring-border/30 group-hover:ring-border/50",
            fallback:
              "bg-muted/60 text-muted-foreground border border-border/30",
            shadow: "shadow-sm hover:shadow-md",
            glow: "from-muted/20 to-muted/10",
          };
        default:
          return {
            ring: "ring-primary/20 group-hover:ring-primary/40",
            fallback:
              "bg-gradient-to-br from-primary/20 to-blue-600/20 text-primary border border-primary/10",
            shadow: "shadow-md hover:shadow-lg",
            glow: "from-primary/20 to-blue-600/20",
          };
      }
    }, [variant]);

    // **ENHANCED: Status indicator configurations**
    const statusConfig = useMemo(
      () => ({
        online: {
          color: "bg-green-500",
          pulseColor: "bg-green-400",
          icon: Wifi,
          label: "Online",
        },
        away: {
          color: "bg-yellow-500",
          pulseColor: "bg-yellow-400",
          icon: Clock,
          label: "Away",
        },
        busy: {
          color: "bg-red-500",
          pulseColor: "bg-red-400",
          icon: Minus,
          label: "Busy",
        },
        offline: {
          color: "bg-gray-500",
          pulseColor: "bg-gray-400",
          icon: WifiOff,
          label: "Offline",
        },
      }),
      []
    );

    // **ENHANCED: Plan badge configuration with better styling**
    const planBadgeConfig = useMemo(
      () => ({
        Pro: {
          icon: Crown,
          color: "bg-gradient-to-r from-green-500 to-emerald-600",
          shadow: "shadow-lg shadow-green-500/30",
          ring: "ring-2 ring-green-400/30",
        },
        Basic: {
          icon: Star,
          color: "bg-gradient-to-r from-blue-500 to-blue-600",
          shadow: "shadow-lg shadow-blue-500/30",
          ring: "ring-2 ring-blue-400/30",
        },
        Free: {
          icon: Zap,
          color: "bg-gradient-to-r from-slate-500 to-slate-600",
          shadow: "shadow-lg shadow-slate-500/30",
          ring: "ring-2 ring-slate-400/30",
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

    // **NEW: Handle image loading states**
    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setIsLoading(false);
    }, []);

    // **NEW: Handle avatar upload**
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
        <Avatar
          className={`
          relative ${currentSize.avatar} ${currentSize.ring} ${
            currentVariant.ring
          }
          transition-all duration-300 ${currentVariant.shadow}
          ${interactive ? "cursor-pointer hover:scale-105 active:scale-95" : ""}
          ${className}
        `}
          onClick={onClick}
        >
          {/* **ENHANCED: Better loading state** */}
          {isLoading && !imageError && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
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

          {/* **ENHANCED: Better fallback with animations** */}
          <AvatarFallback
            className={`
            ${currentVariant.fallback} ${currentSize.text} font-semibold 
            transition-all duration-300 group-hover:scale-110
          `}
          >
            {userData.initials}
          </AvatarFallback>

          {/* **ENHANCED: Premium glow effect** */}
          {(variant === "premium" || variant === "glass") && (
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentVariant.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`}
            />
          )}
        </Avatar>

        {/* **ENHANCED: Status Indicator with multiple states** */}
        {showOnlineIndicator && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
            absolute ${currentSize.indicator} ${currentStatus.color} rounded-full 
            border-2 border-background shadow-lg z-10 ${currentStatus.color}
          `}
          >
            {userStatus === "online" && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-full h-full ${currentStatus.pulseColor} rounded-full opacity-75`}
              />
            )}
          </motion.div>
        )}

        {/* **ENHANCED: Plan Badge with better styling** */}
        {showPlanBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`
            absolute ${currentSize.badge} ${currentPlan.color} ${currentPlan.ring}
            rounded-full border-2 border-background ${currentPlan.shadow}
            flex items-center justify-center z-10
          `}
          >
            <PlanIcon className="w-1/2 h-1/2 text-white drop-shadow-sm" />
          </motion.div>
        )}

        {/* **NEW: Upload Option** */}
        {showUploadOption && (
          <motion.div
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 cursor-pointer"
            onClick={() => setShowUploadUI(!showUploadUI)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className={`${currentSize.upload} text-white`} />
              </motion.div>
            ) : (
              <Camera className={`${currentSize.upload} text-white`} />
            )}
          </motion.div>
        )}

        {/* **ENHANCED: Interactive tooltip with more information** */}
        {interactive && showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-3 bg-background/95 backdrop-blur border border-white/10 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap">
            <div className="text-sm font-semibold text-white mb-1">
              {userData.fullName}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {userData.email}
            </div>
            {showOnlineIndicator && (
              <div
                className={`text-xs flex items-center gap-1.5 mb-1 text-${currentStatus.color.replace(
                  "bg-",
                  ""
                )}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${currentStatus.color}`}
                />
                {currentStatus.label}
              </div>
            )}
            {showPlanBadge && (
              <div className="text-xs text-blue-400 font-medium">
                {actualPlan} Plan
              </div>
            )}

            {/* **NEW: Usage summary in tooltip** */}
            {usage && (
              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-white/10">
                {usage.plan_type === "Pro" ? (
                  <span className="text-green-400">Unlimited usage</span>
                ) : (
                  <span>
                    {[
                      usage.resume_tailors_used || 0,
                      usage.cover_letters_used || 0,
                      usage.job_searches_used || 0,
                    ].reduce((sum, val) => sum + val, 0)}{" "}
                    uses this month
                  </span>
                )}
              </div>
            )}

            {/* Tooltip arrow */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background/95 border-l border-t border-white/10 rotate-45" />
          </div>
        )}

        {/* **NEW: Upload UI** */}
        <AnimatePresence>
          {showUploadUI && showUploadOption && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-background/95 backdrop-blur border border-white/10 rounded-xl shadow-xl z-30"
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
                className="cursor-pointer flex items-center gap-2 text-xs font-medium text-white hover:text-blue-400 transition-colors"
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
        whileTap={{ scale: 0.95 }}
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
