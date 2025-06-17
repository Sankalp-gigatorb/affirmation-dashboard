export interface CategoryFormData {
  name: string;
  description: string;
  isPremium: boolean;
}

export interface Category {
  id: string;
  name: string;
  postCount: number;
  affirmations: number;
  description?: string;
  isPremium: boolean;
}
