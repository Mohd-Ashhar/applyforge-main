import React from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  showTagline = true,
  linkTo = "/",
}) => {
  const logoContent = (
    <div
      className={`flex items-center space-x-3 group hover:scale-105 transition-all duration-300 ${className}`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-300">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          ApplyForge
        </span>
      
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{logoContent}</Link>;
  }

  return logoContent;
};

export default Logo;