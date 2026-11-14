export type AttendanceStatus = 'present' | 'absent' | 'leave';
export type LessonType = 'sabaq' | 'sabqi' | 'manzil';
export type Grade = 'acha' | 'theek' | 'kamzor';
export type AppLanguage = 'ur' | 'roman';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  language: AppLanguage;
  created_at: string;
}

export interface ClassItem {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  class_id: string;
  name: string;
  father_name: string | null;
  roll_no: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  student_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface LessonRecord {
  id: string;
  user_id: string;
  student_id: string;
  record_date: string;
  lesson_type: LessonType;
  heard: boolean;
  lines_count: number;
  mistakes_count: number;
  grade: Grade | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentInput {
  name: string;
  class_id: string;
  father_name?: string | null;
  roll_no?: string | null;
  phone?: string | null;
}

export interface LessonUpsertInput {
  student_id: string;
  record_date: string;
  lesson_type: LessonType;
  heard: boolean;
  lines_count: number;
  mistakes_count: number;
  grade: Grade | null;
  note: string | null;
}
