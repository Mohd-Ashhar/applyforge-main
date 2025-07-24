import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Upload,
  Bookmark,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  Briefcase,
  CheckCircle,
  Menu,
  Star,
  Shield,
  X,
  ExternalLink,
  Share2,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleSignUp = () => {
    navigate("/auth?mode=signup");
  };

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  const handleFeedback = () => {
    navigate("/feedback");
  };

  // Animation variants for fade + scale on menu items
  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  if (user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md shadow-background/10">
        <div className="container mx-auto max-w-full px-6 md:px-12 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={itemVariants}
          >
            <Logo />
          </motion.div>

          {/* Desktop Navigation */}
          <NavigationMenu
            className="hidden lg:flex flex-1 max-w-5xl justify-center"
            aria-label="Primary navigation"
          >
            <NavigationMenuList className="flex space-x-2">
              {[
                {
                  label: "Tailored Resumes",
                  icon: FileText,
                  to: "/tailored-resumes",
                },
                {
                  label: "Cover Letters",
                  icon: Upload,
                  to: "/saved-cover-letters",
                },
                {
                  label: "Saved Jobs",
                  icon: Bookmark,
                  to: "/saved-jobs",
                },
                {
                  label: "Applied Jobs",
                  icon: CheckCircle,
                  to: "/applied-jobs",
                },
                {
                  label: "One-Click Tailoring",
                  icon: Briefcase,
                  to: "/one-click-tailoring",
                },
                {
                  label: "Pricing",
                  icon: CreditCard,
                  to: "/pricing",
                },
              ].map(({ label, icon: Icon, to }) => (
                <NavigationMenuItem key={to}>
                  <NavigationMenuLink
                    asChild
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-primary hover:scale-105 transition-all duration-200"
                  >
                    <Link to={to} tabIndex={0} aria-label={label}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <button
                  onClick={handleFeedback}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-primary hover:scale-105 transition-all duration-200"
                  aria-label="Feedback"
                  type="button"
                >
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu and User Controls */}
          <div className="flex items-center space-x-3">
            {/* User Email and Icon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2 text-sm max-w-[140px] truncate"
            >
              <User className="w-4 h-4 text-primary" />
              <span title={user.email} className="truncate">
                {user.email}
              </span>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:scale-110 transition-transform duration-300"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl font-bold gradient-text">
                    Navigation
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-1">
                  {[
                    {
                      label: "Tailored Resumes",
                      icon: FileText,
                      to: "/tailored-resumes",
                    },
                    {
                      label: "Cover Letters",
                      icon: Upload,
                      to: "/saved-cover-letters",
                    },
                    { label: "Saved Jobs", icon: Bookmark, to: "/saved-jobs" },
                    {
                      label: "Applied Jobs",
                      icon: CheckCircle,
                      to: "/applied-jobs",
                    },
                    {
                      label: "One-Click Tailoring",
                      icon: Briefcase,
                      to: "/one-click-tailoring",
                    },
                    { label: "Pricing", icon: CreditCard, to: "/pricing" },
                  ].map(({ label, icon: Icon, to }) => (
                    <SheetClose asChild key={to}>
                      <Link
                        to={to}
                        className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <button
                      onClick={handleFeedback}
                      className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200 w-full text-left"
                      type="button"
                    >
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-medium">Feedback</span>
                    </button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Log out button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthAction}
              className="flex items-center gap-1 whitespace-nowrap shadow hover:shadow-lg"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // Non-logged-in header with advanced styling and menu
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md shadow-background/10">
      <div className="container mx-auto max-w-full px-6 md:px-12 h-16 flex items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Logo />
        </motion.div>

        <NavigationMenu className="hidden md:flex" aria-label="Main navigation">
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-primary transition-transform duration-200"
              >
                <Link to="/job-finder">Job Finder</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-primary transition-transform duration-200"
              >
                <Link to="/pricing">Pricing</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-primary transition-transform duration-200"
              >
                <Link to="/auth?mode=signup">Sign Up</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAuthAction}
            className="hover:scale-105 transition-transform duration-200"
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            onClick={handleSignUp}
          >
            Sign up
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:scale-105 transition-transform duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-bold gradient-text">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                <SheetClose asChild>
                  <Link
                    to="/job-finder"
                    className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200"
                  >
                    <Briefcase className="w-5 h-5 text-primary" />
                    Job Finder
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/pricing"
                    className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200"
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    Pricing
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/auth?mode=signup"
                    className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200"
                  >
                    <User className="w-5 h-5 text-primary" />
                    Sign Up
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-muted/50 transition transform hover:scale-105 duration-200"
                  >
                    <User className="w-5 h-5 text-primary" />
                    Log in
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
