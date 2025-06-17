import api from "./api.config";
import type { Affirmation, AffirmationHistory } from "../types";

interface CreateAffirmationData {
  content: string;
  categoryId: string;
  audioUrl?: string;
  isPremium: boolean;
}

interface UpdateAffirmationData {
  content?: string;
  categoryId?: string;
  audioUrl?: string;
  isPremium?: boolean;
}

interface AffirmationHistoryData {
  completed: boolean;
  notes?: string;
}

const AffirmationService = {
  // Basic CRUD operations
  getAllAffirmations: async (): Promise<Affirmation[]> => {
    try {
      const response = await api.get<Affirmation[]>("/affirmations");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAffirmationById: async (id: string): Promise<Affirmation> => {
    try {
      const response = await api.get<Affirmation>(`/affirmations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAffirmation: async (
    data: CreateAffirmationData
  ): Promise<Affirmation> => {
    try {
      const response = await api.post<Affirmation>("/affirmations", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAffirmation: async (
    id: string,
    data: UpdateAffirmationData
  ): Promise<Affirmation> => {
    try {
      const response = await api.put<Affirmation>(`/affirmations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAffirmation: async (id: string): Promise<void> => {
    try {
      await api.delete(`/affirmations/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Category-based operations
  getAffirmationsByCategory: async (
    categoryId: string
  ): Promise<Affirmation[]> => {
    try {
      const response = await api.get<Affirmation[]>(
        `/affirmations/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // History operations
  recordAffirmationHistory: async (
    affirmationId: string,
    data: AffirmationHistoryData
  ): Promise<AffirmationHistory> => {
    try {
      const response = await api.post<AffirmationHistory>(
        `/affirmations/${affirmationId}/history`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserAffirmationHistory: async (): Promise<AffirmationHistory[]> => {
    try {
      const response = await api.get<AffirmationHistory[]>(
        "/affirmations/history"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAffirmationCompleted: async (
    historyId: string
  ): Promise<AffirmationHistory> => {
    try {
      const response = await api.put<AffirmationHistory>(
        `/affirmations/history/${historyId}/complete`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AffirmationService;
