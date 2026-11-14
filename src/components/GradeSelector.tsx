import React from 'react';
import { useT } from '../contexts/LanguageContext';
import type { Grade } from '../types/db';

interface GradeSelectorProps {
  value: Grade | null;
  disabled?: boolean;
  onChange: (grade: Grade) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  value,
  disabled = false,
  onChange,
}) => {
  const t = useT();

  const gradeOptions: { value: Grade; label: string; activeClass: string }[] = [
    {
      value: 'acha',
      label: t.lessons.grades.acha,
      activeClass: 'bg-[#16A34A] text-white border-[#16A34A]',
    },
    {
      value: 'theek',
      label: t.lessons.grades.theek,
      activeClass: 'bg-[#D97706] text-white border-[#D97706]',
    },
    {
      value: 'kamzor',
      label: t.lessons.grades.kamzor,
      activeClass: 'bg-[#DC2626] text-white border-[#DC2626]',
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t.lessons.grade}
      className="grid grid-cols-3 gap-2"
    >
      {gradeOptions.map((opt) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`min-h-[44px] px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-150 whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed ${
              checked
                ? opt.activeClass
                : 'bg-[#F6F8F7] text-[#0F172A] border-[#E2E8F0] hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
