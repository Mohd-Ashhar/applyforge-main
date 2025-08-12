import React, { memo } from "react";
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Logo from "@/components/ui/Logo";

// --- CONSTANTS (Moved outside component for performance) ---

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "ATS Checker", href: "/ats-checker" },
      { label: "Resume Tailor", href: "/ai-resume-tailor" },
      { label: "Cover Letters", href: "/cover-letter-generator" },
      { label: "Job Finder", href: "/job-finder" },
      { label: "Templates", href: "/templates" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog", external: true },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Press Kit", href: "/press", external: true },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help", external: true },
      { label: "Community", href: "/community", external: true },
      { label: "Tutorials", href: "/tutorials", external: true },
      { label: "API Docs", href: "/docs", external: true },
      { label: "Status", href: "/status", external: true },
    ],
  },
];

const SOCIAL_LINKS = [
  { Icon: Twitter, href: "https://twitter.com/applyforge", label: "Twitter" },
  {
    Icon: Linkedin,
    href: "https://linkedin.com/company/applyforge",
    label: "LinkedIn",
  },
  { Icon: Github, href: "https://github.com/applyforge", label: "GitHub" },
  { Icon: Mail, href: "mailto:hello@applyforge.ai", label: "Email" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

// --- ANIMATION VARIANTS (Typed correctly) ---

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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// --- REUSABLE SUB-COMPONENTS ---

const SocialIcon = memo(
  ({
    Icon,
    href,
    label,
  }: {
    Icon: React.ElementType;
    href: string;
    label: string;
  }) => (
    <motion.a
      href={href}
      aria-label={label}
      className="group relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-blue-500/10"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 transition-colors duration-300" />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.a>
  )
);
SocialIcon.displayName = "SocialIcon";

const FooterLink = memo(
  ({
    href,
    children,
    external = false,
  }: {
    href: string;
    children: React.ReactNode;
    external?: boolean;
  }) => (
    <motion.a
      href={href}
      className="group flex items-center gap-1 text-muted-foreground hover:text-blue-400 transition-all duration-300 text-sm py-1"
      whileHover={{ x: 4 }}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
      {external && (
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.a>
  )
);
FooterLink.displayName = "FooterLink";

// --- MAIN FOOTER COMPONENT ---

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-background via-slate-900/20 to-slate-900/40 border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-0 top-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-48 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="py-16 md:py-20"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <Logo showTagline={true} linkTo="/" />
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm">
                AI-powered tools that help job seekers land more interviews and
                get hired faster. Transform your career today.
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <SocialIcon key={social.label} {...social} />
                ))}
              </div>
            </motion.div>

            {/* Link Sections */}
            {FOOTER_SECTIONS.map((section) => (
              <motion.div key={section.title} variants={itemVariants}>
                <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.links.map((link) => (
                    <FooterLink
                      key={link.label}
                      href={link.href}
                      external={link.external}
                    >
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4">
              <p className="text-muted-foreground text-sm">
                © {currentYear} ApplyForge. All rights reserved.
              </p>
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {LEGAL_LINKS.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </nav>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 md:hidden">
              <p className="text-xs text-muted-foreground text-center">
                Made with ❤️ for job seekers worldwide
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
