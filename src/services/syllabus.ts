import api from './api';
import type { Syllabus, PaginatedResponse, SyllabusUploadTextRequest } from '../types';

export const syllabusService = {
  /**
   * Upload syllabus as text
   */
  uploadText: async (courseName: string, content: string): Promise<Syllabus> => {
    const payload: SyllabusUploadTextRequest = {
      course_name: courseName,
      content,
    };
    return api.post('/syllabus/upload/text', payload);
  },

  /**
   * Upload syllabus as a file (PDF)
   */
  uploadFile: async (file: File, courseName: string): Promise<Syllabus> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_name', courseName);
    
    return api.post('/syllabus/upload/file', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });
  },

  /**
   * Get list of all syllabi with pagination
   */
  list: async (skip = 0, limit = 10): Promise<PaginatedResponse<Syllabus>> => {
    const items: Syllabus[] = await api.get('/syllabus/', {
      params: { skip, limit },
    });
    // Backend returns array directly, wrap it in paginated format
    return {
      items,
      total: items.length,
      skip,
      limit,
    };
  },

  /**
   * Get syllabus by ID
   */
  getById: async (id: string): Promise<Syllabus> => {
    return api.get(`/syllabus/${id}`);
  },

  /**
   * Delete syllabus by ID
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete(`/syllabus/${id}`);
  },
};
