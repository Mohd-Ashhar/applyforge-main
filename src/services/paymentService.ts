import { supabase } from "@/integrations/supabase/client";

// Types
export type SubscriptionPlan = "Free" | "Basic" | "Pro";
export type Currency = "INR" | "USD";
export type BillingPeriod = "monthly" | "yearly";

export interface CreateOrderPayload {
  name: string;
  email: string;
  plan: SubscriptionPlan;
  currency: Currency;
  billingPeriod: BillingPeriod;
}

export interface RazorpaySubscriptionResponse {
  id: string;
  amount: number;
  key_id: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface SubscriptionUpdateDetails {
  plan: SubscriptionPlan;
  billingPeriod: BillingPeriod;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentNotificationPayload {
  status: "success" | "failed";
  email: string;
  name: string;
  plan?: SubscriptionPlan;
  amount?: number;
  currency?: string;
  paymentId?: string;
  subscriptionId?: string;
  failureReason?: string;
}

// Renamed to create Razorpay Subscription
export const createRazorpaySubscription = async (
  payload: CreateOrderPayload
): Promise<RazorpaySubscriptionResponse> => {
  const response = await fetch(
    "https://n8n.applyforge.cloud/webhook-test/create-razorpay-subscription",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to create Razorpay subscription:", errorData);
    throw new Error(
      "Failed to create Razorpay subscription. Please try again."
    );
  }

  return response.json();
};

export const triggerPaymentNotification = async (
  payload: PaymentNotificationPayload
) => {
  // ... (function is unchanged)
  try {
    await fetch("https://n8n.applyforge.cloud/webhook-test/payment-sucess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to trigger payment notification webhook:", error);
  }
};

/**
 * **REVISED: Calls the database function with the CORRECT parameters.**
 */
export const updateUserSubscription = async (
  details: SubscriptionUpdateDetails
) => {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser.user) {
    throw new Error("User not found for subscription update.");
  }

  // Call the 'handle_successful_payment' function with all required parameters
  const { error: rpcError } = await supabase.rpc("handle_successful_payment", {
    p_user_id: authUser.user.id,
    p_plan: details.plan,
    p_payment_id: details.paymentId,
    // **FIX: The missing p_order_id parameter is now included.**
    p_order_id: details.orderId,
    p_amount: details.amount,
    p_currency: details.currency,
    p_billing_period: details.billingPeriod,
  });

  if (rpcError) {
    console.error(
      "Critical: Subscription update transaction failed:",
      rpcError
    );
    throw new Error(
      "Payment successful but the subscription update failed. Please contact support."
    );
  }
};
