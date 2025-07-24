import React from "react";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo showTagline={true} linkTo="/" />
            <p className="text-muted-foreground">
              AI-powered tools that help job seekers land more interviews and
              get hired faster.
            </p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-appforge-blue cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-appforge-blue cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-muted-foreground hover:text-appforge-blue cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-muted-foreground hover:text-appforge-blue cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                ATS Checker
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Resume Tailor
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Cover Letters
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Job Finder
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Templates
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Press Kit
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Community
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Tutorials
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                API Docs
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-appforge-blue transition-colors"
              >
                Status
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © 2024 ApplyForge. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-appforge-blue transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-appforge-blue transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-appforge-blue transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
