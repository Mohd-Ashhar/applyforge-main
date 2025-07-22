
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Target, 
  Mail, 
  Search, 
  Zap, 
  Bot,
  CheckCircle,
  TrendingUp 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFeatureClick = (path?: string, implemented = false) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!implemented) {
      toast({
        title: "Coming Soon",
        description: "This feature is currently under development and will be available soon!",
      });
      return;
    }
    
    if (path) {
      navigate(path);
    }
  };

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'ATS Resume Checker',
      description: 'Upload your resume and job description to get an instant ATS compatibility score with detailed improvement suggestions.',
      benefits: ['Match Score Analysis', 'Missing Keywords Detection', 'Formatting Tips'],
      clickable: true,
      path: '/ats-checker',
      implemented: true
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'AI Resume Tailor',
      description: 'Automatically customize your resume for each job application using advanced AI that understands job requirements.',
      benefits: ['Smart Keyword Optimization', 'Role-Specific Tailoring', 'Instant Downloads'],
      clickable: true,
      path: '/ai-resume-tailor',
      implemented: true
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Cover Letter Generator',
      description: 'Generate personalized, compelling cover letters that perfectly match your resume and target job position.',
      benefits: ['Personalized Content', 'Multiple Tone Options', 'Professional Templates'],
      clickable: true,
      path: '/cover-letter-generator',
      implemented: true
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Job Finder',
      description: 'Discover relevant job opportunities with advanced filtering and one-click resume tailoring for each position.',
      benefits: ['Intelligent Matching', 'Real-time Updates', 'Save & Track Jobs'],
      clickable: true,
      path: '/job-finder',
      implemented: true
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'One-Click Tailoring',
      description: 'Tailor your resume directly from job listings with a single click. No more manual copying and pasting.',
      benefits: ['Instant Processing', 'Seamless Integration', 'Time Saving'],
      clickable: true,
      path: '/one-click-tailoring',
      implemented: true
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'Auto-Apply Agent',
      description: 'Coming soon: Browser automation that applies to your saved jobs automatically while you sleep.',
      benefits: ['24/7 Applications', 'Smart Filtering', 'Application Tracking'],
      comingSoon: true,
      clickable: true,
      implemented: false
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="gradient-text">Job Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize your job search and land interviews faster
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`p-8 glass hover-lift group relative overflow-hidden ${
                feature.comingSoon ? 'border-purple-500/30' : 'border-white/10'
              } ${feature.clickable ? 'cursor-pointer' : ''}`}
              onClick={() => feature.clickable && handleFeatureClick(feature.path, feature.implemented)}
            >
              {feature.comingSoon && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              
              <div className={`mb-6 p-3 rounded-xl w-fit ${
                feature.comingSoon 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-appforge-blue/20 text-appforge-blue'
              } group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4 group-hover:text-appforge-blue transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>

              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 glass rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-muted-foreground">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">3x</div>
              <div className="text-muted-foreground">More Interviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">10min</div>
              <div className="text-muted-foreground">Average Setup Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
