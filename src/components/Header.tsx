import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
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
  X
} from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import Logo from '@/components/ui/Logo';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const handleSignUp = () => {
    navigate('/auth?mode=signup');
  };

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  const handleFeedback = () => {
    navigate('/feedback');
  };

  // Dashboard header for logged-in users
  if (user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/tailored-resumes" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <FileText className="w-4 h-4" />
              Tailored Resumes
            </Link>
            
            <Link 
              to="/saved-cover-letters" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <Upload className="w-4 h-4" />
              Cover Letters
            </Link>
            
            <Link 
              to="/saved-jobs" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <Bookmark className="w-4 h-4" />
              Saved Jobs
            </Link>

            <Link 
              to="/applied-jobs" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <CheckCircle className="w-4 h-4" />
              Applied Jobs
            </Link>

            <Link 
              to="/one-click-tailoring" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <Briefcase className="w-4 h-4" />
              One-Click Tailoring
            </Link>
            
            <Link 
              to="/pricing"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <CreditCard className="w-4 h-4" />
              Pricing
            </Link>
            
            <button 
              onClick={handleFeedback}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted/50 hover:scale-105 transition-all duration-200 hover:text-primary"
            >
              <MessageSquare className="w-4 h-4" />
              Feedback
            </button>
          </nav>

          {/* Mobile Menu and User Controls */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden hover:scale-105 transition-transform duration-200">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl font-bold gradient-text">Navigation</SheetTitle>
                </SheetHeader>
                <div className="space-y-3">
                  <SheetClose asChild>
                    <Link 
                      to="/tailored-resumes" 
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-medium">Tailored Resumes</span>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link 
                      to="/saved-cover-letters" 
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <Upload className="w-5 h-5 text-primary" />
                      <span className="font-medium">Cover Letters</span>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link 
                      to="/saved-jobs" 
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <Bookmark className="w-5 h-5 text-primary" />
                      <span className="font-medium">Saved Jobs</span>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link 
                      to="/applied-jobs" 
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="font-medium">Applied Jobs</span>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link 
                      to="/one-click-tailoring" 
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span className="font-medium">One-Click Tailoring</span>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link 
                      to="/pricing"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="font-medium">Pricing</span>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <button 
                      onClick={handleFeedback}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                    >
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-medium">Feedback</span>
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground max-w-32 truncate">
                {user.email}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAuthAction} 
              className="hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // Enhanced header for non-logged-in users
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium hover:text-primary transition-all duration-200 bg-transparent hover:bg-muted/50 rounded-xl px-4 py-2">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <div className="grid gap-1">
                    <NavigationMenuLink 
                      onClick={() => handleProtectedNavigation('/ai-resume-tailor')}
                      className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <FileText className="w-4 h-4 text-primary" />
                        AI Resume Tailor
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Customize your resume for specific job applications with AI assistance.
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink 
                      onClick={() => handleProtectedNavigation('/cover-letter-generator')}
                      className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <Upload className="w-4 h-4 text-primary" />
                        Cover Letter Generator
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Generate compelling cover letters tailored to job requirements.
                      </p>
                    </NavigationMenuLink>
                  </div>
                  <div className="grid gap-1">
                    <NavigationMenuLink 
                      onClick={() => handleProtectedNavigation('/job-finder')}
                      className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Job Finder
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Discover relevant job opportunities that match your skills.
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink 
                      onClick={() => handleProtectedNavigation('/ats-checker')}
                      className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <Shield className="w-4 h-4 text-primary" />
                        ATS Checker
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Optimize your resume to pass Applicant Tracking Systems.
                      </p>
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink 
                href="#how-it-works" 
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                How It Works
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink 
                href="#pricing" 
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink 
                onClick={() => handleProtectedNavigation('/ats-checker')}
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu and Auth Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden hover:scale-105 transition-transform duration-200 p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-bold gradient-text">Menu</SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">Features</h3>
                  <div className="space-y-2">
                    <SheetClose asChild>
                      <button
                        onClick={() => handleProtectedNavigation('/ai-resume-tailor')}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-medium">AI Resume Tailor</span>
                      </button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <button
                        onClick={() => handleProtectedNavigation('/cover-letter-generator')}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                      >
                        <Upload className="w-5 h-5 text-primary" />
                        <span className="font-medium">Cover Letter Generator</span>
                      </button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <button
                        onClick={() => handleProtectedNavigation('/job-finder')}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                      >
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span className="font-medium">Job Finder</span>
                      </button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <button
                        onClick={() => handleProtectedNavigation('/ats-checker')}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                      >
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-medium">ATS Checker</span>
                      </button>
                    </SheetClose>
                  </div>
                </div>
                
                <SheetClose asChild>
                  <a 
                    href="#how-it-works"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                  >
                    <span className="font-medium">How It Works</span>
                  </a>
                </SheetClose>
                
                <SheetClose asChild>
                  <a 
                    href="#pricing"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                  >
                    <span className="font-medium">Pricing</span>
                  </a>
                </SheetClose>
                
                <SheetClose asChild>
                  <button
                    onClick={() => handleProtectedNavigation('/ats-checker')}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 hover:scale-105 w-full text-left"
                  >
                    <Star className="w-5 h-5 text-primary" />
                    <span className="font-medium">Reviews</span>
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          {/* Auth Buttons */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAuthAction}
            className="hover:scale-105 transition-all duration-200 hover:bg-muted/50 text-xs sm:text-sm px-2 sm:px-4"
          >
            Log in
          </Button>
          <Button 
            size="sm" 
            onClick={handleSignUp}
            className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm px-2 sm:px-4"
          >
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
