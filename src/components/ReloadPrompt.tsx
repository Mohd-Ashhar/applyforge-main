import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    toast.info('A new version is available!', {
      position: 'bottom-center',
      duration: Infinity,
      action: {
        label: 'Reload',
        onClick: () => {
          updateServiceWorker(true);
        },
      },
    });
  }

  // The Toaster component was here. It has been removed.
  return null;
}

export default ReloadPrompt;