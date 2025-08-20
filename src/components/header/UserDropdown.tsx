import React, { memo, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  FileText,
  Edit3,
  Bookmark,
  CheckCircle,
  Settings,
  ChevronDown,
  Sparkles,
  Home,
  CreditCard,
  HelpCircle,
  Gift,
  BarChart3,
  User as UserIcon,
  Bell,
  Shield,
  ExternalLink,
  ChartNoAxesGantt,
  Crown,
  Zap,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import PlanBadge from "./PlanBadge";
import UserAvatar from "./UserAvatar";

interface UserDropdownProps {
  user: User;
  onSignOut: () => void;
  className?: string;
}

// Navigation items with enhanced metadata
const DROPDOWN_NAV_ITEMS = [
  {
    to: "/",
    icon: Home,
    label: "Dashboard",
    description: "User Dashboard",
  },
  {
    to: "/tailored-resumes",
    icon: FileText,
    label: "Tailored Resumes",
    description: "AI-optimized resumes",
  },
  {
    to: "/saved-cover-letters",
    icon: Edit3,
    label: "Cover Letters",
    description: "Generated letters",
  },
  {
    to: "/saved-jobs",
    icon: Bookmark,
    label: "Saved Jobs",
    description: "Bookmarked opportunities",
  },
  {
    to: "/applied-jobs",
    icon: CheckCircle,
    label: "Applied Jobs",
    description: "Application tracking",
  },
  {
    to: "/planusage",
    icon: ChartNoAxesGantt,
    label: "Plan & Usage",
    description: "Usage Tracking",
  },
  {
    to: "/feedback",
    icon: BarChart3,
    label: "Feedback",
    description: "Share your experience",
  },
] as const;

const SETTINGS_ITEMS = [
  {
    icon: UserIcon,
    label: "Profile Settings",
    description: "Update your information",
    action: "profile",
  },
  {
    icon: Settings,
    label: "Account Settings",
    description: "Privacy & preferences",
    action: "settings",
  },
  {
    to: "/pricing",
    icon: CreditCard,
    label: "Billing & Plans",
    description: "Manage subscription",
    external: false,
  },
  {
    icon: Bell,
    label: "Notifications",
    description: "Email & push settings",
    action: "notifications",
  },
  {
    icon: Shield,
    label: "Security",
    description: "Password & 2FA",
    action: "security",
  },
] as const;

const SUPPORT_ITEMS = [
  {
    icon: HelpCircle,
    label: "Help Center",
    description: "Documentation & guides",
    external: true,
    href: "/help",
  },
  {
    icon: Gift,
    label: "Refer Friends",
    description: "Earn rewards",
    action: "referral",
  },
] as const;

// Memoized Dropdown Item Component
const DropdownNavItem = memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: (typeof DROPDOWN_NAV_ITEMS)[number];
    isActive: boolean;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    return (
      <DropdownMenuItem asChild className="cursor-pointer p-0 m-0">
        <Link
          to={item.to}
          onClick={onClick}
          className={`
          flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-primary/5 hover:scale-[1.02] group
          ${
            isActive
              ? "bg-primary/10 border border-primary/20 shadow-sm"
              : "hover:bg-muted/50"
          }
        `}
        >
          <div
            className={`
          p-2 rounded-lg transition-all duration-200 group-hover:scale-110
          ${
            isActive
              ? "bg-primary/20 shadow-sm"
              : "bg-muted/30 group-hover:bg-primary/10"
          }
        `}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {item.label}
            </div>
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {item.description}
            </div>
          </div>
          {isActive && (
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </Link>
      </DropdownMenuItem>
    );
  }
);

DropdownNavItem.displayName = "DropdownNavItem";

// Memoized Settings Item Component
const SettingsItem = memo(
  ({
    item,
    onClick,
  }: {
    item: (typeof SETTINGS_ITEMS)[number];
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const content = (
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] group cursor-pointer">
        <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-primary/10 transition-all duration-200">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground">
            {item.label}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {item.description}
          </div>
        </div>
        {"external" in item && item.external && (
          <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
        )}
      </div>
    );

    if ("to" in item && item.to) {
      return (
        <DropdownMenuItem asChild className="cursor-pointer p-0 m-0">
          <Link to={item.to} onClick={onClick}>
            {content}
          </Link>
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem className="cursor-pointer p-0 m-0" onClick={onClick}>
        {content}
      </DropdownMenuItem>
    );
  }
);

SettingsItem.displayName = "SettingsItem";

// **NEW: Enhanced Plan Upgrade CTA Component**
const PlanUpgradeCTA = memo(
  ({ currentPlan, onClose }: { currentPlan: string; onClose: () => void }) => {
    // **PLAN MAPPING: Same logic as RedesignedCallToAction**
    const mapPlanName = (dbPlanName: string) => {
      const planMapping: Record<string, string> = {
        Free: "Starter",
        Basic: "Pro",

        Pro: "Advanced",
        // Enterprise: "Advanced",
      };
      return planMapping[dbPlanName] || "Starter";
    };

    const mappedPlan = mapPlanName(currentPlan);

    // **DYNAMIC UPGRADE BUTTON LOGIC**
    const getUpgradeConfig = () => {
      switch (mappedPlan) {
        case "Starter":
          return {
            text: "🚀 Upgrade to Pro",
            description: "Unlock GPT-4 Class AI",
            className:
              "bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 border border-blue-500/30",
            icon: Zap,
            enabled: true,
          };
        case "Pro":
          return {
            text: "⚡ Go Advanced",
            description: "Access GPT-5 Class AI",
            className:
              "bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-400 border border-purple-500/30",
            icon: Crown,
            enabled: true,
          };
        case "Advanced":
          return {
            text: "✅ Best Plan Active",
            description: "You have maximum AI power",
            className:
              "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/30 opacity-75 cursor-not-allowed",
            icon: Crown,
            enabled: false,
          };
        default:
          return {
            text: "🚀 Upgrade to Pro",
            description: "Unlock GPT-4 Class AI",
            className:
              "bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 border border-blue-500/30",
            icon: Zap,
            enabled: true,
          };
      }
    };

    const upgradeConfig = getUpgradeConfig();
    const Icon = upgradeConfig.icon;

    if (!upgradeConfig.enabled) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${upgradeConfig.className} transition-all duration-200`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-emerald-400">
                {upgradeConfig.text}
              </div>
              <div className="text-xs text-emerald-400/70">
                {upgradeConfig.description}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to="/pricing" onClick={onClose}>
          <Button
            variant="ghost"
            className={`w-full h-auto p-4 ${upgradeConfig.className} rounded-xl transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 rounded-lg bg-current/20">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold">
                  {upgradeConfig.text}
                </div>
                <div className="text-xs opacity-70">
                  {upgradeConfig.description}
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
          </Button>
        </Link>
      </motion.div>
    );
  }
);

PlanUpgradeCTA.displayName = "PlanUpgradeCTA";

const UserDropdown = memo<UserDropdownProps>(
  ({ user, onSignOut, className = "" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { usage, isLoading } = useUsageTracking();

    const userData = useMemo(() => {
      const fullName = user?.user_metadata?.full_name || "";
      const email = user?.email || "";
      const displayName = fullName || email.split("@")[0] || "User";
      return {
        displayName,
        email,
        avatarUrl: user?.user_metadata?.avatar_url,
      };
    }, [user]);

    const isActiveRoute = useCallback(
      (path: string) => {
        return location.pathname === path;
      },
      [location.pathname]
    );

    const handleDropdownClose = useCallback(() => {
      setIsDropdownOpen(false);
    }, []);

    const handleSettingsAction = useCallback(
      (action: string) => {
        switch (action) {
          case "profile":
            navigate("/profile");
            break;
          case "settings":
            navigate("/settings");
            break;
          case "notifications":
            navigate("/settings/notifications");
            break;
          case "security":
            navigate("/settings/security");
            break;
          case "referral":
            navigate("/referral");
            break;
          default:
            console.log(`Action: ${action}`);
        }
        handleDropdownClose();
      },
      [navigate, handleDropdownClose]
    );

    if (isLoading) {
      return (
        <Button
          variant="ghost"
          className={`
            relative flex items-center gap-2 md:gap-3 p-2 rounded-2xl
            hover:bg-primary/5 hover:border-primary/20 border border-transparent
            transition-all duration-300 group shrink-0 hover:shadow-lg hover:shadow-primary/10
            ${className}
          `}
          disabled
        >
          <UserAvatar user={user} size="sm" />
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-left min-w-0">
              <p className="text-sm font-medium text-foreground max-w-20 md:max-w-28 truncate leading-tight">
                {userData.displayName}
              </p>
              <div className="h-4 bg-muted/50 rounded w-12 animate-pulse" />
            </div>
          </div>
        </Button>
      );
    }

    const planType = usage?.plan_type || "Free";

    return (
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`
            relative flex items-center gap-2 md:gap-3 p-2 rounded-2xl
            hover:bg-primary/5 hover:border-primary/20 border border-transparent
            transition-all duration-300 group shrink-0 hover:shadow-lg hover:shadow-primary/10
            ${className}
          `}
            aria-label="Open user menu"
          >
            <UserAvatar
              user={user}
              showOnlineIndicator
              size="sm"
              variant="premium"
            />
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-foreground max-w-20 md:max-w-28 truncate leading-tight">
                  {userData.displayName}
                </p>
                <PlanBadge plan={planType} size="sm" showIcon={false} />
              </div>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </div>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden"
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>

        <AnimatePresence>
          {isDropdownOpen && (
            <DropdownMenuContent
              className="w-screen sm:w-96 mr-0 sm:mr-4 p-0 border border-white/10 shadow-2xl bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden"
              align="end"
              forceMount
              side="bottom"
              sideOffset={12}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ScrollArea className="max-h-[85vh] overflow-y-auto">
                  {/* **ENHANCED: Header section with better plan display** */}
                  <div className="p-4 md:p-6 bg-gradient-to-br from-primary/5 via-blue-600/5 to-purple-600/5 border-b border-white/10">
                    <div className="flex items-center gap-3 md:gap-4">
                      <UserAvatar
                        user={user}
                        size="lg"
                        variant="premium"
                        showOnlineIndicator
                        className="ring-2 ring-primary/30 shadow-xl"
                      />
                      <div className="flex flex-col space-y-2 min-w-0 flex-1">
                        <p className="font-semibold text-base md:text-lg text-white truncate">
                          {userData.displayName}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {userData.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <PlanBadge plan={planType} animated usage={usage} />
                        </div>
                        {usage && (
                          <div className="text-xs text-muted-foreground">
                            {planType === "Pro" || planType === "Advanced" ? (
                              <span className="text-green-400">
                                Unlimited usage
                              </span>
                            ) : (
                              <span>
                                {[
                                  usage.resume_tailors_used || 0,
                                  usage.cover_letters_used || 0,
                                  usage.job_searches_used || 0,
                                  usage.one_click_tailors_used || 0,
                                  usage.ats_checks_used || 0,
                                ].reduce((sum, val) => sum + val, 0)}{" "}
                                total uses this month
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* **NEW: Enhanced Plan Upgrade CTA** */}
                    <div className="mt-4">
                      <PlanUpgradeCTA
                        currentPlan={planType}
                        onClose={handleDropdownClose}
                      />
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <DropdownMenuGroup className="p-2">
                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 bg-muted/20 rounded-lg mb-2 flex items-center gap-2">
                      <Home className="w-3 h-3" />
                      Quick Navigation
                    </DropdownMenuLabel>
                    <div className="space-y-1">
                      {DROPDOWN_NAV_ITEMS.map((item) => (
                        <DropdownNavItem
                          key={item.to}
                          item={item}
                          isActive={isActiveRoute(item.to)}
                          onClick={handleDropdownClose}
                        />
                      ))}
                    </div>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="mx-4 bg-white/10" />

                  {/* Sign Out */}
                  <div className="p-2">
                    <DropdownMenuItem
                      onClick={onSignOut}
                      className="cursor-pointer hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl focus:bg-red-500/10 p-0 m-0"
                    >
                      <div className="flex items-center gap-3 px-3 py-3 w-full">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Sign out</div>
                          <div className="text-xs text-muted-foreground">
                            End your session
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </ScrollArea>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    );
  }
);

UserDropdown.displayName = "UserDropdown";

export default UserDropdown;
