// src/lib/coverLetterTemplates.ts

export interface CoverLetterTemplate {
  id: string; // A unique identifier, like the filename
  name: string; // The display-friendly name
  description: string;
  imageSrc: string;
}

// This is the single source of truth for your cover letter templates
export const coverLetterTemplates: CoverLetterTemplate[] = [
  {
    id: "minimalistic-magistic",
    name: "Minimalistic Magistic",
    description: "A clean, modern design focusing purely on content.",
    imageSrc: "/coverLetterTemplates/minimalisticMagistic.png",
  },
  {
    id: "header-bar",
    name: "Header Bar",
    description: "A professional look with a colored header for contact info.",
    imageSrc: "/coverLetterTemplates/headerBar.png",
  },
  {
    id: "asym-magic",
    name: "Asymmetrical Magic",
    description: "A creative, asymmetrical layout that stands out.",
    imageSrc: "/coverLetterTemplates/asymMagic.png",
  },
  {
    id: "framed-professional",
    name: "Framed Professional",
    description: "An elegant, framed design for a classic touch.",
    imageSrc: "/coverLetterTemplates/framedProfessional.png",
  },
  {
    id: "innovators-edge",
    name: "Innovator's Edge",
    description: "A sharp, modern template for forward-thinking roles.",
    imageSrc: "/coverLetterTemplates/innovatorsEdge.png",
  },
];