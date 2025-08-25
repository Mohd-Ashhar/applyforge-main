// In usePayment.ts

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  createRazorpayOrder,
  updateUserSubscription,
  triggerPaymentNotification, 
  SubscriptionPlan,
  Currency,
  BillingPeriod,
  RazorpayPaymentResponse,
} from "@/services/paymentService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    // ... (this function is unchanged)
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const processPayment = async (
    plan: SubscriptionPlan,
    currency: Currency,
    billingPeriod: BillingPeriod
  ) => {
    if (!user?.email) {
      // ... (unchanged)
      return;
    }
    if (plan === "Free") {
      return;
    }

    try {
      setIsProcessing(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Failed to load Razorpay script");

      const orderResponse = await createRazorpayOrder({
        name: user.email.split("@")[0],
        email: user.email,
        plan,
        currency,
        billingPeriod,
      });

      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "ApplyForge",
        description: `${plan} Plan Subscription`,
        order_id: orderResponse.order_id,
        prefill: {
          name: user.email.split("@")[0],
          email: user.email,
        },
        handler: async (paymentResponse: RazorpayPaymentResponse) => {
          try {
            const subscriptionDetails = {
              plan,
              billingPeriod,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              amount: orderResponse.amount,
              currency: orderResponse.currency,
            };

            await updateUserSubscription(subscriptionDetails);

            toast({
              title: "Payment Successful!",
              description: `Successfully subscribed to ${plan} plan.`,
            });

            // **SUCCESS TRIGGER**
            // Trigger the n8n webhook for a successful payment
            await triggerPaymentNotification({
              status: "success",
              email: user.email!,
              name: user.email!.split("@")[0],
              plan: subscriptionDetails.plan,
              amount: subscriptionDetails.amount / 100, // Convert to main currency unit
              currency: subscriptionDetails.currency,
              paymentId: subscriptionDetails.paymentId,
            });

            window.location.href = "/thank-you";
          } catch (error: any) {
            console.error("Subscription update failed:", error);
            alert(
              "Payment successful but subscription update failed. Please contact support."
            );
          }
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false);
            // **FAILURE TRIGGER**
            // The user closed the modal without paying.
            await triggerPaymentNotification({
              status: "failed",
              email: user.email!,
              name: user.email!.split("@")[0],
              plan: plan,
              orderId: orderResponse.order_id,
              failureReason: "user_closed_modal",
            });
          },
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      toast({
        title: "Payment Failed",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });

      // **FAILURE TRIGGER (for initialization errors)**
      await triggerPaymentNotification({
        status: "failed",
        email: user.email!,
        name: user.email!.split("@")[0],
        plan: plan,
        failureReason: error.message || "initialization_failed",
      });

      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
  };
};
