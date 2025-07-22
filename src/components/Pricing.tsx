
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlan } from '@/services/paymentService';

const Pricing = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
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
      priceINR: '₹0',
      priceUSD: '$0',
      period: 'forever',
      description: 'Perfect for trying out ApplyForge',
      icon: <Zap className="w-6 h-6" />,
      features: [
        '2 resume tailoring per month',
        'Basic ATS checker',
        '1 cover letter generation',
        'Job search access',
        'Community support'
      ],
      limitations: [
        'Limited templates',
        'No priority support',
        'Basic features only'
      ],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      name: 'Basic' as SubscriptionPlan,
      priceINR: '₹199',
      priceUSD: '$2.99',
      period: 'per month',
      description: 'Most popular choice for active job seekers',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Unlimited resume tailoring',
        'Advanced ATS analysis',
        'Unlimited cover letters',
        'Priority job matching',
        'All resume templates',
        'Email support',
        'Export in multiple formats',
        'Resume storage & history'
      ],
      cta: 'Start Free Trial',
      highlight: true,
      badge: 'Most Popular'
    },
    {
      name: 'Pro' as SubscriptionPlan,
      priceINR: '₹499',
      priceUSD: '$7.99',
      period: 'per month',
      description: 'Best value for serious professionals',
      icon: <Rocket className="w-6 h-6" />,
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
      cta: 'Start Free Trial',
      highlight: false,
      badge: 'Best Value'
    }
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your job search goals. Start free, upgrade when ready.
          </p>
          
          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={currency === 'INR' ? 'default' : 'outline'}
              onClick={() => setCurrency('INR')}
              size="sm"
            >
              India (₹)
            </Button>
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              onClick={() => setCurrency('USD')}
              size="sm"
            >
              International ($)
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 relative overflow-hidden ${
                plan.highlight 
                  ? 'glass border-appforge-blue/50 ring-2 ring-appforge-blue/20 scale-105' 
                  : plan.badge === 'Best Value'
                  ? 'glass border-green-500/50 ring-2 ring-green-500/20'
                  : 'glass border-white/10'
              } hover-lift group`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  plan.highlight 
                    ? 'bg-appforge-blue text-black' 
                    : 'bg-green-500 text-white'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`mb-4 p-3 rounded-xl w-fit mx-auto ${
                  plan.highlight 
                    ? 'bg-appforge-blue/20 text-appforge-blue' 
                    : plan.badge === 'Best Value'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-white/10 text-white'
                } group-hover:scale-110 transition-transform`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {currency === 'INR' ? plan.priceINR : plan.priceUSD}
                  </span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations && plan.limitations.map((limitation, idx) => (
                  <div key={idx} className="flex items-center space-x-3 opacity-60">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={isProcessing}
                className={`w-full ${
                  plan.highlight 
                    ? 'bg-appforge-blue hover:bg-appforge-blue/80 text-black' 
                    : plan.badge === 'Best Value'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                } font-semibold py-3`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.cta
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee for all paid plans if you're not satisfied with our service."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, UPI, and bank transfers for Indian customers. International customers can pay via credit/debit cards."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
              }
            ].map((faq, index) => (
              <div key={index} className="glass rounded-lg p-4">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
