// src/components/ResumeTemplateViewer.tsx

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
import { templates } from "@/lib/templates";

interface ResumeTemplateViewerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
}

const ResumeTemplateViewer: React.FC<ResumeTemplateViewerProps> = ({
  isOpen,
  onOpenChange,
  currentTemplateId,
  onTemplateSelect,
}) => {
  const [previewTemplateId, setPreviewTemplateId] = useState(currentTemplateId);
  // --- CHANGE: Added useRef to manage the auto-slide interval ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleManualSelection = (templateId: string) => {
    stopAutoSlide(); // Stop auto-sliding when user interacts
    setPreviewTemplateId(templateId);
  };

  useEffect(() => {
    if (isOpen) {
      setPreviewTemplateId(currentTemplateId);

      // --- CHANGE: Auto-slide functionality for mobile ---
      const isMobile = window.innerWidth < 768; // Corresponds to Tailwind's 'md' breakpoint
      if (isMobile) {
        intervalRef.current = setInterval(() => {
          setPreviewTemplateId((currentId) => {
            const currentIndex = templates.findIndex((t) => t.id === currentId);
            const nextIndex = (currentIndex + 1) % templates.length;
            return templates[nextIndex].id;
          });
        }, 3000); // Change template every 3 seconds
      }
    } else {
      stopAutoSlide();
    }

    // Cleanup function to clear interval when modal is closed or component unmounts
    return () => stopAutoSlide();
  }, [isOpen, currentTemplateId]);

  const handleConfirmSelection = () => {
    onTemplateSelect(previewTemplateId);
    onOpenChange(false);
  };

  const selectedTemplateDetails = templates.find(
    (t) => t.id === previewTemplateId
  );

  const TemplateSelectorItem = ({
    template,
  }: {
    template: (typeof templates)[0];
  }) => (
    <motion.div
      key={template.id}
      onMouseEnter={() => handleManualSelection(template.id)}
      onClick={() => handleManualSelection(template.id)}
      className={`relative p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0 md:w-full
        ${
          previewTemplateId === template.id
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
        }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {previewTemplateId === template.id && (
        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-400 bg-slate-900 rounded-full" />
      )}
      <h3 className="font-semibold text-white">{template.name}</h3>
      <p className="text-xs text-slate-400 mt-1">{template.description}</p>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* --- CHANGE: Reduced modal size for desktop and mobile --- */}
      <DialogContent className="max-w-5xl w-[90vw] h-[85vh] bg-slate-900/80 backdrop-blur-xl border-slate-700 text-white flex flex-col p-0">
        <DialogHeader className="p-4 md:p-6 pb-4 border-b border-slate-700">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-6 h-6 text-blue-400" />
            Select a Resume Template
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Hover or click to preview, then confirm your choice.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 overflow-hidden">
          <div
            className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto md:pr-3 pb-3 md:pb-0 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
            // --- CHANGE: Stop auto-slide on manual scroll in mobile ---
            onTouchStart={stopAutoSlide}
          >
            {templates.map((template) => (
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
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeTemplateViewer;
