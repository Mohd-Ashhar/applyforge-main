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

// --- NEW INTERFACE FOR PAYPAL ---
export interface PaypalSubscriptionResponse {
  approve_link: string;
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
  const { data, error } = await supabase.functions.invoke(
    "create-payment-subscription",
    { body: payload }
  );

  if (error) {
    console.error("Failed to create Razorpay subscription:", error);
    throw new Error(
      "Failed to create Razorpay subscription. Please try again."
    );
  }

  return data;
};

export const createPaypalSubscription = async (
  payload: CreateOrderPayload
): Promise<PaypalSubscriptionResponse> => {
  // --- REPLACEMENT ---
  const { data, error } = await supabase.functions.invoke(
    "create-paypal-subscription",
    { body: payload }
  );

  if (error) {
    console.error("Failed to create PayPal subscription:", error);
    throw new Error("Failed to create PayPal subscription.");
  }
  return data;
  // --- END REPLACEMENT ---
};


export const triggerPaymentNotification = async (
  payload: PaymentNotificationPayload
) => {
  try {
    // This call is now secure and authenticated
    await supabase.functions.invoke("payment-notification", { body: payload });
  } catch (error) {
    // The error is already logged in the Edge Function, but we can log it here too
    console.error("Failed to trigger payment notification function:", error);
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