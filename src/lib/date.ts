import { getDictionary } from '../i18n';
import type { AppLanguage } from '../types/db';

export function getTodayISO(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDaysISO(iso: string, deltaDays: number): string {
  const dt = parseISODate(iso);
  dt.setDate(dt.getDate() + deltaDays);
  return getTodayISO(dt);
}

export function isFutureISO(iso: string, todayISO: string = getTodayISO()): boolean {
  return iso > todayISO;
}

/** Formats YYYY-MM-DD as DD-MM-YYYY with Latin digits */
export function formatGregorianDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export function formatWeekday(iso: string, lang: AppLanguage = 'ur'): string {
  const dt = parseISODate(iso);
  const dict = getDictionary(lang);
  return dict.weekdays[dt.getDay()] ?? '';
}

export function formatDateFull(iso: string, lang: AppLanguage = 'ur'): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const dt = parseISODate(iso);
  const dict = getDictionary(lang);
  const weekday = dict.weekdays[dt.getDay()] ?? '';
  const month = dict.months[dt.getMonth()] ?? '';
  const day = dt.getDate();
  const year = dt.getFullYear();
  return lang === 'ur'
    ? `${weekday}، ${day} ${month} ${year}`
    : `${weekday}, ${day} ${month} ${year}`;
}

export const formatUrduWeekday = (iso: string) => formatWeekday(iso, 'ur');
export const formatUrduDateFull = (iso: string) => formatDateFull(iso, 'ur');

export type DateRangePreset = 'week' | 'month' | 'all' | 'custom';

export function getRangeStartISO(
  preset: Exclude<DateRangePreset, 'custom'>,
  todayISO: string = getTodayISO()
): string | null {
  if (preset === 'all') return null;
  if (preset === 'week') return addDaysISO(todayISO, -6);
  // month: last 30 days inclusive
  return addDaysISO(todayISO, -29);
}
