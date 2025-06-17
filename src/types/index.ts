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
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  category?: Category;
  likes?: number;
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
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
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
