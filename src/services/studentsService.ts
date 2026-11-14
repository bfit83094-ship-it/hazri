import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Student, StudentInput } from '../types/db';
import { previewStore } from './previewStore';

export interface StudentFilters {
  classId?: string;
  includeArchived?: boolean;
  search?: string;
}

export const studentsService = {
  async listStudents(filters: StudentFilters = {}): Promise<Student[]> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.listStudents(filters);
    }

    let query = supabase
      .from('students')
      .select(
        'id, user_id, class_id, name, father_name, roll_no, phone, is_active, created_at, updated_at'
      )
      .order('name', { ascending: true });

    if (!filters.includeArchived) {
      query = query.eq('is_active', true);
    }
    if (filters.classId && filters.classId !== 'all') {
      query = query.eq('class_id', filters.classId);
    }
    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.trim();
      query = query.or(`name.ilike.%${q}%,father_name.ilike.%${q}%,roll_no.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getStudentById(id: string): Promise<Student | null> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.getStudentById(id);
    }

    const { data, error } = await supabase
      .from('students')
      .select(
        'id, user_id, class_id, name, father_name, roll_no, phone, is_active, created_at, updated_at'
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createStudent(userId: string, input: StudentInput): Promise<Student> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.createStudent(input);
    }

    const { data, error } = await supabase
      .from('students')
      .insert({
        user_id: userId,
        class_id: input.class_id,
        name: input.name.trim(),
        father_name: input.father_name?.trim() || null,
        roll_no: input.roll_no?.trim() || null,
        phone: input.phone?.trim() || null,
        is_active: true,
      })
      .select(
        'id, user_id, class_id, name, father_name, roll_no, phone, is_active, created_at, updated_at'
      )
      .single();

    if (error) throw error;
    return data;
  },

  async updateStudent(
    id: string,
    input: Partial<StudentInput> & { is_active?: boolean }
  ): Promise<Student> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.updateStudent(id, input);
    }

    const payload: Record<string, unknown> = {};
    if (input.class_id !== undefined) payload.class_id = input.class_id;
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.father_name !== undefined) payload.father_name = input.father_name?.trim() || null;
    if (input.roll_no !== undefined) payload.roll_no = input.roll_no?.trim() || null;
    if (input.phone !== undefined) payload.phone = input.phone?.trim() || null;
    if (input.is_active !== undefined) payload.is_active = input.is_active;

    const { data, error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)
      .select(
        'id, user_id, class_id, name, father_name, roll_no, phone, is_active, created_at, updated_at'
      )
      .single();

    if (error) throw error;
    return data;
  },

  async setStudentActive(id: string, isActive: boolean): Promise<Student> {
    return studentsService.updateStudent(id, { is_active: isActive });
  },

  async deleteStudent(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      previewStore.deleteStudent(id);
      return;
    }

    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  },
};
