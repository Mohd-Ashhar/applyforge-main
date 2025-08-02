import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

// **UPDATED: This is now the landing page for non-authenticated users**
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* **ALWAYS SHOW HEADER FOR LANDING PAGE** */}
      <Header />

      {/* **FULL LANDING PAGE EXPERIENCE** */}
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
