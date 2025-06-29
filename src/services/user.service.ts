import api from "./api.config";
import type { User } from "@/types";

// Extended User interface for admin operations
interface AdminUser extends User {
  phone?: string;
  gender?: string;
  dob?: string;
  fcmToken?: string;
  subscription?: {
    plan: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
  };
  _count?: {
    posts: number;
    comments: number;
    communities: number;
    createdCommunities: number;
    affirmations: number;
    goals: number;
  };
}

interface UserStatistics {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  usersWithSubscription: number;
  usersWithoutSubscription: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  genderDistribution: {
    male: number;
    female: number;
    "Not specified": number;
  };
  subscriptionStats: {
    basic: number;
    premium: number;
  };
}

interface UserActivity {
  posts: Array<{
    id: string;
    content: string;
    postType: string;
    createdAt: string;
    _count: {
      likes: number;
      comments: number;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    post: {
      id: string;
      content: string;
    };
  }>;
  likes: Array<{
    id: string;
    createdAt: string;
    post: {
      id: string;
      content: string;
    };
  }>;
  affirmations: Array<{
    id: string;
    seenAt: string;
    isCompleted: boolean;
    affirmation: {
      content: string;
    };
  }>;
  goals: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  isAdmin?: boolean;
  fcmToken?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  isAdmin?: boolean;
  fcmToken?: string;
}

interface BulkUpdateData {
  userIds: string[];
  updateData: Partial<UpdateUserData>;
}

interface BulkDeleteData {
  userIds: string[];
}

interface UsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserResponse {
  success: boolean;
  data: AdminUser;
  message?: string;
}

interface StatisticsResponse {
  success: boolean;
  data: UserStatistics;
}

interface ActivityResponse {
  success: boolean;
  data: UserActivity;
}

interface BulkResponse {
  success: boolean;
  data: {
    message: string;
    updatedCount?: number;
    deletedCount?: number;
  };
}

class UserService {
  // Get all users with filters and pagination
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isAdmin?: boolean;
    gender?: string;
    hasSubscription?: boolean;
  }): Promise<{ users: AdminUser[]; pagination: any }> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isAdmin !== undefined)
      queryParams.append("isAdmin", params.isAdmin.toString());
    if (params?.gender) queryParams.append("gender", params.gender);
    if (params?.hasSubscription !== undefined)
      queryParams.append("hasSubscription", params.hasSubscription.toString());

    const url = `/admin/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await api.get<UsersResponse>(url);

    return {
      users: response.data.data,
      pagination: response.data.pagination,
    };
  }

  // Get user statistics
  async getUserStatistics(): Promise<UserStatistics> {
    const response = await api.get<StatisticsResponse>(
      "/admin/users/statistics"
    );
    return response.data.data;
  }

  // Get user by ID
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await api.get<UserResponse>(`/admin/users/${userId}`);
    return response.data.data;
  }

  // Create user
  async createUser(data: CreateUserData): Promise<AdminUser> {
    const response = await api.post<UserResponse>("/admin/users", data);
    return response.data.data;
  }

  // Update user
  async updateUser(userId: string, data: UpdateUserData): Promise<AdminUser> {
    const response = await api.put<UserResponse>(
      `/admin/users/${userId}`,
      data
    );
    return response.data.data;
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  }

  // Toggle admin status
  async toggleAdminStatus(userId: string): Promise<AdminUser> {
    const response = await api.patch<UserResponse>(
      `/admin/users/${userId}/toggle-admin`
    );
    return response.data.data;
  }

  // Get user activity
  async getUserActivity(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<UserActivity> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `/admin/users/${userId}/activity${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await api.get<ActivityResponse>(url);

    return response.data.data;
  }

  // Bulk update users
  async bulkUpdateUsers(
    data: BulkUpdateData
  ): Promise<{ message: string; updatedCount: number }> {
    const response = await api.post<BulkResponse>(
      "/admin/users/bulk-update",
      data
    );
    return {
      message: response.data.data.message,
      updatedCount: response.data.data.updatedCount || 0,
    };
  }

  // Bulk delete users
  async bulkDeleteUsers(
    data: BulkDeleteData
  ): Promise<{ message: string; deletedCount: number }> {
    const response = await api.post<BulkResponse>(
      "/admin/users/bulk-delete",
      data
    );
    return {
      message: response.data.data.message,
      deletedCount: response.data.data.deletedCount || 0,
    };
  }

  // Get current user's profile
  async getCurrentUserProfile(): Promise<AdminUser> {
    const response = await api.get<UserResponse>("/user/profile");
    return response.data.data;
  }

  // Update current user's profile
  async updateCurrentUserProfile(data: UpdateUserData): Promise<AdminUser> {
    const response = await api.put<UserResponse>("/user/profile", data);
    return response.data.data;
  }
}

export default new UserService();
