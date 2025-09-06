// src/components/ReloadPrompt.tsx
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (needRefresh) {
    toast.info("A new version is available!", {
      position: "bottom-center",
      duration: Infinity, // Keep it open until user interaction
      action: {
        label: "Reload",
        onClick: () => {
          updateServiceWorker(true);
        },
      },
      onDismiss: () => close(),
    });
  }

  return <Toaster richColors />;
}

export default ReloadPrompt;
