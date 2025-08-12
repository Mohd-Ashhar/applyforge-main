import { supabase } from "@/integrations/supabase/client";

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export type SubscriptionPlan = "Free" | "Basic" | "Pro";

export const createRazorpayOrder = async (
  name: string,
  email: string,
  plan: SubscriptionPlan
): Promise<RazorpayOrderResponse> => {
  const response = await fetch(
    "https://n8n.applyforge.cloud/webhook-test/create-razorpay-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        plan,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create Razorpay order");
  }

  return response.json();
};

export const updateUserSubscription = async (
  email: string,
  plan: SubscriptionPlan,
  paymentId?: string
) => {
  // Build the update object
  const updateData: any = { plan };

  // Add payment_id only if provided (for paid plans)
  if (paymentId) {
    updateData.payment_id = paymentId;
  }

  // Update user profile with subscription details using email
  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("email", email);

  if (error) {
    console.error("Subscription update failed:", error.message);
    throw new Error(
      "Payment successful but subscription update failed. Please contact support."
    );
  }

  // Record payment in payments table if payment was made
  if (paymentId) {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      const { error: paymentError } = await supabase
        .from("payments" as any)
        .insert({
          user_id: user.user.id,
          razorpay_payment_id: paymentId,
          razorpay_order_id: "", // We don't have order_id in this flow
          amount: plan === "Basic" ? 19900 : 49900, // Amount in paise
          plan,
          status: "completed",
        } as any);

      if (paymentError) {
        console.error("Payment record failed:", paymentError);
        // Don't throw here as subscription is already updated
      }
    }
  }
};

export const upgradeToPlan = async (
  plan: SubscriptionPlan,
  userEmail: string
) => {
  if (plan === "Free") {
    // For Free Plan - no payment required
    const { error } = await supabase
      .from("profiles")
      .update({ plan: "Free" } as any)
      .eq("email", userEmail);

    if (error) {
      console.error("Subscription update failed:", error.message);
      alert("Failed to update to Free plan. Please try again.");
    } else {
      window.location.href = "/thank-you";
    }
  } else {
    // For paid plans, this function shouldn't be called directly
    // Use the payment flow instead
    throw new Error("Paid plans require payment processing");
  }
};
