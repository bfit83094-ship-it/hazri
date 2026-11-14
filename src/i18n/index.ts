import type { AppLanguage } from '../types/db';
import { roman } from './roman';
import { ur, type I18nDictionary } from './ur';

export const dictionaries: Record<AppLanguage, I18nDictionary> = {
  ur,
  roman,
};

export function getDictionary(lang: AppLanguage = 'ur'): I18nDictionary {
  return dictionaries[lang] ?? ur;
}

export { ur, roman };
export type { I18nDictionary };
