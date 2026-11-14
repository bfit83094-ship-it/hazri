import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useT } from '../contexts/LanguageContext';

interface SheetModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const SheetModal: React.FC<SheetModalProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-sheet-up w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl border border-[#E2E8F0] shadow-2xl max-h-[90dvh] flex flex-col">
        {/* Mobile grab handle */}
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <span className="w-10 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
          <h2 id="sheet-modal-title" className="text-lg font-bold text-[#0F172A]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto pb-safe">{children}</div>
      </div>
    </div>
  );
};
