import { normalizeLessonPayload } from '../lib/grades';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { LessonRecord, LessonUpsertInput } from '../types/db';
import { previewStore } from './previewStore';

export const lessonRecordsService = {
  async listByDate(date: string): Promise<LessonRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.listLessonsByDate(date);
    }

    const { data, error } = await supabase
      .from('lesson_records')
      .select(
        'id, user_id, student_id, record_date, lesson_type, heard, lines_count, mistakes_count, grade, note, created_at, updated_at'
      )
      .eq('record_date', date);

    if (error) throw error;
    return data ?? [];
  },

  async getByStudentAndDate(studentId: string, date: string): Promise<LessonRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.getLessonsByStudentAndDate(studentId, date);
    }

    const { data, error } = await supabase
      .from('lesson_records')
      .select(
        'id, user_id, student_id, record_date, lesson_type, heard, lines_count, mistakes_count, grade, note, created_at, updated_at'
      )
      .eq('student_id', studentId)
      .eq('record_date', date);

    if (error) throw error;
    return data ?? [];
  },

  async upsertLessonRecord(
    userId: string,
    input: LessonUpsertInput
  ): Promise<LessonRecord> {
    const normalized = normalizeLessonPayload(input);
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.upsertLessonRecord(normalized);
    }

    const { data, error } = await supabase
      .from('lesson_records')
      .upsert(
        {
          user_id: userId,
          student_id: normalized.student_id,
          record_date: normalized.record_date,
          lesson_type: normalized.lesson_type,
          heard: normalized.heard,
          lines_count: normalized.lines_count,
          mistakes_count: normalized.mistakes_count,
          grade: normalized.grade,
          note: normalized.note,
        },
        { onConflict: 'student_id,record_date,lesson_type' }
      )
      .select(
        'id, user_id, student_id, record_date, lesson_type, heard, lines_count, mistakes_count, grade, note, created_at, updated_at'
      )
      .single();

    if (error) throw error;
    return data;
  },

  async listByStudent(
    studentId: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<LessonRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      const all = previewStore.listLessonsByStudent(studentId);
      return all.filter((r) => {
        if (startDate && r.record_date < startDate) return false;
        if (endDate && r.record_date > endDate) return false;
        return true;
      });
    }

    let query = supabase
      .from('lesson_records')
      .select(
        'id, user_id, student_id, record_date, lesson_type, heard, lines_count, mistakes_count, grade, note, created_at, updated_at'
      )
      .eq('student_id', studentId)
      .order('record_date', { ascending: false });

    if (startDate) query = query.gte('record_date', startDate);
    if (endDate) query = query.lte('record_date', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },
};
