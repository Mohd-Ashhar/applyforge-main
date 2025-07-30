import React, { memo, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck, // For ATS Check
  FileText, // For Resume Tailor
  PenSquare, // For Cover Letter
  Search, // For Job Search
} from "lucide-react";
import { motion } from "framer-motion";

// FINAL NAV STRUCTURE: Only core product features
const NAV_ITEMS = [
  {
    to: "/ats-checker",
    icon: ShieldCheck,
    label: "ATS Check",
    shortLabel: "ATS",
  },
  {
    to: "/ai-resume-tailor",
    icon: FileText,
    label: "Resume Tailor",
    shortLabel: "Resumes",
  },
  {
    to: "/cover-letter-generator",
    icon: PenSquare,
    label: "Cover Letter",
    shortLabel: "Letters",
  },
  {
    to: "/job-finder",
    icon: Search,
    label: "Job Search",
    shortLabel: "Search",
  },
] as const;

// Minimal, modern navigation item
const NavigationItem = memo(
  ({ item, isActive }: { item: (typeof NAV_ITEMS)[0]; isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.to}
        className="relative group"
        aria-label={`Navigate to ${item.label}`}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 overflow-hidden
            ${
              isActive
                ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-sm"
                : "text-gray-200 hover:text-blue-400 hover:bg-blue-500/5 border border-transparent hover:border-blue-400/10"
            }
          `}
        >
          <div
            className={`
              absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg
              ${isActive ? "opacity-100" : ""}
            `}
          />
          <div className="relative flex items-center gap-1.5 z-10">
            <Icon
              className={`
                w-4 h-4 transition-all duration-200
                ${isActive ? "text-blue-400" : "text-current"}
              `}
            />
            <span className="hidden xl:inline font-semibold tracking-wide">
              {item.label}
            </span>
            <span className="xl:hidden font-semibold tracking-wide">
              {item.shortLabel}
            </span>
          </div>
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-400 rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    );
  }
);
NavigationItem.displayName = "NavigationItem";

const NavigationMenu = memo(() => {
  const location = useLocation();

  const isActiveRoute = useMemo(
    () => (path: string) => location.pathname === path,
    [location.pathname]
  );

  return (
    <nav
      className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-auto"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 p-0.5 bg-slate-800/80 backdrop-blur-[2px] border border-white/10 rounded-xl shadow-md">
        {NAV_ITEMS.map((item) => (
          <NavigationItem
            key={item.to}
            item={item}
            isActive={isActiveRoute(item.to)}
          />
        ))}
      </div>
    </nav>
  );
});

NavigationMenu.displayName = "NavigationMenu";
export default NavigationMenu;
