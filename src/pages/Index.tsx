
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import UsageStatsCard from '@/components/UsageStatsCard';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user ? <DashboardHeader /> : <Header />}
      <Hero />
      {user && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <UsageStatsCard />
          </div>
        </div>
      )}
      <Features />
      {!user && (
        <>
          <HowItWorks />
          <Testimonials />
          <Pricing />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;
