
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  createRazorpayOrder, 
  updateUserSubscription, 
  upgradeToPlan,
  SubscriptionPlan,
  RazorpayPaymentResponse 
} from '@/services/paymentService';

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
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const processPayment = async (plan: SubscriptionPlan) => {
    if (!user?.email) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }

    const userEmail = user.email;

    // Handle Free plan upgrade directly
    if (plan === 'Free') {
      try {
        setIsProcessing(true);
        
        // For Free Plan (₹0) - no Razorpay involved
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'Free' } as any)
          .eq('email', userEmail);

        if (error) {
          console.error("Subscription update failed:", error.message);
          toast({
            title: 'Error',
            description: 'Failed to update to Free plan. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Plan Updated',
            description: 'Successfully upgraded to Free plan!',
          });
          window.location.href = '/thank-you';
        }
      } catch (error) {
        console.error('Free plan upgrade error:', error);
        toast({
          title: 'Error',
          description: 'Failed to update plan. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Handle paid plans (Basic/Pro)
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(
        user.email.split('@')[0], // Use email prefix as name
        user.email,
        plan
      );

      // Configure Razorpay options
      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'ApplyForge',
        description: `${plan} Plan Subscription`,
        order_id: orderResponse.order_id,
        prefill: {
          name: user.email.split('@')[0],
          email: user.email,
        },
        handler: async (paymentResponse: RazorpayPaymentResponse) => {
          try {
            // Implement the exact flow you specified
            console.log('Payment successful:', paymentResponse);
            
            // Update user subscription in Supabase using email
            await updateUserSubscription(
              userEmail,
              plan,
              paymentResponse.razorpay_payment_id
            );

            toast({
              title: 'Payment Successful!',
              description: `Successfully subscribed to ${plan} plan.`,
            });

            // Redirect to thank-you page as specified
            window.location.href = '/thank-you';
          } catch (error: any) {
            console.error('Subscription update failed:', error);
            alert("Payment successful but subscription update failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
  };
};
