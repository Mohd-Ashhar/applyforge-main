import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Settings, Star, DollarSign } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate("/auth");
  };

  const handleSignUp = () => {
    navigate("/auth?mode=signup");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md shadow-background/10">
      <div className="container mx-auto max-w-full px-4 md:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="shrink-0"
        >
          <Logo />
        </motion.div>

        {/* Desktop Navigation with Anchor Links for Smooth Scroll */}
        <NavigationMenu
          className="hidden md:flex flex-1 justify-center"
          aria-label="Main navigation"
        >
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#features"
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Bot className="w-4 h-4 mr-2" />
                Features
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#how-it-works"
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                How It Works
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#testimonials"
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Star className="w-4 h-4 mr-2" />
                Ratings
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#pricing"
                className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons - Log in and Sign up */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 md:gap-3 shrink-0"
        >
          <button
            onClick={handleLogIn}
            className="group inline-flex h-10 w-max items-center justify-center rounded-xl bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Log in
          </button>
          <Button
            size="sm"
            className="text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl px-3 md:px-4"
            onClick={handleSignUp}
          >
            Sign up
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
