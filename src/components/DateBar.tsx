import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  addDaysISO,
  formatDateFull,
  formatGregorianDate,
  getTodayISO,
} from '../lib/date';

interface DateBarProps {
  date: string;
  onChange: (nextDate: string) => void;
}

export const DateBar: React.FC<DateBarProps> = ({ date, onChange }) => {
  const { lang, isRTL, t } = useLanguage();
  const today = getTodayISO();
  const isToday = date === today;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 flex items-center justify-between gap-2">
      {/* Previous day button sits at inline-start; chevron flips per RTL/LTR */}
      <button
        type="button"
        onClick={() => onChange(addDaysISO(date, -1))}
        aria-label={t.common.prevDay}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#0F172A] hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
      >
        {isRTL ? (
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        ) : (
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
        <label className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <Calendar className="w-4 h-4 text-[#0F766E] shrink-0" aria-hidden="true" />
          <span className="text-sm md:text-base font-bold text-[#0F172A] tabular-nums whitespace-nowrap">
            {formatGregorianDate(date)}
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
            aria-label={t.common.selectDate}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
        <span className="text-xs text-[#64748B] truncate max-w-full">
          {formatDateFull(date, lang)}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!isToday && (
          <button
            type="button"
            onClick={() => onChange(today)}
            className="min-h-[40px] px-3 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs font-bold hover:bg-[#0F766E]/15 transition-colors whitespace-nowrap shrink-0"
          >
            {t.common.today}
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange(addDaysISO(date, 1))}
          aria-label={t.common.nextDay}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#0F172A] hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
        >
          {isRTL ? (
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};
