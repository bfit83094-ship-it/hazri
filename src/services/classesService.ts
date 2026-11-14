import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { ClassItem } from '../types/db';
import { previewStore } from './previewStore';

export const classesService = {
  async listClasses(): Promise<ClassItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.listClasses();
    }

    const { data, error } = await supabase
      .from('classes')
      .select('id, user_id, name, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async createClass(userId: string, name: string, sortOrder: number): Promise<ClassItem> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.createClass(name);
    }

    const { data, error } = await supabase
      .from('classes')
      .insert({
        user_id: userId,
        name: name.trim(),
        sort_order: sortOrder,
      })
      .select('id, user_id, name, sort_order, created_at')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('CLASS_DUPLICATE');
      throw error;
    }
    return data;
  },

  async updateClass(
    id: string,
    patch: { name?: string; sort_order?: number }
  ): Promise<ClassItem> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.updateClass(id, patch);
    }

    const updatePayload: { name?: string; sort_order?: number } = {};
    if (patch.name !== undefined) updatePayload.name = patch.name.trim();
    if (patch.sort_order !== undefined) updatePayload.sort_order = patch.sort_order;

    const { data, error } = await supabase
      .from('classes')
      .update(updatePayload)
      .eq('id', id)
      .select('id, user_id, name, sort_order, created_at')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('CLASS_DUPLICATE');
      throw error;
    }
    return data;
  },

  async reorderClasses(items: { id: string; sort_order: number }[]): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      previewStore.reorderClasses(items.map((i) => i.id));
      return;
    }

    await Promise.all(
      items.map(async (item) => {
        const { error } = await supabase!
          .from('classes')
          .update({ sort_order: item.sort_order })
          .eq('id', item.id);
        if (error) throw error;
      })
    );
  },

  async deleteClass(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      previewStore.deleteClass(id);
      return;
    }

    // Pre-check students count for clear UX, plus handle FK RESTRICT (23503)
    const { count, error: countError } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', id);

    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      throw new Error('CLASS_HAS_STUDENTS');
    }

    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) {
      if (error.code === '23503') throw new Error('CLASS_HAS_STUDENTS');
      throw error;
    }
  },
};
