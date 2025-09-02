import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  createRazorpaySubscription,
  createPaypalSubscription, // <-- IMPORT new PayPal function
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
    // ... (unchanged)
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

  // **NEW**: A dedicated function for the PayPal payment flow
  const processPaypalPayment = async (
    plan: SubscriptionPlan,
    currency: Currency,
    billingPeriod: BillingPeriod
  ) => {
    if (!user?.email) return;
    try {
      const response = await createPaypalSubscription({
        name: user.email.split("@")[0],
        email: user.email,
        plan,
        currency,
        billingPeriod,
      });

      if (response.approve_link) {
        // Redirect the user to PayPal to approve the subscription
        window.location.href = response.approve_link;
      } else {
        throw new Error("Could not get PayPal approval link.");
      }
    } catch (error) {
      console.error("PayPal payment initialization failed:", error);
      toast({
        title: "Payment Failed",
        description: "Failed to initialize PayPal payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // This function now contains the original Razorpay logic
  const processRazorpayPayment = async (
    plan: SubscriptionPlan,
    currency: Currency,
    billingPeriod: BillingPeriod
  ) => {
    if (!user?.email) return;
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) throw new Error("Failed to load Razorpay script");

    const subscriptionResponse = await createRazorpaySubscription({
      name: user.email.split("@")[0],
      email: user.email,
      plan,
      currency,
      billingPeriod,
    });

    const options = {
      key: subscriptionResponse.key_id,
      subscription_id: subscriptionResponse.id,
      name: "ApplyForge",
      description: `${plan} Plan Subscription`,
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
            orderId: paymentResponse.razorpay_order_id || "",
            amount: subscriptionResponse.amount,
            currency: currency,
          };
          await updateUserSubscription(subscriptionDetails);
          toast({ title: "Payment Successful!", description: `Successfully subscribed to ${plan} plan.` });
          await triggerPaymentNotification({ status: "success", email: user.email!, name: user.email!.split("@")[0], plan: subscriptionDetails.plan, amount: subscriptionDetails.amount / 100, currency: subscriptionDetails.currency, paymentId: subscriptionDetails.paymentId });
          window.location.href = "/";
        } catch (error: any) {
          console.error("Subscription update failed:", error);
          alert("Payment successful but subscription update failed. Please contact support.");
        }
      },
      modal: {
        ondismiss: async () => {
          setIsProcessing(false);
          await triggerPaymentNotification({ status: "failed", email: user.email!, name: user.email!.split("@")[0], plan, subscriptionId: subscriptionResponse.id, failureReason: "user_closed_modal" });
        },
      },
      theme: { color: "#3B82F6" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // **MODIFIED**: The main function now acts as a router
  const processPayment = async (
    plan: SubscriptionPlan,
    currency: Currency,
    billingPeriod: BillingPeriod
  ) => {
    if (!user?.email || plan === "Free") {
      return;
    }

    setIsProcessing(true);

    try {
      if (currency === "INR") {
        await processRazorpayPayment(plan, currency, billingPeriod);
      } else if (currency === "USD") {
        await processPaypalPayment(plan, currency, billingPeriod);
      } else {
        throw new Error(`Unsupported currency: ${currency}`);
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      toast({ title: "Payment Failed", description: "Failed to initialize payment. Please try again.", variant: "destructive" });
      await triggerPaymentNotification({ status: "failed", email: user.email!, name: user.email!.split("@")[0], plan, failureReason: error.message || "initialization_failed" });
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
  };
};