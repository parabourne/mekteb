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
  is_private: boolean;    // false = Açıq imtahan, true = Özəl (PIN tələb edən)
  exam_pin?: string;      // Özəl imtahan üçün giriş PIN kodu
  is_active: boolean;     // true = Aktiv (davam edir), false = Qapalı (bitib)
  created_at?: string;
}

export interface StudentResult {
  id: number;
  exam_title: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  result_pin: string;     // Valideynin nəticəyə baxması üçün unikal şifrə
  created_at: string;
}