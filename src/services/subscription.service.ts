import api from "./api.config";

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  savings?: string;
}

export interface Subscription {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface SubscriptionStatus {
  hasSubscription: boolean;
  subscription: Subscription | null;
}

export interface CheckoutSessionResponse {
  success: boolean;
  sessionId: string;
  url: string;
}

export interface PlansResponse {
  success: boolean;
  plans: Plan[];
}

export interface SubscriptionResponse {
  success: boolean;
  hasSubscription: boolean;
  subscription: Subscription | null;
}

const SubscriptionService = {
  // Get available subscription plans
  getAvailablePlans: async (): Promise<PlansResponse> => {
    try {
      const response = await api.get<PlansResponse>("/subscription/plans");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's current subscription status
  getUserSubscription: async (): Promise<SubscriptionResponse> => {
    try {
      const response = await api.get<SubscriptionResponse>(
        "/subscription/status"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create Stripe checkout session
  createCheckoutSession: async (
    planType: string
  ): Promise<CheckoutSessionResponse> => {
    try {
      const response = await api.post<CheckoutSessionResponse>(
        "/subscription/create-checkout-session",
        { planType }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/subscription/cancel"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify payment success
  verifyPaymentSuccess: async (
    sessionId: string
  ): Promise<{
    success: boolean;
    message: string;
    subscription?: Subscription;
  }> => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        subscription?: Subscription;
      }>(`/subscription/verify-payment?session_id=${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Manually trigger webhook processing (for debugging)
  triggerWebhookProcessing: async (
    sessionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/subscription/test-webhook",
        { session_id: sessionId }
      );
      return response.data;
    } catch (error) {
      console.error("Error triggering webhook processing:", error);
      throw error;
    }
  },
};

export default SubscriptionService;
