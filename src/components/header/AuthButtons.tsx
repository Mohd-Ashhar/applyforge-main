
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/auth')}
        className="hover:scale-105 transition-all duration-300 hover:bg-muted/60 text-xs md:text-sm px-3 md:px-4 py-2"
      >
        Sign in
      </Button>
      <Button 
        size="sm" 
        onClick={() => navigate('/auth?mode=signup')}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xs md:text-sm px-3 md:px-4 py-2"
      >
        Get Started
      </Button>
    </div>
  );
};

export default AuthButtons;
