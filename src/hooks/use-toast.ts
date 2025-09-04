import * as React from "react";
import { toast as sonnerToast } from "@/components/ui/sonner";

// Define the shape of the toast object that your components are used to sending.
type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: React.ReactElement;
  duration?: number;
};

// 1. Create a new `toast` function with the same signature as the old one.
function toast({ title, description, variant, action, duration }: ToastProps) {
  // 2. Map the old `variant` to the new Sonner functions.
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
      action,
      duration,
      
    });
  } else {
    // Default variant can map to a standard or success toast in Sonner.
    // Using the generic sonnerToast() function is a good default.
    sonnerToast(title, {
      description,
      action,
      duration,
    });
  }
}

// 3. Re-create the `useToast` hook to return our new adapter functions.
function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  };
}

// 4. Export the hook and the function. The contract is the same, so no other files need to change.
export { useToast, toast };