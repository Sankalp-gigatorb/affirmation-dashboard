import api from "./api.config";
import type {
  Community,
  CommunityMember,
  CommunityPost,
  CreateCommunityData,
  UpdateCommunityData,
  CreateCommunityPostData,
  UpdateCommunityPostData,
  AddMemberData,
  UpdateMemberRoleData,
} from "@/types";

interface CommunityResponse {
  success: boolean;
  data: Community;
}

interface CommunitiesResponse {
  success: boolean;
  data: {
    communities: Community[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CommunityMembersResponse {
  success: boolean;
  data: {
    members: CommunityMember[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CommunityPostsResponse {
  success: boolean;
  data: {
    posts: CommunityPost[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

class CommunityService {
  // Community CRUD operations
  async getAllCommunities(): Promise<Community[]> {
    const response = await api.get<Community[]>("/community");
    return response.data;
  }

  async getCommunityById(id: string): Promise<Community> {
    const response = await api.get<CommunityResponse>(`/community/${id}`);
    return response.data.data;
  }

  async createCommunity(data: CreateCommunityData): Promise<Community> {
    const response = await api.post<CommunityResponse>("/community", data);
    return response.data.data;
  }

  async updateCommunity(
    id: string,
    data: UpdateCommunityData
  ): Promise<Community> {
    const response = await api.put<CommunityResponse>(`/community/${id}`, data);
    return response.data.data;
  }

  async deleteCommunity(id: string): Promise<void> {
    await api.delete(`/community/${id}`);
  }

  // Join community
  async joinCommunity(communityId: string): Promise<void> {
    await api.post(`/community/${communityId}/join`);
  }

  // Member management
  async getCommunityMembers(communityId: string): Promise<CommunityMember[]> {
    const response = await api.get<CommunityMembersResponse>(
      `/community/${communityId}/members`
    );
    return response.data.data.members;
  }

  async addMember(
    communityId: string,
    data: AddMemberData
  ): Promise<CommunityMember> {
    const response = await api.post<{
      success: boolean;
      data: CommunityMember;
    }>(`/community/${communityId}/members`, data);
    return response.data.data;
  }

  async removeMember(communityId: string, userId: string): Promise<void> {
    await api.delete(`/community/${communityId}/members/${userId}`);
  }

  async updateMemberRole(
    communityId: string,
    userId: string,
    data: UpdateMemberRoleData
  ): Promise<CommunityMember> {
    const response = await api.put<{ success: boolean; data: CommunityMember }>(
      `/community/${communityId}/members/${userId}/role`,
      data
    );
    return response.data.data;
  }

  // Community posts
  async getCommunityPosts(communityId: string): Promise<CommunityPost[]> {
    const response = await api.get<CommunityPostsResponse>(
      `/community/${communityId}/posts`
    );
    return response.data.data.posts;
  }

  async createCommunityPost(
    communityId: string,
    data: CreateCommunityPostData
  ): Promise<CommunityPost> {
    const response = await api.post<{ success: boolean; data: CommunityPost }>(
      `/community/${communityId}/posts`,
      data
    );
    return response.data.data;
  }

  async updateCommunityPost(
    postId: string,
    data: UpdateCommunityPostData
  ): Promise<CommunityPost> {
    const response = await api.put<{ success: boolean; data: CommunityPost }>(
      `/community/posts/${postId}`,
      data
    );
    return response.data.data;
  }

  async deleteCommunityPost(postId: string): Promise<void> {
    await api.delete(`/community/posts/${postId}`);
  }
}

export default new CommunityService();
