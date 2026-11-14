import React from 'react';
import { Check, Clock, X } from 'lucide-react';
import { useT } from '../contexts/LanguageContext';
import type { AttendanceStatus } from '../types/db';

interface AttendanceToggleProps {
  studentName: string;
  value: AttendanceStatus | null;
  disabled?: boolean;
  onChange: (status: AttendanceStatus) => void;
}

export const AttendanceToggle: React.FC<AttendanceToggleProps> = ({
  studentName,
  value,
  disabled = false,
  onChange,
}) => {
  const t = useT();

  const options: {
    status: AttendanceStatus;
    label: string;
    activeClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      status: 'present',
      label: t.attendance.present,
      activeClass: 'bg-[#16A34A] text-white border-[#16A34A]',
      Icon: Check,
    },
    {
      status: 'absent',
      label: t.attendance.absent,
      activeClass: 'bg-[#DC2626] text-white border-[#DC2626]',
      Icon: X,
    },
    {
      status: 'leave',
      label: t.attendance.leave,
      activeClass: 'bg-[#D97706] text-white border-[#D97706]',
      Icon: Clock,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={`${studentName} — ${t.attendance.title}`}
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1fr)] gap-1.5"
    >
      {options.map(({ status, label, activeClass, Icon }) => {
        const checked = value === status;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(status)}
            className={`min-h-[44px] px-2 py-2 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all duration-150 whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              checked
                ? activeClass
                : 'bg-[#F6F8F7] text-[#0F172A] border-[#E2E8F0] hover:bg-slate-100'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
