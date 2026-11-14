import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { validateClassName } from '../lib/grades';
import type { ClassItem } from '../types/db';
import { SheetModal } from './SheetModal';

interface ClassFormSheetProps {
  open: boolean;
  existingClasses: ClassItem[];
  initialClass?: ClassItem | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export const ClassFormSheet: React.FC<ClassFormSheetProps> = ({
  open,
  existingClasses,
  initialClass,
  saving = false,
  onClose,
  onSubmit,
}) => {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(initialClass?.name ?? '');
    setError(null);
  }, [open, initialClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateClassName(name, existingClasses, initialClass?.id, lang);
    if (err) {
      setError(err);
      return;
    }
    await onSubmit(name.trim());
  };

  return (
    <SheetModal
      open={open}
      onClose={onClose}
      title={initialClass ? t.classes.editClass : t.classes.addClass}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="class-name"
            className="block text-sm font-semibold text-[#0F172A] mb-1.5"
          >
            {t.classes.nameLabel}{' '}
            <span className="text-[#DC2626]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="class-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t.classes.namePlaceholder}
            className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
          />
          {error && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#DC2626]">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 min-h-[44px] rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm font-semibold hover:bg-slate-50"
          >
            {t.common.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 min-h-[44px] rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#115E59] disabled:opacity-50"
          >
            {saving ? t.common.saving : t.common.save}
          </button>
        </div>
      </form>
    </SheetModal>
  );
};
