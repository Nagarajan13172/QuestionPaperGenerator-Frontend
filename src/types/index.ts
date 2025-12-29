// TypeScript type definitions for the Question Paper Generator

export interface Unit {
  id: string;
  title: string;
  topics: string[];
  order: number;
  // Legacy fields for compatibility
  unit_number?: number;
  unit_name?: string;
}

export interface Syllabus {
  id: string; // Changed from number to string
  course_name: string;
  content: string;
  units: Unit[];
  created_at: string;
  updated_at?: string;
}

export interface QuestionType {
  type: 'multiple_choice' | 'descriptive' | 'essay' | 'short_answer';
  marks: number;
  count: number;
}

export interface GenerationRules {
  question_types: QuestionType[];
  difficulty_distribution?: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  unit_distribution?: 'equal' | 'weighted' | 'random';
  include_answers?: boolean;
  randomize_options?: boolean;
}

export interface QuestionPaperConfig {
  syllabus_id: string;
  total_marks: number;
  generation_rules: GenerationRules;
}

export interface Question {
  id: string;
  unit_id: string;
  unit_name: string;
  question_text: string;
  marks: number;
  type: 'multiple_choice' | 'descriptive' | 'essay' | 'short_answer';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[] | null;
  correct_answer?: string;
  answer_explanation?: string;
  course_outcome?: string; // CO1, CO2, CO3, etc.
  blooms_level?: string; // K1, K2, K3, etc.
  // Legacy fields for compatibility
  question?: string;
  unit?: string;
  topic?: string;
  answer?: string;
}

export interface QuestionPaper {
  id: string;
  syllabus_id: string;
  course_name: string;
  generated_at: string;
  total_marks: number;
  total_questions: number;
  questions: Question[];
  generation_rules: {
    question_types: Array<{
      marks: number;
      count: number;
      type: string;
      difficulty: string | null;
    }>;
    difficulty_distribution: {
      easy: number;
      medium: number;
      hard: number;
    };
    unit_selection: string;
    include_answer_key: boolean;
    randomize_order: boolean;
    randomize_options: boolean;
  };
  units_coverage: Record<string, number>;
  // Legacy field for compatibility
  created_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  detail?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface SyllabusUploadTextRequest {
  course_name: string;
  content: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}
