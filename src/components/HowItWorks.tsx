
import React from 'react';
import { Card } from '@/components/ui/card';
import { Upload, Wand2, Download, Send } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Your Resume',
      description: 'Upload your existing resume or create one using our templates. We support all major formats.',
      step: '01'
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: 'Paste Job Description',
      description: 'Copy and paste the job description you want to apply for. Our AI analyzes the requirements.',
      step: '02'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Get Tailored Resume',
      description: 'Receive your optimized resume with improved ATS score and relevant keywords highlighted.',
      step: '03'
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: 'Apply with Confidence',
      description: 'Download your tailored resume and cover letter, then apply knowing you have the best chance.',
      step: '04'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="gradient-text">ApplyForge</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get from resume upload to job application in just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-appforge-blue/50 to-transparent z-0"></div>
              )}
              
              <Card className="p-8 glass hover-lift group relative z-10 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-appforge-blue text-black rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="mb-6 p-4 rounded-xl w-fit mx-auto bg-appforge-blue/20 text-appforge-blue group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 group-hover:text-appforge-blue transition-colors">
                  {step.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Job Search?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful job seekers who've landed their dream jobs with ApplyForge
            </p>
            <button className="bg-appforge-blue hover:bg-appforge-blue/80 text-black font-semibold px-8 py-4 rounded-lg transition-colors">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
