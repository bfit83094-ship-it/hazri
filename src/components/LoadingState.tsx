import React from 'react';
import { useT } from '../contexts/LanguageContext';

export const LoadingState: React.FC<{ message?: string; rows?: number }> = ({
  message,
  rows = 4,
}) => {
  const t = useT();

  return (
    <div className="space-y-3 py-4" role="status" aria-live="polite">
      <p className="text-sm text-[#64748B] text-center">
        {message ?? t.common.loading}
      </p>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-2xl bg-white border border-[#E2E8F0] p-4 flex items-center justify-between animate-pulse"
        >
          <div className="space-y-2 w-1/2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="h-9 bg-slate-100 rounded-xl w-28" />
        </div>
      ))}
    </div>
  );
};
