import React, { memo, useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote, Bot, Activity } from "lucide-react";
import { motion, Variants } from "framer-motion";

// **ENHANCED: Agent-focused testimonials with realistic agent language**
const TESTIMONIALS = [
  {
    name: "Siddharth Sharma",
    role: "Frontend Developer",
    company: "BuildSpace",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "ApplyForge's AI agents completely transformed my job hunt. The ATS screening agent showed my resume was only 12% compatible - after my optimization agent worked on it, it jumped to 94%. Got 3 interviews within a week!",
    rating: 5,
    agentUsed: "ATS Screening Agent",
  },
  {
    name: "Maya Patel",
    role: "UX Designer",
    company: "Freelancer",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "As a freelancer switching to full-time, my cover letter crafting agent was incredible. It analyzed each job posting and created personalized letters that actually mentioned the company's recent projects. My agents work smarter than I do!",
    rating: 5,
    agentUsed: "Cover Letter Crafting Agent",
  },
  {
    name: "Jordan Kim",
    role: "Data Analyst",
    company: "TechFlow Solutions",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "The resume optimization agent is insane! It found industry terms I didn't even know were important. My resume now passes through ATS systems that used to reject me instantly. The agents learn from each job description autonomously.",
    rating: 5,
    agentUsed: "Resume Optimization Agent",
  },
  {
    name: "Peter Rezz",
    role: "Marketing Specialist",
    company: "GrowthHack Labs",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "I was skeptical about AI agents, but ApplyForge's resume optimization agent actually understands context. It repositioned my retail experience to highlight transferable skills for tech roles. My personal agent workforce is spot-on!",
    rating: 5,
    agentUsed: "Resume Optimization Agent",
  },
  {
    name: "Haris Aly",
    role: "Software Engineer",
    company: "InnovateTech",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "My instant tailoring agent saved me hours. Instead of manually editing my resume for each application, my agents do it in seconds while keeping my core achievements intact. It's like having a 24/7 career assistant!",
    rating: 5,
    agentUsed: "Instant Tailoring Agent",
  },
  {
    name: "Priya Shah",
    role: "Product Manager",
    company: "StartupXYZ",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    content:
      "Coming from a non-tech background, I needed help translating my skills. ApplyForge's agent workforce understood exactly how to frame my project management experience for product roles. Having personal AI agents is phenomenal!",
    rating: 5,
    agentUsed: "Job Discovery Agent",
  },
] as const;

type Testimonial = (typeof TESTIMONIALS)[number];

// **ENHANCED: More startup/tech focused for agent credibility**
const TRUSTED_COMPANIES = [
  "BuildSpace",
  "TechFlow Solutions",
  "GrowthHack Labs",
  "InnovateTech",
  "StartupXYZ",
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Star Rating Component
const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center mb-4">
    {[...Array(rating)].map((_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
    ))}
  </div>
));
StarRating.displayName = "StarRating";

// **Enhanced Agent-focused Testimonial Card**
const TestimonialCard = memo(
  ({
    testimonial,
    isMobile = false,
  }: {
    testimonial: Testimonial;
    isMobile?: boolean;
  }) => (
    <motion.div
      variants={cardVariants}
      className={`group ${isMobile ? "w-[85vw] max-w-sm shrink-0" : ""}`}
      whileHover={
        !isMobile
          ? {
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
          : undefined
      }
    >
      <Card className="h-full bg-background/85 backdrop-blur border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/30 transition-all duration-300">
        {/* **NEW: Agent Used Badge** */}
        <div className="flex items-center justify-between mb-3">
          <Quote className="w-6 h-6 text-blue-400/60 shrink-0" />
          <div className="flex items-center gap-1 bg-blue-600/20 border border-blue-400/30 rounded-full px-2 py-1">
            <Bot className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">
              {testimonial.agentUsed}
            </span>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={testimonial.rating} />

        {/* Content */}
        <blockquote className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base flex-1 line-clamp-4">
          "{testimonial.content}"
        </blockquote>

        {/* Author */}
        <footer className="flex items-center gap-3 mt-auto pt-2 border-t border-white/5">
          <img
            src={testimonial.avatar}
            alt={`${testimonial.name} profile picture`}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/10 shadow-sm"
            loading="lazy"
          />
          <div className="min-w-0">
            <cite className="font-semibold text-white text-sm md:text-base not-italic block">
              {testimonial.name}
            </cite>
            <p className="text-xs md:text-sm text-muted-foreground">
              {testimonial.role} at{" "}
              <span className="text-blue-400">{testimonial.company}</span>
            </p>
          </div>
        </footer>
      </Card>
    </motion.div>
  )
);
TestimonialCard.displayName = "TestimonialCard";

// Mobile Carousel (unchanged functionality, just updated for agent context)
const MobileCarousel = memo(
  ({ testimonials }: { testimonials: readonly Testimonial[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const maxScroll = scrollWidth - clientWidth;
          const cardWidth = window.innerWidth * 0.85 + 16;

          if (scrollLeft >= maxScroll - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
            setCurrentIndex(0);
          } else {
            const nextScroll = scrollLeft + cardWidth;
            scrollRef.current.scrollTo({
              left: nextScroll,
              behavior: "smooth",
            });
            setCurrentIndex(
              Math.min(
                testimonials.length - 1,
                Math.round(nextScroll / cardWidth)
              )
            );
          }
        }
      }, 5000);

      return () => clearInterval(interval);
    }, [testimonials.length]);

    const handleScroll = () => {
      if (scrollRef.current) {
        const cardWidth = window.innerWidth * 0.85 + 16;
        const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
        setCurrentIndex(newIndex);
      }
    };

    return (
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="snap-start">
              <TestimonialCard testimonial={testimonial} isMobile={true} />
            </div>
          ))}
        </div>
      </div>
    );
  }
);
MobileCarousel.displayName = "MobileCarousel";

// **Enhanced Trust Badges - Agent-focused companies**
const TrustBadges = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
    className="mt-16 md:mt-20"
  >
    <div className="text-center mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
        Trusted by Early Adopters at
      </h3>
      <p className="text-sm text-muted-foreground">
        Join innovative professionals using AI agents to transform their careers
      </p>
    </div>

    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
      {TRUSTED_COMPANIES.map((company, index) => (
        <motion.div
          key={company}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="text-center px-4 py-3 rounded-lg bg-background/30 border border-white/5 hover:border-blue-400/30 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-blue-500/10">
            <span className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-blue-400/90 transition-colors cursor-default whitespace-nowrap">
              {company}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
));
TrustBadges.displayName = "TrustBadges";


const Testimonials = memo(() => {
  const testimonialsList = useMemo(() => TESTIMONIALS, []);

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-24 bg-gradient-to-br from-background via-slate-900/40 to-background overflow-hidden"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-10 w-96 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute right-[-50px] bottom-0 w-80 h-44 bg-purple-600/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* **ENHANCED: Agent-oriented Section Header** */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
              AI-Driven Job Seekers
            </span>{" "}
            Worldwide
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            See how our advanced AI technology is helping professionals land
            their dream jobs faster than ever.
          </p>

          {/* **ENHANCED: Agent-focused trust tagline** */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-sm font-medium">
              <Bot className="w-4 h-4" />
              Real stories. Real results. Powered by AI.
            </span>
          </motion.div>
        </motion.header>


        {/* Testimonials Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Mobile: Clean Carousel */}
          <div className="block md:hidden">
            <MobileCarousel testimonials={testimonialsList} />
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonialsList.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <TrustBadges />
      </div>
    </section>
  );
});

Testimonials.displayName = "Testimonials";
export default Testimonials;
