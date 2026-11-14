import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useT } from '../contexts/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const t = useT();

  return (
    <div
      className="bg-white rounded-2xl border border-[#DC2626]/25 p-6 text-center flex flex-col items-center my-4"
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="text-base font-medium text-[#0F172A] mb-4">
        {message ?? t.common.saveError}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          {t.common.retry}
        </button>
      )}
    </div>
  );
};
