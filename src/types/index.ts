export interface User {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  postType: "IMAGE" | "VIDEO" | "TEXT";
  categoryId?: string;
  privacy: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    affirmations: number;
    communityPosts: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: string[];
}

export interface Affirmation {
  id: string;
  content: string;
  categoryId: string;
  isPremium: boolean;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface AffirmationHistory {
  id: string;
  affirmationId: string;
  userId: string;
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  affirmation?: Affirmation;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Tag {
  id: string;
  postId: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}
