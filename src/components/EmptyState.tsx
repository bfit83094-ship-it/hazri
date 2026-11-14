import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4">
        {icon ?? <BookOpen className="w-7 h-7" aria-hidden="true" />}
      </div>
      <h2 className="text-lg font-semibold text-[#0F172A] mb-1">{title}</h2>
      {description && (
        <p className="text-sm text-[#64748B] max-w-sm mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
