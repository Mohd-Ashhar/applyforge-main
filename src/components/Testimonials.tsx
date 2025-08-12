import React, { memo, useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
// FIX 1: Import the `Variants` type from framer-motion
import { motion, Variants } from "framer-motion";

// **ENHANCED: AI-Driven testimonials with realistic companies**
const TESTIMONIALS = [
  {
    name: "Siddharth Sharma",
    role: "Frontend Developer",
    company: "BuildSpace",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "ApplyForge's AI completely transformed my job hunt. The ATS scanner showed my resume was only 12% compatible - after the AI optimization, it jumped to 94%. Got 3 interviews within a week!",
    rating: 5,
  },
  {
    name: "Maya Patel",
    role: "UX Designer",
    company: "Freelancer",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "As a freelancer switching to full-time, the AI cover letter generator was incredible. It analyzed each job posting and created personalized letters that actually mentioned the company's recent projects. Smart AI!",
    rating: 5,
  },
  {
    name: "Jordan Kim",
    role: "Data Analyst",
    company: "TechFlow Solutions",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "The AI keyword optimization is insane! It found industry terms I didn't even know were important. My resume now passes through ATS systems that used to reject me instantly. The AI learns from each job description.",
    rating: 5,
  },
  {
    name: "Peter Rezz",
    role: "Marketing Specialist",
    company: "GrowthHack Labs",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "I was skeptical about AI tools, but ApplyForge's resume tailor actually understands context. It repositioned my retail experience to highlight transferable skills for tech roles. The AI suggestions were spot-on!",
    rating: 5,
  },
  {
    name: "Haris Aly",
    role: "Software Engineer",
    company: "InnovateTech",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop&crop=face",
    content:
      "The one-click AI tailoring saved me hours. Instead of manually editing my resume for each application, the AI does it in seconds while keeping my core achievements intact. Smart technology!",
    rating: 5,
  },
  {
    name: "Priya Shah",
    role: "Product Manager",
    company: "StartupXYZ",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    content:
      "Coming from a non-tech background, I needed help translating my skills. ApplyForge's AI understood exactly how to frame my project management experience for product roles. The AI coaching is phenomenal!",
    rating: 5,
  },
] as const;

// FIX 2: Create an explicit `Testimonial` type from the `as const` object.
type Testimonial = (typeof TESTIMONIALS)[number];

// **REALISTIC: Early-adopter companies for a launching SaaS**
const TRUSTED_COMPANIES = [
  "BuildSpace",
  "TechFlow Solutions",
  "GrowthHack Labs",
  "InnovateTech",
  "StartupXYZ",
] as const;

// FIX 1: Apply the `Variants` type to the animation objects.
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

// Enhanced Testimonial Card
// FIX 2: Use the new `Testimonial` type in the component props.
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
// FIX 2: Use the `Testimonial` type for the carousel's props.
const MobileCarousel = memo(
  ({ testimonials }: { testimonials: readonly Testimonial[] }) => {
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

// **Enhanced Trust Badges - Startup-focused companies**
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
        Join innovative professionals using AI to transform their careers
      </p>
    </div>

    {/* **Single row layout for 5 companies - looks more balanced** */}
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
        {/* **ENHANCED: Section Header with AI emphasis** */}
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

          {/* **NEW: Trust-boosting tagline** */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-sm font-medium">
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
