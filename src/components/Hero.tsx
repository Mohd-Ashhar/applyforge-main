
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, take them to ATS checker or dashboard
      navigate('/ats-checker');
    } else {
      navigate('/auth');
    }
  };

  const handleWatchDemo = () => {
    if (!user) {
      navigate('/auth');
    } else {
      // Handle demo functionality for authenticated users
      console.log('Show demo for authenticated user');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-appforge-blue/10 via-transparent to-purple-500/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-appforge-blue/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 text-center relative z-10 pt-16 md:pt-8">
        {/* Social Proof Badge */}
        <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in mt-8 md:mt-0">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">Trusted by 10,000+ job seekers</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Get Interviews Faster with Smart{' '}
          <span className="gradient-text">AI-Powered</span>{' '}
          Tools
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in delay-200">
         Boost your resume, beat the ATS, and get job-matching done for you—instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-fade-in delay-400">
          <Button 
            size="lg" 
            className="bg-appforge-blue hover:bg-appforge-blue/80 text-black font-semibold px-8 py-4 text-lg group animate-glow"
            onClick={handleGetStarted}
          >
            {user ? 'Check ATS Now' : 'Get Started Free'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="border-2 border-white/20 hover:border-appforge-blue/50 px-8 py-4 text-lg group"
            onClick={handleWatchDemo}
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-600">
          {[
            '✨ AI Resume Tailor',
            '🎯 ATS Score Checker',
            '📝 Cover Letter Gen',
            '🔍 Smart Job Finder'
          ].map((feature, index) => (
            <div key={index} className="glass rounded-full px-4 py-2 text-sm">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
