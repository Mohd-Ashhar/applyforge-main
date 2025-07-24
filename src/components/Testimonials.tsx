import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    content:
      "AppForge helped me land my dream job at Google! The ATS checker showed exactly what recruiters were looking for, and the tailored resume got me 5x more interviews.",
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
      "I was struggling with ATS systems until I found AppForge. My resume went from 2% to 89% ATS compatibility. Got hired within 2 weeks!",
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
      "As someone changing careers, AppForge made it easy to highlight transferable skills. The AI understood exactly how to position my experience.",
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
];

const trustedCompanies = [
  "Google",
  "Microsoft",
  "Meta",
  "Amazon",
  "Apple",
  "Netflix",
  "Uber",
  "Airbnb",
  "Spotify",
  "Adobe",
];

// Animation variants
const fadeStagger = {
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.7 } },
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 bg-background">
      {/* Soft background glows for premium feel */}
      <span className="pointer-events-none absolute left-[-80px] top-10 w-96 h-72 bg-blue-600/15 rounded-full blur-3xl" />
      <span className="pointer-events-none absolute right-[-50px] bottom-0 w-80 h-44 bg-purple-800/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-5 sm:px-10 relative z-10">
        {/* Section Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-appforge-blue bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Job Seekers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how AppForge has helped professionals land their dream jobs at
            top companies
          </p>
        </motion.header>

        {/* Responsive: grid on desktop, swipeable on mobile */}
        <motion.div
          className="relative"
          variants={fadeStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          {/* Horizontal scroll on mobile */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto scroll-snap-x snap-mandatory flex gap-5 pb-3 scrollbar-thin scrollbar-thumb-appforge-blue/60 scrollbar-thumb-rounded">
            {testimonials.map((item, idx) => (
              <motion.div
                key={item.name}
                variants={cardVariants}
                className="snap-start flex-shrink-0 w-[320px] transition-shadow duration-200 hover:shadow-xl"
              >
                <Card className="h-full glass bg-background/70 backdrop-blur border border-white/10 rounded-2xl group px-5 pt-6 pb-4 flex flex-col min-h-[320px]">
                  <Quote className="w-8 h-8 text-appforge-blue/40 mb-4" />
                  <div className="flex items-center mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-5">
                    "{item.content}"
                  </p>
                  <div className="flex items-center mt-auto space-x-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-background"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.role} at {item.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {testimonials.map((item, idx) => (
              <motion.div key={item.name} variants={cardVariants}>
                <Card className="glass bg-background/70 backdrop-blur border border-white/10 rounded-2xl group px-7 pt-7 pb-5 flex flex-col min-h-[320px] hover:shadow-lg transition-shadow duration-200">
                  <Quote className="w-8 h-8 text-appforge-blue/40 mb-4" />
                  <div className="flex items-center mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-5">
                    "{item.content}"
                  </p>
                  <div className="flex items-center mt-auto space-x-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-background"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.role} at {item.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
              Trusted by Professionals at
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-80">
            {trustedCompanies.map((company, idx) => (
              <span
                key={company}
                className="text-lg font-medium sm:text-xl tracking-wide px-2 py-1 rounded transition-colors cursor-default hover:text-appforge-blue/90 duration-150 select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
