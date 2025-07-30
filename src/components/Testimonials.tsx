import React, { memo, useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    content:
      "ApplyForge helped me land my dream job at Google! The ATS checker showed exactly what recruiters were looking for, and the tailored resume got me 5x more interviews.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Product Manager",
    company: "Microsoft",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    content:
      "The cover letter generator is incredible. It created personalized letters that perfectly matched each job I applied for. Saved me hours and increased my response rate.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "Meta",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    content:
      "I was struggling with ATS systems until I found ApplyForge. My resume went from 2% to 89% ATS compatibility. Got hired within 2 weeks!",
    rating: 5,
  },
  {
    name: "Michael Kim",
    role: "UX Designer",
    company: "Figma",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    content:
      "The job finder feature is a game-changer. It not only found relevant positions but also let me tailor my resume for each application with one click.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Marketing Manager",
    company: "Shopify",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    content:
      "As someone changing careers, ApplyForge made it easy to highlight transferable skills. The AI understood exactly how to position my experience.",
    rating: 5,
  },
  {
    name: "David Johnson",
    role: "DevOps Engineer",
    company: "Amazon",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    content:
      "The Pro plan paid for itself after my first job switch. The salary increase from landing a better position was 10x the subscription cost.",
    rating: 5,
  },
] as const;

// **Reduced to 5 companies - more realistic for a new SaaS**
const TRUSTED_COMPANIES = [
  "Google",
  "Microsoft",
  "Shopify",
  "Figma",
  "Amazon",
] as const;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
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

// Enhanced Testimonial Card
const TestimonialCard = memo(
  ({
    testimonial,
    isMobile = false,
  }: {
    testimonial: (typeof TESTIMONIALS)[0];
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
        {/* Quote Icon */}
        <Quote className="w-6 h-6 text-blue-400/60 mb-3 shrink-0" />

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

// **Clean Mobile Carousel - NO BLUE DOTS**
const MobileCarousel = memo(
  ({ testimonials }: { testimonials: typeof TESTIMONIALS }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll functionality
    useEffect(() => {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const maxScroll = scrollWidth - clientWidth;
          const cardWidth = window.innerWidth * 0.85 + 16; // 85vw + gap

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
        {/* **REMOVED: Blue cylindrical dots section completely** */}

        {/* Clean Scrollable Container */}
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

// **Enhanced Trust Badges - Fewer Companies, Better Layout**
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
        Trusted by Professionals at
      </h3>
    </div>

    {/* **Single row layout for 5 companies - looks more balanced** */}
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
      {TRUSTED_COMPANIES.map((company) => (
        <div
          key={company}
          className="text-center px-4 py-3 rounded-lg bg-background/30 border border-white/5 hover:border-white/10 transition-all duration-300"
        >
          <span className="text-sm md:text-base font-medium text-muted-foreground hover:text-blue-400/90 transition-colors cursor-default whitespace-nowrap">
            {company}
          </span>
        </div>
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
        {/* Section Header */}
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
              10,000+
            </span>{" "}
            Job Seekers
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            See how ApplyForge has helped professionals land their dream jobs at
            top companies
          </p>
        </motion.header>

        {/* Testimonials Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Mobile: Clean Carousel (No Blue Dots) */}
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
