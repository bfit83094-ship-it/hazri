import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { AppLanguage } from '../types/db';

interface LanguageToggleProps {
  compact?: boolean;
}

const OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'ur', label: 'اردو' },
  { value: 'roman', label: 'Roman' },
];

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ compact = false }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label={t.settings.languageSection}
      className="inline-flex items-center rounded-xl bg-[#F6F8F7] p-1 border border-[#E2E8F0]"
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => void setLang(opt.value)}
            className={`${
              compact ? 'min-h-[36px] px-3 text-xs' : 'min-h-[40px] px-4 text-sm'
            } rounded-lg font-bold transition-colors whitespace-nowrap ${
              active
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
