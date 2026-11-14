import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PROFILE_KEY, useProfile } from '../hooks/useProfile';
import { getDictionary, type I18nDictionary } from '../i18n';
import { profileService } from '../services/profileService';
import type { AppLanguage, Profile } from '../types/db';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'app_lang';

function readCachedLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'ur';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === 'roman' ? 'roman' : 'ur';
  } catch {
    return 'ur';
  }
}

function writeCachedLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore storage quota errors
  }
}

function applyDocumentLanguage(lang: AppLanguage): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (lang === 'roman') {
    html.lang = 'ur-Latn';
    html.dir = 'ltr';
    html.classList.remove('font-naskh');
    html.classList.add('font-roman');
  } else {
    html.lang = 'ur';
    html.dir = 'rtl';
    html.classList.remove('font-roman');
    html.classList.add('font-naskh');
  }
}

interface LanguageContextValue {
  lang: AppLanguage;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLang: (nextLang: AppLanguage) => Promise<void>;
  t: I18nDictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const profileQuery = useProfile();

  const [lang, setLangState] = useState<AppLanguage>(() => {
    const initial = readCachedLanguage();
    applyDocumentLanguage(initial);
    return initial;
  });

  // Track which userId's profile language has already been synced to avoid
  // overwriting an optimistic toggle before profile refetch settles.
  const syncedUserRef = useRef<string | null>(null);

  useEffect(() => {
    applyDocumentLanguage(lang);
  }, [lang]);

  useEffect(() => {
    if (!userId) {
      syncedUserRef.current = null;
      return;
    }
    const profileLang = profileQuery.data?.language;
    if (!profileLang) return;
    if (syncedUserRef.current !== userId) {
      syncedUserRef.current = userId;
      const validLang: AppLanguage = profileLang === 'roman' ? 'roman' : 'ur';
      setLangState(validLang);
      writeCachedLanguage(validLang);
      applyDocumentLanguage(validLang);
    }
  }, [userId, profileQuery.data?.language]);

  const setLang = useCallback(
    async (nextLang: AppLanguage) => {
      setLangState(nextLang);
      writeCachedLanguage(nextLang);
      applyDocumentLanguage(nextLang);

      if (userId) {
        syncedUserRef.current = userId;
        queryClient.setQueryData<Profile | null>(
          [...PROFILE_KEY, userId],
          (prev) => (prev ? { ...prev, language: nextLang } : prev)
        );
        try {
          await profileService.updateLanguage(userId, nextLang);
          await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
        } catch {
          // Keep local preference active even if network save fails temporarily
        }
      }
    },
    [userId, queryClient]
  );

  const t = getDictionary(lang);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir: lang === 'ur' ? 'rtl' : 'ltr',
        isRTL: lang === 'ur',
        setLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export function useT(): I18nDictionary {
  return useLanguage().t;
}
