import api from "./api.config";

export interface AdminSubscription {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    createdAt: string;
  };
}

export interface SubscriptionStats {
  overview: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    recentSubscriptions: number;
  };
  byPlan: {
    monthly: number;
    yearly: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
    total: number;
  };
  monthlyStats: Array<{
    plan: string;
    _count: {
      plan: number;
    };
  }>;
}

export interface SubscriptionAnalytics {
  period: string;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  subscriptionsByPlan: Array<{
    plan: string;
    _count: {
      plan: number;
    };
  }>;
  dailyStats: Array<{
    date: string;
    count: number;
    plan: string;
  }>;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: AdminSubscription[];
    pagination: PaginationInfo;
  };
}

export interface StatsResponse {
  success: boolean;
  data: SubscriptionStats;
}

export interface AnalyticsResponse {
  success: boolean;
  data: SubscriptionAnalytics;
}

const AdminSubscriptionService = {
  // Get all subscriptions with filters
  getAllSubscriptions: async (params: {
    page?: number;
    limit?: number;
    plan?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<SubscriptionsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get<SubscriptionsResponse>(
        `/admin/subscriptions?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get subscription statistics
  getSubscriptionStats: async (): Promise<StatsResponse> => {
    try {
      const response = await api.get<StatsResponse>(
        "/admin/subscriptions/stats"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get subscription analytics
  getSubscriptionAnalytics: async (
    period: string = "30"
  ): Promise<AnalyticsResponse> => {
    try {
      const response = await api.get<AnalyticsResponse>(
        `/admin/subscriptions/analytics?period=${period}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get subscription by ID with detailed user info
  getSubscriptionById: async (
    id: string
  ): Promise<{
    success: boolean;
    data: {
      subscription: AdminSubscription;
      history: AdminSubscription[];
    };
  }> => {
    try {
      const response = await api.get(`/admin/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel user subscription (admin-triggered)
  cancelUserSubscription: async (
    id: string,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: AdminSubscription;
  }> => {
    try {
      const response = await api.post(`/admin/subscriptions/${id}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Extend user subscription
  extendUserSubscription: async (
    id: string,
    days: number,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: AdminSubscription;
  }> => {
    try {
      const response = await api.post(`/admin/subscriptions/${id}/extend`, {
        days,
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AdminSubscriptionService;
