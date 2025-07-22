
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      content: 'AppForge helped me land my dream job at Google! The ATS checker showed exactly what recruiters were looking for, and the tailored resume got me 5x more interviews.',
      rating: 5
    },
    {
      name: 'Raj Patel',
      role: 'Product Manager',
      company: 'Microsoft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      content: 'The cover letter generator is incredible. It created personalized letters that perfectly matched each job I applied for. Saved me hours and increased my response rate.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      company: 'Meta',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      content: 'I was struggling with ATS systems until I found AppForge. My resume went from 2% to 89% ATS compatibility. Got hired within 2 weeks!',
      rating: 5
    },
    {
      name: 'Michael Kim',
      role: 'UX Designer',
      company: 'Figma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      content: 'The job finder feature is a game-changer. It not only found relevant positions but also let me tailor my resume for each application with one click.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Marketing Manager',
      company: 'Shopify',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
      content: 'As someone changing careers, AppForge made it easy to highlight transferable skills. The AI understood exactly how to position my experience.',
      rating: 5
    },
    {
      name: 'David Johnson',
      role: 'DevOps Engineer',
      company: 'Amazon',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      content: 'The Pro plan paid for itself after my first job switch. The salary increase from landing a better position was 10x the subscription cost.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">10,000+</span> Job Seekers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how AppForge has helped professionals land their dream jobs at top companies
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 glass hover-lift group">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-appforge-blue/50 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Trusted by Professionals at</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              'Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 
              'Netflix', 'Uber', 'Airbnb', 'Spotify', 'Adobe'
            ].map((company, index) => (
              <div key={index} className="text-lg font-semibold hover:text-appforge-blue transition-colors cursor-default">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
