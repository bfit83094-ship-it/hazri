import React, { useEffect } from 'react';
import { useT } from '../contexts/LanguageContext';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-xl">
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-[#0F172A] mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel ?? t.common.cancel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 ${
              destructive
                ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                : 'bg-[#0F766E] hover:bg-[#115E59]'
            }`}
          >
            {confirmLabel ?? t.common.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
