import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { previewStore } from '../services/previewStore';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  userId: string | null;
  loading: boolean;
  isPreviewMode: boolean;
  isSupabaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  enterPreviewMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Always return OAuth users to the deployed app, even when the app is opened
// from a local preview or an embedded development environment.
const PRODUCTION_AUTH_REDIRECT_URL = 'https://hazri.bfit83094.workers.dev/attendance';

function buildPreviewUser(): User {
  const profile = previewStore.getProfile();
  return {
    id: profile.id,
    app_metadata: { provider: 'google' },
    user_metadata: {
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
    },
    aud: 'authenticated',
    created_at: profile.created_at,
    email: profile.email ?? undefined,
  } as User;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [previewActive, setPreviewActive] = useState<boolean>(() => {
    if (isSupabaseConfigured) return false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  });
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('SUPABASE_NOT_CONFIGURED');
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: PRODUCTION_AUTH_REDIRECT_URL,
      },
    });
    if (error) throw error;
  };

  const enterPreviewMode = () => {
    if (isSupabaseConfigured) return;
    setPreviewActive(true);
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setPreviewActive(false);
      previewStore.reset();
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const previewUser = !isSupabaseConfigured && previewActive ? buildPreviewUser() : null;
  const user = session?.user ?? previewUser;
  const userId = user?.id ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userId,
        loading,
        isPreviewMode: !isSupabaseConfigured && previewActive,
        isSupabaseReady: isSupabaseConfigured,
        signInWithGoogle,
        enterPreviewMode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
