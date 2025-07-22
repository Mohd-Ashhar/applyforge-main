
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
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
  BarChart3
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import UserAvatar from './UserAvatar';
import PlanBadge from './PlanBadge';

interface UserDropdownProps {
  user: User;
  userPlan: string;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, userPlan, onSignOut }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const dropdownNavItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/tailored-resumes", icon: FileText, label: "Tailored Resumes" },
    { to: "/saved-cover-letters", icon: Edit3, label: "Cover Letters" },
    { to: "/saved-jobs", icon: Bookmark, label: "Saved Jobs" },
    { to: "/applied-jobs", icon: CheckCircle, label: "Applied Jobs" },
    { to: "/feedback", icon: BarChart3, label: "Feedback" },
  ];

  return (
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative flex items-center gap-2 md:gap-3 p-2 rounded-2xl hover:bg-muted/60 transition-all duration-300 group flex-shrink-0 hover:shadow-lg hover:shadow-primary/10"
        >
          <UserAvatar user={user} showOnlineIndicator />
          
          {/* User info - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-left">
              <p className="text-sm font-medium text-foreground max-w-20 md:max-w-28 truncate leading-tight">
                {getUserName()}
              </p>
              <PlanBadge plan={userPlan} size="sm" />
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-all duration-300 ${
              isDropdownOpen ? 'rotate-180 text-primary' : 'group-hover:text-foreground'
            }`} />
          </div>
          
          {/* Mobile chevron */}
          <ChevronDown className={`w-4 h-4 text-muted-foreground sm:hidden transition-all duration-300 ${
            isDropdownOpen ? 'rotate-180 text-primary' : 'group-hover:text-foreground'
          }`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-screen sm:w-96 mr-0 sm:mr-4 p-0 border-0 shadow-2xl z-[10000] bg-background/95 backdrop-blur-xl rounded-2xl" 
        align="end" 
        forceMount
        side="bottom"
        sideOffset={12}
      >
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          {/* User Profile Section */}
          <div className="p-4 md:p-6 bg-gradient-to-br from-primary/5 via-blue-600/5 to-primary/10 border-b border-border/50 rounded-t-2xl">
            <div className="flex items-center gap-3 md:gap-4">
              <UserAvatar user={user} size="lg" className="ring-2 ring-primary/30 shadow-xl" />
              <div className="flex flex-col space-y-2 leading-none min-w-0 flex-1">
                <p className="font-semibold text-base md:text-lg truncate">{getUserName()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2">
                  <PlanBadge plan={userPlan} />
                  {userPlan === 'Free' && (
                    <Link to="/pricing">
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-3 hover:bg-primary/10 hover:text-primary rounded-xl">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation - Mobile Navigation Items */}
          <DropdownMenuGroup className="p-2">
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 bg-muted/20 rounded-lg mb-2">
              Quick Navigation
            </DropdownMenuLabel>
            {dropdownNavItems.map((item) => (
              <DropdownMenuItem key={item.to} asChild className="cursor-pointer hover:bg-muted/50 rounded-xl mx-0 px-3 py-3 mb-1">
                <Link to={item.to} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="mx-4" />

          {/* Settings & More */}
          <DropdownMenuGroup className="p-2">
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-2 bg-muted/20 rounded-lg mb-2">
              Settings & More
            </DropdownMenuLabel>
            
            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 rounded-xl mx-0 px-3 py-3 mb-1">
              <div className="p-2 rounded-lg bg-muted/30 mr-3">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Account Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted/50 rounded-xl mx-0 px-3 py-3 mb-1">
              <Link to="/pricing" className="flex items-center">
                <div className="p-2 rounded-lg bg-muted/30 mr-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">Billing & Plan</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 rounded-xl mx-0 px-3 py-3 mb-1">
              <div className="p-2 rounded-lg bg-muted/30 mr-3">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Help Center</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 rounded-xl mx-0 px-3 py-3 mb-1">
              <div className="p-2 rounded-lg bg-muted/30 mr-3">
                <Gift className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm">Refer a Friend</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="mx-4" />

          {/* Log Out */}
          <div className="p-2">
            <DropdownMenuItem 
              onClick={onSignOut} 
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-xl focus:bg-red-50 dark:focus:bg-red-950/20 mx-0 px-3 py-3"
            >
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20 mr-3">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </DropdownMenuItem>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
