
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface PlanBadgeProps {
  plan: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, size = 'md', showIcon = true }) => {
  const getPlanBadgeStyle = (planType: string) => {
    switch (planType) {
      case 'Pro': 
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300';
      case 'Basic': 
        return 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300';
      default: 
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg shadow-gray-500/20';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 h-4',
    md: 'text-xs px-3 py-1.5'
  };

  return (
    <Badge className={`${getPlanBadgeStyle(plan)} ${sizeClasses[size]} rounded-xl`}>
      {showIcon && <Crown className="w-2.5 h-2.5 mr-1" />}
      {plan} {size === 'md' ? 'Plan' : ''}
    </Badge>
  );
};

export default PlanBadge;
