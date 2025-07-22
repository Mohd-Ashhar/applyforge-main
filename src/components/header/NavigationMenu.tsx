
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Edit3, Bookmark, CheckCircle, BarChart3 } from 'lucide-react';

const NavigationMenu: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: "/tailored-resumes", icon: FileText, label: "Tailored Resumes", shortLabel: "Resumes" },
    { to: "/saved-cover-letters", icon: Edit3, label: "Cover Letters", shortLabel: "Letters" },
    { to: "/saved-jobs", icon: Bookmark, label: "Saved Jobs", shortLabel: "Saved" },
    { to: "/applied-jobs", icon: CheckCircle, label: "Applied Jobs", shortLabel: "Applied" },
    { to: "/feedback", icon: BarChart3, label: "Feedback", shortLabel: "Feedback" },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
      {navItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className={`
            relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
            hover:bg-muted/60 hover:scale-105 active:scale-95
            ${isActiveRoute(item.to) 
              ? 'text-primary bg-primary/10 shadow-lg shadow-primary/20' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <item.icon className={`w-4 h-4 ${isActiveRoute(item.to) ? 'text-primary' : ''}`} />
            <span className="hidden xl:inline">{item.label}</span>
            <span className="xl:hidden">{item.shortLabel}</span>
          </div>
          {isActiveRoute(item.to) && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-full" />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
