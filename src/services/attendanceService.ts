import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AttendanceRecord, AttendanceStatus } from '../types/db';
import { previewStore } from './previewStore';

export const attendanceService = {
  async listByDate(date: string): Promise<AttendanceRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.listAttendanceByDate(date);
    }

    const { data, error } = await supabase
      .from('attendance')
      .select(
        'id, user_id, student_id, attendance_date, status, created_at, updated_at'
      )
      .eq('attendance_date', date);

    if (error) throw error;
    return data ?? [];
  },

  async upsertAttendance(
    userId: string,
    studentId: string,
    date: string,
    status: AttendanceStatus
  ): Promise<AttendanceRecord> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.upsertAttendance(studentId, date, status);
    }

    const { data, error } = await supabase
      .from('attendance')
      .upsert(
        {
          user_id: userId,
          student_id: studentId,
          attendance_date: date,
          status,
        },
        { onConflict: 'student_id,attendance_date' }
      )
      .select(
        'id, user_id, student_id, attendance_date, status, created_at, updated_at'
      )
      .single();

    if (error) throw error;
    return data;
  },

  async markAllPresent(
    userId: string,
    studentIds: string[],
    date: string
  ): Promise<AttendanceRecord[]> {
    if (studentIds.length === 0) return [];
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.markAllPresent(studentIds, date);
    }

    const rows = studentIds.map((studentId) => ({
      user_id: userId,
      student_id: studentId,
      attendance_date: date,
      status: 'present' as const,
    }));

    const { data, error } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,attendance_date' })
      .select(
        'id, user_id, student_id, attendance_date, status, created_at, updated_at'
      );

    if (error) throw error;
    return data ?? [];
  },

  async listByStudent(
    studentId: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<AttendanceRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      const all = previewStore.listAttendanceByStudent(studentId);
      return all.filter((r) => {
        if (startDate && r.attendance_date < startDate) return false;
        if (endDate && r.attendance_date > endDate) return false;
        return true;
      });
    }

    let query = supabase
      .from('attendance')
      .select(
        'id, user_id, student_id, attendance_date, status, created_at, updated_at'
      )
      .eq('student_id', studentId)
      .order('attendance_date', { ascending: false });

    if (startDate) query = query.gte('attendance_date', startDate);
    if (endDate) query = query.lte('attendance_date', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },
};
