
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showOnlineIndicator?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  showOnlineIndicator = false,
  className = '' 
}) => {
  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-8 h-8 md:w-9 md:h-9',
    lg: 'w-14 h-14 md:w-16 md:h-16'
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 shadow-md ${className}`}>
        <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-blue-600/20 text-primary font-semibold text-xs md:text-sm">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      {showOnlineIndicator && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm animate-pulse">
          <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
