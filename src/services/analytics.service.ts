import api from "./api.config";

export interface AffirmationAnalytics {
  totalAffirmations: number;
  totalUsage: number;
  categoryStats: Array<{
    categoryName: string;
    count: number;
  }>;
  popularAffirmations: Array<{
    content: string;
    category: string;
    usageCount: number;
  }>;
  dailyUsage: Array<{
    date: string;
    count: number;
  }>;
  completionRate: {
    total: number;
    completed: number;
    rate: number;
  };
}

export interface PostAnalytics {
  totalPosts: number;
  postsByType: Array<{
    type: string;
    count: number;
  }>;
  weeklyVolume: Array<{
    day: string;
    posts: number;
  }>;
  engagementStats: {
    totalLikes: number;
    totalComments: number;
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
  };
}

export interface UserGrowthAnalytics {
  month: string;
  users: number;
}

export interface DashboardAnalytics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    withSubscription: number;
    withoutSubscription: number;
  };
  subscriptions: {
    total: number;
    active: number;
    monthly: number;
    yearly: number;
    revenue: {
      monthly: number;
      yearly: number;
      total: number;
    };
  };
  affirmations: AffirmationAnalytics;
  posts: PostAnalytics;
  userGrowth: UserGrowthAnalytics[];
}

class AnalyticsService {
  // Get comprehensive dashboard analytics
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await api.get<{
        success: boolean;
        data: DashboardAnalytics;
      }>("/analytics/dashboard");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      throw error;
    }
  }

  // Get affirmation analytics
  async getAffirmationAnalytics(): Promise<AffirmationAnalytics> {
    try {
      const response = await api.get<{
        success: boolean;
        data: AffirmationAnalytics;
      }>("/analytics/affirmations");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching affirmation analytics:", error);
      throw error;
    }
  }

  // Get post analytics
  async getPostAnalytics(): Promise<PostAnalytics> {
    try {
      const response = await api.get<{ success: boolean; data: PostAnalytics }>(
        "/analytics/posts"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching post analytics:", error);
      throw error;
    }
  }

  // Get user growth analytics
  async getUserGrowthAnalytics(): Promise<UserGrowthAnalytics[]> {
    try {
      const response = await api.get<{
        success: boolean;
        data: UserGrowthAnalytics[];
      }>("/analytics/user-growth");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user growth analytics:", error);
      throw error;
    }
  }

  // Get popular affirmations
  async getPopularAffirmations(): Promise<
    Array<{
      content: string;
      category: string;
      usageCount: number;
    }>
  > {
    try {
      const response = await api.get<{
        success: boolean;
        data: Array<{
          content: string;
          category: string;
          usageCount: number;
        }>;
      }>("/analytics/popular-affirmations");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching popular affirmations:", error);
      throw error;
    }
  }

  // Get affirmation completion rate
  async getAffirmationCompletionRate(): Promise<{
    total: number;
    completed: number;
    rate: number;
  }> {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          total: number;
          completed: number;
          rate: number;
        };
      }>("/analytics/affirmation-completion-rate");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching affirmation completion rate:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
