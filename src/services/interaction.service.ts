import api from "./api.config";
import type { Comment } from "../types";

interface CreateCommentData {
  content: string;
}

interface UpdateCommentData {
  content: string;
}

interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

const InteractionService = {
  // Like related functions
  toggleLike: async (postId: string): Promise<LikeResponse> => {
    try {
      const response = await api.post<LikeResponse>(
        `/interactions/posts/${postId}/like`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPostLikes: async (postId: string): Promise<number> => {
    try {
      const response = await api.get<{ count: number }>(
        `/interactions/posts/${postId}/likes`
      );
      return response.data.count;
    } catch (error) {
      throw error;
    }
  },

  // Comment related functions
  createComment: async (
    postId: string,
    commentData: CreateCommentData
  ): Promise<Comment> => {
    try {
      const response = await api.post<Comment>(
        `/interactions/posts/${postId}/comments`,
        commentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPostComments: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await api.get<Comment[]>(
        `/interactions/posts/${postId}/comments`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateComment: async (
    commentId: string,
    commentData: UpdateCommentData
  ): Promise<Comment> => {
    try {
      const response = await api.put<Comment>(
        `/interactions/comments/${commentId}`,
        commentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await api.delete(`/interactions/comments/${commentId}`);
    } catch (error) {
      throw error;
    }
  },
};

export default InteractionService;
