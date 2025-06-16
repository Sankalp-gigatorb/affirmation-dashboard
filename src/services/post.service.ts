import type { Post } from "@/types";
import api from "./api.config";


interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
}

interface UpdatePostData {
  title?: string;
  content?: string;
  categoryId?: string;
}

const PostService = {
  createPost: async (postData: CreatePostData): Promise<Post> => {
    try {
      const response = await api.post<Post>("/posts/create", postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPost: async (postId: string): Promise<Post> => {
    try {
      const response = await api.get<Post>(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (
    postId: string,
    postData: UpdatePostData
  ): Promise<Post> => {
    try {
      const response = await api.put<Post>(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    try {
      await api.delete(`/posts/${postId}`);
    } catch (error) {
      throw error;
    }
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await api.get<Post[]>(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllPosts: async (): Promise<Post[]> => {
    try {
      const response = await api.get<Post[]>("/posts/admin/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminDeletePost: async (postId: string): Promise<void> => {
    try {
      await api.delete(`/posts/admin/${postId}`);
    } catch (error) {
      throw error;
    }
  },
};

export default PostService;
