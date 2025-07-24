import React from "react";
import { Card } from "@/components/ui/card";
import { Upload, Wand2, Download, Send } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Upload Your Resume",
    description:
      "Upload your existing resume or create one using our templates. We support all major formats.",
    step: "01",
    iconBg: "from-blue-500 to-blue-400",
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "Paste Job Description",
    description:
      "Copy and paste the job description you want to apply for. Our AI analyzes the requirements.",
    step: "02",
    iconBg: "from-indigo-600 to-blue-400",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Get Tailored Resume",
    description:
      "Receive your optimized resume with improved ATS score and relevant keywords highlighted.",
    step: "03",
    iconBg: "from-green-500 to-blue-400",
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: "Apply with Confidence",
    description:
      "Download your tailored resume and cover letter, then apply knowing you have the best chance.",
    step: "04",
    iconBg: "from-purple-400 to-blue-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 relative bg-gradient-to-br from-background via-slate-900/70 to-blue-950/90">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-60px] top-[18%] w-36 h-36 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-44 h-28 bg-blue-800/20 rounded-2xl blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            How{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
              ApplyForge
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get from resume upload to job application in just 4 simple steps
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative mb-16">
          {/* Connection Lines */}
          <div className="absolute top-[120px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="bg-background/70 backdrop-blur border border-white/10 rounded-2xl p-6 text-center h-full hover:shadow-lg transition-shadow">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-appforge-blue text-black rounded-full flex items-center justify-center font-bold text-sm border-2 border-white/30">
                      {step.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mx-auto mb-4 mt-2 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center text-white`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mb-16">
          <p className="text-center text-muted-foreground text-sm mb-6">
            ← Swipe to see all steps →
          </p>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="w-72 flex-shrink-0"
                >
                  <Card className="bg-background/70 backdrop-blur border border-white/10 rounded-2xl p-5 text-center h-80 flex flex-col">
                    {/* Step Number */}
                    <div className="relative mb-4">
                      <div className="w-8 h-8 bg-appforge-blue text-black rounded-full flex items-center justify-center font-bold text-sm mx-auto border-2 border-white/30">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center text-white`}
                    >
                      {step.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-bold mb-3 text-white leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-blue-400/40"
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-background/80 backdrop-blur border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Ready to Transform Your Job Search?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful job seekers who've landed their dream
              jobs with{" "}
              <span className="font-bold text-appforge-blue">ApplyForge</span>
            </p>
            <button className="bg-appforge-blue hover:bg-appforge-blue/80 text-black font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-blue-400/30 transition-all duration-200">
              Start Your Free Trial
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Hide Scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
