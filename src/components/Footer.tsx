import React from "react";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Footer = () => (
  <footer className="relative bg-gradient-to-b from-card/70 to-card-dark border-t border-white/10 overflow-hidden">
    {/* Decorative Background Animation (subtle, brand-color themed) */}
    <div className="absolute inset-0 pointer-events-none animate-footer-glow opacity-30 z-0" />
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 md:py-20">
      <div className="grid md:grid-cols-5 gap-10 text-base">
        {/* Brand & CTA */}
        <div className="space-y-7 col-span-2">
          <Logo showTagline linkTo="/" />
          <p className="text-muted-foreground leading-relaxed max-w-sm">
            AI-powered career tools to land your next job, faster. Trusted by thousands. Join us!
          </p>
          {/* Email Signup */}
          <form className="flex max-w-xs rounded-lg overflow-hidden border border-white/15 focus-within:ring-2 ring-appforge-blue bg-card-dark">
            <input
              type="email"
              placeholder="Subscribe for updates"
              className="flex-1 p-2 bg-transparent text-white outline-none"
              aria-label="Email address"
            />
            <button className="p-2 bg-appforge-blue hover:bg-appforge-blue-dark transition-colors">
              Subscribe
            </button>
          </form>
          {/* Social Links */}
          <div className="flex gap-4 mt-2">
            <a aria-label="Twitter" href="#"><Twitter className="footer-icon" /></a>
            <a aria-label="LinkedIn" href="#"><Linkedin className="footer-icon" /></a>
            <a aria-label="GitHub" href="#"><Github className="footer-icon" /></a>
            <a aria-label="Mail" href="#"><Mail className="footer-icon" /></a>
          </div>
        </div>

        {/* Mega Footer Navigation */}
        <div>
          <h4 className="footer-section">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="footer-link">ATS Checker</a></li>
            <li><a href="#" className="footer-link">Resume Tailor</a></li>
            <li><a href="#" className="footer-link">Cover Letters</a></li>
            <li><a href="#" className="footer-link">Job Finder</a></li>
            <li><a href="#" className="footer-link">Templates</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-section">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="footer-link">About Us</a></li>
            <li><a href="#" className="footer-link">Blog</a></li>
            <li><a href="#" className="footer-link">Careers</a></li>
            <li><a href="#" className="footer-link">Contact</a></li>
            <li><a href="#" className="footer-link">Press Kit</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-section">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="footer-link">Help Center</a></li>
            <li><a href="#" className="footer-link">Community</a></li>
            <li><a href="#" className="footer-link">Tutorials</a></li>
            <li><a href="#" className="footer-link">API Docs</a></li>
            <li><a href="#" className="footer-link">Status</a></li>
          </ul>
        </div>
      </div>
      {/* Divider */}
      <div className="my-8 border-t border-white/10" />

      {/* Brand Message & Utility Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div>
          © 2025 ApplyForge. <span className="text-appforge-blue font-semibold">Empower your job search.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Cookie Policy</a>
        </div>
      </div>
    </div>
    {/* Sticky "Back to Top" button */}
    <button className="fixed bottom-6 right-6 bg-appforge-blue p-2 rounded-full shadow-lg hover:scale-105 transition" aria-label="Back to top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
      ↑
    </button>
  </footer>
);

export default Footer;
