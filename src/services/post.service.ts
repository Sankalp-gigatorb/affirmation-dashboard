import api from "./api.config";
import type { Post } from "@/types";

interface PostResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CreatePostData {
  content: string;
  mediaUrl?: string;
  postType: "IMAGE" | "VIDEO" | "TEXT";
  categoryId?: string;
  privacy: "PUBLIC" | "PRIVATE";
  tags?: string[];
}

interface UpdatePostData {
  content?: string;
  mediaUrl?: string;
  postType?: "IMAGE" | "VIDEO" | "TEXT";
  categoryId?: string;
  privacy?: "PUBLIC" | "PRIVATE";
  tags?: string[];
}

class PostService {
  async getAllPosts(): Promise<Post[]> {
    const response = await api.get<PostResponse>("/post/admin/all");
    return response.data.data.posts;
  }

  async getPostById(id: string): Promise<Post> {
    const response = await api.get<Post>(`/post/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post<Post>("/post/create", data);
    return response.data;
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    const response = await api.put<Post>(`/post/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    const response = await api.delete(`/post/${id}`);
    return response.data;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/user/${userId}`);
    return response.data;
  }

  async adminDeletePost(postId: string): Promise<void> {
    await api.delete(`/posts/admin/${postId}`);
  }
}

export default new PostService();
