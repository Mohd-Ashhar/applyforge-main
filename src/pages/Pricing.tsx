
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/services/paymentService';

const Pricing = () => {
  const { processPayment, isProcessing } = usePayment();
  const { user } = useAuth();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    await processPayment(plan);
  };

  const plans = [
    {
      name: 'Free' as SubscriptionPlan,
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started with job applications',
      features: [
        'Basic ATS Resume Checker',
        'Limited AI Resume Tailoring (5/month)',
        'Basic Cover Letter Generator (3/month)',
        'Job Search & Save (unlimited)',
        'Community Support'
      ],
      buttonText: 'Get Started',
      popular: false,
      bestValue: false
    },
    {
      name: 'Basic' as SubscriptionPlan,
      price: '₹199',
      period: 'month',
      description: 'Most popular choice for active job seekers',
      features: [
        'Advanced ATS Resume Checker',
        'Unlimited AI Resume Tailoring',
        'Unlimited Cover Letter Generation',
        'Smart Job Finder with Premium Filters',
        'One-Click Tailoring',
        'Priority Email Support',
        'Resume Templates Library'
      ],
      buttonText: 'Subscribe Now',
      popular: true,
      bestValue: false
    },
    {
      name: 'Pro' as SubscriptionPlan,
      price: '₹499',
      period: 'month',
      description: 'Best value for serious professionals',
      features: [
        'Everything in Basic',
        'Auto-Apply Agent (Coming Soon)',
        'Interview Preparation AI',
        'Salary Negotiation Assistant',
        'Personal Career Coach AI',
        'Advanced Analytics & Insights',
        '1-on-1 Career Consultation',
        'LinkedIn Profile Optimization'
      ],
      buttonText: 'Subscribe Now',
      popular: false,
      bestValue: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan to accelerate your job search and land your dream role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative glass hover-lift ${
                  plan.popular ? 'border-appforge-blue ring-2 ring-appforge-blue/20' : ''
                } ${plan.bestValue ? 'border-green-500 ring-2 ring-green-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-appforge-blue text-black px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      Best Value
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={isProcessing}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-appforge-blue hover:bg-appforge-blue/80 text-black' 
                        : plan.bestValue
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              All paid plans include a 7-day free trial. No credit card required.
            </p>
            <p className="text-sm text-muted-foreground">
              Need help choosing? <Link to="/feedback" className="text-appforge-blue hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
