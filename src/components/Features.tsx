import React from "react";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Target,
  Mail,
  Search,
  Zap,
  Bot,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Target className="w-7 h-7" />,
    iconBg: "from-blue-600/90 to-blue-400/70",
    title: "ATS Resume Checker",
    description:
      "Upload your resume and job description to get an instant ATS compatibility score with detailed improvement suggestions.",
    benefits: [
      "Match Score Analysis",
      "Missing Keywords Detection",
      "Formatting Tips",
    ],
    clickable: true,
    path: "/ats-checker",
    implemented: true,
  },
  {
    icon: <FileText className="w-7 h-7" />,
    iconBg: "from-blue-500/90 to-indigo-400/70",
    title: "AI Resume Tailor",
    description:
      "Automatically customize your resume for each job application using advanced AI that understands job requirements.",
    benefits: [
      "Smart Keyword Optimization",
      "Role-Specific Tailoring",
      "Instant Downloads",
    ],
    clickable: true,
    path: "/ai-resume-tailor",
    implemented: true,
  },
  {
    icon: <Mail className="w-7 h-7" />,
    iconBg: "from-fuchsia-600/80 to-blue-400/50",
    title: "Cover Letter Generator",
    description:
      "Generate personalized, compelling cover letters that perfectly match your resume and target job position.",
    benefits: [
      "Personalized Content",
      "Multiple Tone Options",
      "Professional Templates",
    ],
    clickable: true,
    path: "/cover-letter-generator",
    implemented: true,
  },
  {
    icon: <Search className="w-7 h-7" />,
    iconBg: "from-emerald-500/90 to-cyan-400/70",
    title: "Smart Job Finder",
    description:
      "Discover relevant job opportunities with advanced filtering and one-click resume tailoring for each position.",
    benefits: [
      "Intelligent Matching",
      "Real-time Updates",
      "Save & Track Jobs",
    ],
    clickable: true,
    path: "/job-finder",
    implemented: true,
  },
  {
    icon: <Zap className="w-7 h-7" />,
    iconBg: "from-yellow-400/80 to-orange-500/60",
    title: "One-Click Tailoring",
    description:
      "Tailor your resume directly from job listings with a single click. No more manual copying and pasting.",
    benefits: ["Instant Processing", "Seamless Integration", "Time Saving"],
    clickable: true,
    path: "/one-click-tailoring",
    implemented: true,
  },
  {
    icon: <Bot className="w-7 h-7" />,
    iconBg: "from-purple-500/90 to-indigo-600/60",
    title: "Auto-Apply Agent",
    description:
      "Coming soon: Browser automation that applies to your saved jobs automatically while you sleep.",
    benefits: ["24/7 Applications", "Smart Filtering", "Application Tracking"],
    comingSoon: true,
    clickable: true,
    implemented: false,
  },
];

// Animation variants
const fadeStagger = {
  show: {
    transition: { staggerChildren: 0.115 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stats = [
  {
    value: "95%",
    label: "ATS Pass Rate",
    from: "from-green-400",
    to: "to-green-500",
    shadow: "shadow-green-500/20",
  },
  {
    value: "3x",
    label: "More Interviews",
    from: "from-blue-400",
    to: "to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    value: "10min",
    label: "Avg Setup Time",
    from: "from-purple-400",
    to: "to-pink-500",
    shadow: "shadow-purple-500/20",
  },
];

const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFeatureClick = (path?: string, implemented = false) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!implemented) {
      toast({
        title: "Coming Soon",
        description:
          "This feature is currently under development and will be available soon!",
      });
      return;
    }
    if (path) navigate(path);
  };

  return (
    <section
      id="features"
      className="relative py-24 bg-gradient-to-br from-background via-slate-900/60 to-background"
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-[8vw] w-52 h-52 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute right-[10vw] bottom-[7vw] w-60 h-44 bg-purple-500/10 rounded-3xl blur-3xl" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          viewport={{ once: true }}
          className="text-center max-w-screen-sm mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight tracking-tight">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Job Success
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mx-auto">
            Everything you need to optimize your job search and land interviews
            faster
          </p>
        </motion.div>

        {/* Features Grid - mobile: horizontal scroll carousel + desktop grid */}
        <motion.div
          className="relative"
          variants={fadeStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
        >
          {/* Horizontal scroll on mobile */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto scroll-snap-x snap-mandatory flex gap-5 scrollbar-thin scrollbar-thumb-appforge-blue scrollbar-thumb-rounded-md">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="snap-start flex-shrink-0 w-80"
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 36px rgba(80,120,255,0.12)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                role={feature.clickable ? "button" : undefined}
                tabIndex={feature.clickable ? 0 : -1}
                onClick={() =>
                  feature.clickable &&
                  handleFeatureClick(feature.path, feature.implemented)
                }
              >
                <Card
                  className={`p-6 glass border border-white/10 rounded-2xl relative group overflow-hidden ${
                    feature.comingSoon
                      ? "ring-2 ring-purple-400/40 ring-inset"
                      : "hover:border-blue-400"
                  }`}
                >
                  {feature.comingSoon && (
                    <motion.div
                      className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full drop-shadow-lg"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      Coming Soon
                    </motion.div>
                  )}
                  <div
                    className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${feature.iconBg} shadow-xl text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-4 leading-snug ${
                      feature.comingSoon
                        ? "text-purple-400 group-hover:text-purple-300"
                        : "text-blue-200 group-hover:text-blue-400"
                    } transition-colors`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm font-medium text-slate-300"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 40px rgba(80, 120, 255, 0.12)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                role={feature.clickable ? "button" : undefined}
                tabIndex={feature.clickable ? 0 : -1}
                onClick={() =>
                  feature.clickable &&
                  handleFeatureClick(feature.path, feature.implemented)
                }
              >
                <Card
                  className={`p-8 glass border border-white/10 rounded-2xl relative group overflow-hidden ${
                    feature.comingSoon
                      ? "ring-2 ring-purple-400/40 ring-inset"
                      : "hover:border-blue-400"
                  }`}
                >
                  {feature.comingSoon && (
                    <motion.div
                      className="absolute top-5 right-5 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full drop-shadow"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      Coming Soon
                    </motion.div>
                  )}
                  <div
                    className={`mb-8 p-5 rounded-xl bg-gradient-to-br ${feature.iconBg} shadow-lg text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-5 leading-snug ${
                      feature.comingSoon
                        ? "text-purple-400 group-hover:text-purple-300"
                        : "text-blue-200 group-hover:text-blue-400"
                    } transition-colors`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    {feature.description}
                  </p>
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 text-base font-semibold text-slate-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-70px" }}
          className="mt-24 bg-background/80 backdrop-blur-md shadow-2xl glass border border-white/10 rounded-2xl px-7 py-10"
        >
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span
                  className={`
                    mb-2 text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${s.from} ${s.to} bg-clip-text text-transparent
                    drop-shadow-xl ${s.shadow}
                  `}
                >
                  {s.value}
                </span>
                <span className="text-muted-foreground text-base md:text-lg">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
