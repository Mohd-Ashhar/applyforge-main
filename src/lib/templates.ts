// src/lib/templates.ts

export interface ResumeTemplate {
  id: string; // A unique identifier, like the filename
  name: string; // The display-friendly name
  description: string;
  imageSrc: string;
}

// This is now the single source of truth for your templates.
export const templates: ResumeTemplate[] = [
  {
    id: "skyline-professional",
    name: "Skyline Professional",
    description: "A sharp, corporate design for executive roles.",
    imageSrc: "/templates/skyline-professional.png",
  },
  {
    id: "quantum-tech",
    name: "Quantum Tech",
    description: "A modern, tech-focused layout with a sidebar.",
    imageSrc: "/templates/quantum-tech.png",
  },
  {
    id: "grety-skyler",
    name: "Grety Skyler",
    description: "A clean and minimalist template with a touch of color.",
    imageSrc: "/templates/grety-skyler.png",
  },
  {
    id: "analysts-ledger",
    name: "Analyst's Ledger",
    description: "A structured format for analytical and financial roles.",
    imageSrc: "/templates/analysts-ledger.png",
  },
  {
    id: "creators-canvas",
    name: "Creator's Canvas",
    description: "A visually appealing layout for creative professionals.",
    imageSrc: "/templates/creators-canvas.png",
  },
];
