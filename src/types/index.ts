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

export interface Community {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    isAdmin: boolean;
    fcmToken: string;
    createdAt: string;
    updatedAt: string;
  };
  memberCount?: number;
  members?: CommunityMember[];
  posts?: CommunityPost[];
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: "MEMBER" | "ADMIN" | "MODERATOR";
  joinedAt: string;
  user?: User;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  postType: "IMAGE" | "VIDEO" | "TEXT";
  createdAt: string;
  updatedAt: string;
  author?: Author;
  community?: Community;
}

export interface CreateCommunityData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface UpdateCommunityData {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface CreateCommunityPostData {
  content: string;
  mediaUrl?: string;
  postType: "IMAGE" | "VIDEO" | "TEXT";
}

export interface UpdateCommunityPostData {
  content?: string;
  mediaUrl?: string;
  postType?: "IMAGE" | "VIDEO" | "TEXT";
}

export interface AddMemberData {
  userId: string;
  role?: "MEMBER" | "ADMIN" | "MODERATOR";
}

export interface UpdateMemberRoleData {
  role: "MEMBER" | "ADMIN" | "MODERATOR";
}
