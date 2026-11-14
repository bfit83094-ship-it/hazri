import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useT } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useToast();
  const t = useT();

  if (!toast) return null;

  const styles =
    toast.variant === 'success'
      ? 'bg-[#0F766E] text-white border-[#115E59]'
      : toast.variant === 'error'
        ? 'bg-[#DC2626] text-white border-[#B91C1C]'
        : 'bg-[#0F172A] text-white border-slate-800';

  const Icon =
    toast.variant === 'success'
      ? CheckCircle2
      : toast.variant === 'error'
        ? AlertCircle
        : Info;

  return (
    <div
      className="fixed top-4 inset-x-4 z-50 flex justify-center pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto animate-toast-in flex items-center gap-3 rounded-xl border px-4 py-2.5 shadow-lg max-w-md ${styles}`}
      >
        <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          type="button"
          onClick={dismissToast}
          aria-label={t.common.close}
          className="ms-1 p-1 rounded-lg hover:bg-white/15 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
