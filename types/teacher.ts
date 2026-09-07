export interface Question {
  id: number;
  text: string;
  optA: string;
  optB: string;
  optC: string;
  optD: string;
  correct: string;
}

export interface ExamItem {
  id: number;
  teacher_name: string;
  title: string;
  subject: string;
  code: string;
  questions: Question[];
  created_at?: string;
}

export interface StudentResult {
  id: number;
  exam_title: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}