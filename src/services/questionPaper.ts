import api from './api';
import type { QuestionPaper, QuestionPaperConfig, PaginatedResponse } from '../types';

export const questionPaperService = {
  /**
   * Generate a question paper
   */
  generate: async (config: QuestionPaperConfig): Promise<QuestionPaper> => {
    return api.post('/question-paper/generate', config);
  },

  /**
   * Get list of all question papers with optional filtering
   */
  list: async (
    syllabusId?: string,
    skip = 0,
    limit = 10
  ): Promise<PaginatedResponse<QuestionPaper>> => {
    const params: Record<string, string | number> = { skip, limit };
    if (syllabusId !== undefined) {
      params.syllabus_id = syllabusId;
    }
    const items: QuestionPaper[] = await api.get('/question-paper/', { params });
    // Backend returns array directly, wrap it in paginated format
    return {
      items,
      total: items.length,
      skip,
      limit,
    };
  },

  /**
   * Get question paper by ID
   */
  getById: async (id: string): Promise<QuestionPaper> => {
    return api.get(`/question-paper/${id}`);
  },

  /**
   * Delete question paper by ID
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete(`/question-paper/${id}`);
  },
};
