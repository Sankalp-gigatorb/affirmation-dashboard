import api from "./api.config";
import type { Category } from "../types";

interface CreateCategoryData {
  name: string;
  description?: string;
  isPremium: boolean;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  isPremium?: boolean;
}

const CategoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>("/category/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (
    categoryData: CreateCategoryData
  ): Promise<Category> => {
    try {
      const response = await api.post<Category>(
        "/category/",
        categoryData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (
    categoryId: string,
    categoryData: UpdateCategoryData
  ): Promise<Category> => {
    try {
      const response = await api.put<Category>(
        `/category/${categoryId}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    try {
      await api.delete(`/category/${categoryId}`);
    } catch (error) {
      throw error;
    }
  },
};

export default CategoryService;
