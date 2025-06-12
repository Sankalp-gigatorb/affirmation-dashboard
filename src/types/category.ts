export interface CategoryFormData {
  name: string;
  description: string;
  type: "Affirmation" | "Post" | "Community";
}

export interface Category {
  id: number;
  name: string;
  type: "Affirmation" | "Post" | "Community";
  itemCount: number;
  description?: string;
}
