import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, CreditCard } from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { Link } from 'react-router-dom';

const UsageStatsCard = () => {
  const { usage, isLoading } = useUsageTracking();

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Your Monthly Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usage) return null;

  const getLimit = (feature: string) => {
    const limits = {
      'Free': {
        resume_tailors_used: 5,
        cover_letters_used: 3,
        job_searches_used: 10,
        one_click_tailors_used: 2,
        ats_checks_used: 3
      },
      'Basic': {
        resume_tailors_used: 50,
        cover_letters_used: 25,
        job_searches_used: 100,
        one_click_tailors_used: 20,
        ats_checks_used: 25
      },
      'Pro': {
        resume_tailors_used: -1,
        cover_letters_used: -1,
        job_searches_used: -1,
        one_click_tailors_used: -1,
        ats_checks_used: -1
      }
    };

    const planLimits = limits[usage.plan_type as keyof typeof limits] || limits['Free'];
    return planLimits[feature as keyof typeof planLimits] || 0;
  };

  const formatUsage = (used: number, limit: number) => {
    if (limit === -1) return `${used}/∞`;
    return `${used}/${limit}`;
  };

  const getProgressValue = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const usageItems = [
    {
      label: 'Resume Tailors Used',
      used: usage.resume_tailors_used || 0,
      limit: getLimit('resume_tailors_used'),
      color: 'bg-blue-500'
    },
    {
      label: 'Cover Letters Used',
      used: usage.cover_letters_used || 0,
      limit: getLimit('cover_letters_used'),
      color: 'bg-green-500'
    },
    {
      label: 'Job Searches Used',
      used: usage.job_searches_used || 0,
      limit: getLimit('job_searches_used'),
      color: 'bg-purple-500'
    },
    {
      label: '1-Click Tailors Used',
      used: usage.one_click_tailors_used || 0,
      limit: getLimit('one_click_tailors_used'),
      color: 'bg-orange-500'
    },
    {
      label: 'ATS Checks Used',
      used: usage.ats_checks_used || 0,
      limit: getLimit('ats_checks_used'),
      color: 'bg-red-500'
    }
  ];

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Monthly Usage
            </CardTitle>
            <CardDescription>
              Track your feature usage for the current billing period
            </CardDescription>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {usage.plan_type} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usageItems.map((item, index) => {
            const isAtLimit = item.limit !== -1 && item.used >= item.limit;
            const progressValue = getProgressValue(item.used, item.limit);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isAtLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {formatUsage(item.used, item.limit)}
                    </span>
                    {isAtLimit && usage.plan_type === 'Free' && (
                      <Link to="/pricing">
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                {item.limit !== -1 && (
                  <Progress 
                    value={progressValue} 
                    className="h-2"
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {usage.plan_type === 'Free' && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Need more usage? Upgrade to unlock higher limits or unlimited access.
            </p>
            <Link to="/pricing">
              <Button size="sm" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;