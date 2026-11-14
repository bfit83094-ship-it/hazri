import React from 'react';
import { useT } from '../contexts/LanguageContext';
import type { ClassItem } from '../types/db';

interface ClassFilterProps {
  classes: ClassItem[];
  selectedClassId: string;
  onSelect: (classId: string) => void;
}

export const ClassFilter: React.FC<ClassFilterProps> = ({
  classes,
  selectedClassId,
  onSelect,
}) => {
  const t = useT();

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
      role="tablist"
      aria-label={t.students.classLabel}
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedClassId === 'all'}
        onClick={() => onSelect('all')}
        className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 border ${
          selectedClassId === 'all'
            ? 'bg-[#0F766E] text-white border-[#0F766E]'
            : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50'
        }`}
      >
        {t.common.allClasses}
      </button>

      {classes.map((cls) => {
        const active = selectedClassId === cls.id;
        return (
          <button
            key={cls.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(cls.id)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 border ${
              active
                ? 'bg-[#0F766E] text-white border-[#0F766E]'
                : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {cls.name}
          </button>
        );
      })}
    </div>
  );
};
