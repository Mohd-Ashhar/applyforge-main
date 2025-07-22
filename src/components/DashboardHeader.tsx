
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/ui/Logo';
import NavigationMenu from './header/NavigationMenu';
import UserDropdown from './header/UserDropdown';
import AuthButtons from './header/AuthButtons';
import { useHeaderScrollBehavior } from './header/HeaderScrollBehavior';

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<string>('Free');
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
        .from('profiles')
        .select('plan')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error fetching user plan:', error);
        return;
      }

      setUserPlan(data?.plan || 'Free');
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // For logged-in users
  if (user) {
    return (
      <>
        {/* Add padding to body to account for header height */}
        <div className="h-14 md:h-16" />
        <header className={`
          fixed top-0 left-0 right-0 z-[9999] w-full
          transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}
          backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60
          border-b border-border/50 shadow-lg shadow-background/10
        `}>
          <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between max-w-full">
            {/* Logo Section - Always show tagline */}
            <Logo className="flex-shrink-0" showTagline={true} />
            
            {/* Desktop Navigation - Hidden on mobile */}
            <NavigationMenu />

            {/* Modern User Dropdown */}
            <UserDropdown 
              user={user} 
              userPlan={userPlan} 
              onSignOut={handleSignOut} 
            />
          </div>
        </header>
      </>
    );
  }

  // For non-logged-in users
  return (
    <>
      {/* Add padding to body to account for header height */}
      <div className="h-14 md:h-16" />
      <header className="sticky md:sticky top-0 left-0 right-0 z-[9999] w-full backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-lg shadow-background/10">
        <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between max-w-full">
          {/* Logo - Always show tagline */}
          <Logo className="flex-shrink-0" showTagline={true} />

          {/* Auth Buttons - Only show these for non-logged-in users */}
          <AuthButtons />
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
