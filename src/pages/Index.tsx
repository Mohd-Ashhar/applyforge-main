import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async"; // 1. Import Helmet

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show landing page for non-authenticated users
  return (
    <>
      {/* 2. Add the Helmet component */}
      <Helmet>
        <title>ApplyForge | AI Resume Tailor & Cover Letter Generator</title>
        <meta
          name="description"
          content="Supercharge your job search with ApplyForge's AI toolkit. Instantly tailor your resume, generate unique cover letters, and track your applications to land your dream job."
        />
        <link rel="canonical" href="https://applyforge.ai/" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
