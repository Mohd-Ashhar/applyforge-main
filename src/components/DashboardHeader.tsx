import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/ui/Logo";
import UserDropdown from "./header/UserDropdown";
import AuthButtons from "./header/AuthButtons";
import { useHeaderScrollBehavior } from "./header/HeaderScrollBehavior";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState("Free");
  const { isVisible } = useHeaderScrollBehavior();

  useEffect(() => {
    if (user?.email) {
      fetchUserPlan();
    }
  }, [user]);

  const fetchUserPlan = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("Error fetching user plan:", error);
        return;
      }

      setUserPlan(data?.plan || "Free");
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Motion variants for smooth header animation
  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      pointerEvents: "auto",
      boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
    },
    hidden: {
      y: "-100%",
      opacity: 0,
      pointerEvents: "none",
      boxShadow: "none",
    },
  };

  return (
    <>
      {/* Padding to offset fixed/ sticky header height */}
      <div className="h-14 md:h-16" />

      <AnimatePresence>
        {user ? (
          <motion.header
            key="logged-in-header"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            exit="hidden"
            variants={headerVariants}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[9999] w-full backdrop-blur-xl bg-background/90 supports-[backdrop-filter]:bg-background/70 border-b border-border/50"
          >
            <div className="container mx-auto max-w-full px-4 md:px-8 h-14 md:h-16 flex items-center gap-4">
              {/* Logo with tagline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Logo className="flex-shrink-0" showTagline={true} />
              </motion.div>

              {/* Flexible spacer to push UserDropdown to the right but not to the far edge */}
              <div className="flex-1" />

              {/* User dropdown with subtle fade-in */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <UserDropdown
                  user={user}
                  // userPlan={userPlan}
                  onSignOut={handleSignOut}
                />
              </motion.div>
            </div>
          </motion.header>
        ) : (
          <motion.header
            key="logged-out-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sticky top-0 left-0 right-0 z-[9999] w-full backdrop-blur-xl bg-background/90 supports-[backdrop-filter]:bg-background/70 border-b border-border/50 shadow-sm"
          >
            <div className="container mx-auto max-w-full px-4 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
              <Logo className="flex-shrink-0" showTagline={true} />
              <AuthButtons />
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardHeader;
