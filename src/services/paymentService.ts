import { supabase } from "@/integrations/supabase/client";

// Types remain the same
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

// This interface now matches the arguments of our new database function
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
  amount?: number; // Main currency unit (e.g., 399), not paise/cents
  currency?: string;
  paymentId?: string;
  orderId?: string;
  failureReason?: string;
}

/**
 * Sends a request to the n8n webhook to create a Razorpay order. (Unchanged)
 */
export const createRazorpayOrder = async (
  payload: CreateOrderPayload
): Promise<RazorpayOrderResponse> => {
  const response = await fetch(
    "https://n8n.applyforge.cloud/webhook-test/create-razorpay-order",
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
    console.error("Failed to create Razorpay order:", errorData);
    throw new Error("Failed to create Razorpay order. Please try again.");
  }

  return response.json();
};
export const triggerPaymentNotification = async (
  payload: PaymentNotificationPayload
) => {
  // Use a try-catch block so a failed webhook doesn't break the user's experience
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
    // Do not re-throw the error, as this is a non-critical background task
  }
};
/**
 * **REVISED: Calls the database function to perform a secure transaction.**
 * This is now the single point of truth for updating a subscription.
 */
export const updateUserSubscription = async (
  details: SubscriptionUpdateDetails
) => {
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser.user) {
    throw new Error("User not found for subscription update.");
  }

  // Call the 'handle_successful_payment' function we created in the database
  const { error: rpcError } = await supabase.rpc("handle_successful_payment", {
    p_user_id: authUser.user.id,
    p_plan: details.plan,
    p_payment_id: details.paymentId,
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
