// src/components/CoverLetterTemplateViewer.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Palette, CheckCircle } from "lucide-react";
import { coverLetterTemplates } from "@/lib/coverLetterTemplates"; // Note: Importing cover letter templates

// Theming to match the Cover Letter Agent
const AGENT_THEME = {
  icon: "text-purple-400",
  borderSelected: "border-purple-400",
  bgSelected: "bg-purple-500/10",
  button:
    "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
};

interface CoverLetterTemplateViewerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
}

const CoverLetterTemplateViewer: React.FC<CoverLetterTemplateViewerProps> = ({
  isOpen,
  onOpenChange,
  currentTemplateId,
  onTemplateSelect,
}) => {
  const [previewTemplateId, setPreviewTemplateId] = useState(currentTemplateId);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleManualSelection = (templateId: string) => {
    stopAutoSlide();
    setPreviewTemplateId(templateId);
  };

  useEffect(() => {
    if (isOpen) {
      setPreviewTemplateId(currentTemplateId);

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        intervalRef.current = setInterval(() => {
          setPreviewTemplateId((currentId) => {
            const currentIndex = coverLetterTemplates.findIndex(
              (t) => t.id === currentId
            );
            const nextIndex = (currentIndex + 1) % coverLetterTemplates.length;
            return coverLetterTemplates[nextIndex].id;
          });
        }, 3000);
      }
    } else {
      stopAutoSlide();
    }

    return () => stopAutoSlide();
  }, [isOpen, currentTemplateId]);

  const handleConfirmSelection = () => {
    onTemplateSelect(previewTemplateId);
    onOpenChange(false);
  };

  const selectedTemplateDetails = coverLetterTemplates.find(
    (t) => t.id === previewTemplateId
  );

  const TemplateSelectorItem = ({
    template,
  }: {
    template: (typeof coverLetterTemplates)[0];
  }) => (
    <motion.div
      key={template.id}
      onMouseEnter={() => handleManualSelection(template.id)}
      onClick={() => handleManualSelection(template.id)}
      className={`relative p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0 md:w-full
        ${
          previewTemplateId === template.id
            ? `${AGENT_THEME.borderSelected} ${AGENT_THEME.bgSelected}`
            : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
        }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {previewTemplateId === template.id && (
        <CheckCircle
          className={`absolute top-2 right-2 w-5 h-5 ${AGENT_THEME.icon} bg-slate-900 rounded-full`}
        />
      )}
      <h3 className="font-semibold text-white">{template.name}</h3>
      <p className="text-xs text-slate-400 mt-1">{template.description}</p>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[90vw] h-[85vh] bg-slate-900/80 backdrop-blur-xl border-slate-700 text-white flex flex-col p-0">
        <DialogHeader className="p-4 md:p-6 pb-4 border-b border-slate-700">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className={`w-6 h-6 ${AGENT_THEME.icon}`} />
            Select a Cover Letter Template
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Hover or click to preview, then confirm your choice.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 overflow-hidden">
          <div
            className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto md:pr-3 pb-3 md:pb-0 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
            onTouchStart={stopAutoSlide}
          >
            {coverLetterTemplates.map((template) => (
              <div key={template.id} className="w-48 md:w-full flex-shrink-0">
                <TemplateSelectorItem template={template} />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-lg p-2 md:p-4 flex items-center justify-center border border-slate-700 min-h-0">
            {selectedTemplateDetails && (
              <div className="w-full h-full flex items-center justify-center">
                <motion.img
                  key={selectedTemplateDetails.imageSrc}
                  src={selectedTemplateDetails.imageSrc}
                  alt={`${selectedTemplateDetails.name} preview`}
                  className="max-w-full max-h-full object-contain rounded-md"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 md:p-6 pt-4 border-t border-slate-700 bg-slate-900/50 mt-auto">
          <Button
            onClick={handleConfirmSelection}
            className={`w-full sm:w-auto text-white font-semibold ${AGENT_THEME.button}`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterTemplateViewer;
