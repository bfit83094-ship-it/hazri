import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AppLanguage, Profile } from '../types/db';
import { previewStore } from './previewStore';

export const profileService = {
  async getCurrentProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.getProfile();
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, language, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateLanguage(userId: string, language: AppLanguage): Promise<Profile> {
    if (!isSupabaseConfigured || !supabase) {
      return previewStore.updateLanguage(language);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ language })
      .eq('id', userId)
      .select('id, full_name, email, avatar_url, language, created_at')
      .single();

    if (error) throw error;
    return data;
  },
};
