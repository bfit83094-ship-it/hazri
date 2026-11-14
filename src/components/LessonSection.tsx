import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus, Save, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { clampCount, getLessonLabel, normalizeLessonPayload } from '../lib/grades';
import type { Grade, LessonRecord, LessonType, LessonUpsertInput } from '../types/db';
import { GradeSelector } from './GradeSelector';

interface LessonSectionProps {
  studentId: string;
  date: string;
  lessonType: LessonType;
  initialRecord: LessonRecord | null;
  disabled?: boolean;
  saving?: boolean;
  onSave: (payload: LessonUpsertInput) => Promise<void>;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  studentId,
  date,
  lessonType,
  initialRecord,
  disabled = false,
  saving = false,
  onSave,
}) => {
  const { lang, t } = useLanguage();
  const title = getLessonLabel(lessonType, lang);
  const [heard, setHeard] = useState<boolean>(initialRecord?.heard ?? true);
  const [linesCount, setLinesCount] = useState<number>(initialRecord?.lines_count ?? 0);
  const [mistakesCount, setMistakesCount] = useState<number>(
    initialRecord?.mistakes_count ?? 0
  );
  const [grade, setGrade] = useState<Grade | null>(initialRecord?.grade ?? null);
  const [note, setNote] = useState<string>(initialRecord?.note ?? '');

  useEffect(() => {
    if (initialRecord) {
      setHeard(initialRecord.heard);
      setLinesCount(initialRecord.lines_count);
      setMistakesCount(initialRecord.mistakes_count);
      setGrade(initialRecord.grade);
      setNote(initialRecord.note ?? '');
    } else {
      setHeard(true);
      setLinesCount(0);
      setMistakesCount(0);
      setGrade(null);
      setNote('');
    }
  }, [initialRecord, studentId, date, lessonType]);

  const handleHeardChange = (nextHeard: boolean) => {
    setHeard(nextHeard);
    if (!nextHeard) {
      setLinesCount(0);
      setMistakesCount(0);
      setGrade(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = normalizeLessonPayload({
      student_id: studentId,
      record_date: date,
      lesson_type: lessonType,
      heard,
      lines_count: linesCount,
      mistakes_count: mistakesCount,
      grade,
      note,
    });
    await onSave(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
          {initialRecord && (
            <span className="text-xs text-[#0F766E] font-medium">
              · {t.common.saved}
            </span>
          )}
        </div>

        {/* Heard / Not Heard segmented switch */}
        <div
          role="radiogroup"
          aria-label={`${title} — ${t.lessons.heard}`}
          className="inline-flex rounded-xl bg-[#F6F8F7] p-1 border border-[#E2E8F0]"
        >
          <button
            type="button"
            role="radio"
            aria-checked={heard}
            disabled={disabled}
            onClick={() => handleHeardChange(true)}
            className={`min-h-[40px] px-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
              heard
                ? 'bg-[#16A34A] text-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>{t.lessons.heard}</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={!heard}
            disabled={disabled}
            onClick={() => handleHeardChange(false)}
            className={`min-h-[40px] px-3 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
              !heard
                ? 'bg-[#DC2626] text-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>{t.lessons.notHeard}</span>
          </button>
        </div>
      </div>

      {/* Steppers for Lines & Mistakes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Lines Count */}
        <div className="bg-[#F6F8F7] rounded-xl border border-[#E2E8F0] p-3">
          <label
            htmlFor={`${lessonType}-lines`}
            className="block text-xs font-semibold text-[#64748B] mb-2"
          >
            {t.lessons.lines}
          </label>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!heard || disabled}
              onClick={() => setLinesCount((v) => clampCount(v - 1))}
              aria-label={`${title} ${t.lessons.lines} ${t.lessons.decrease}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 disabled:opacity-40"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <input
              id={`${lessonType}-lines`}
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              disabled={!heard || disabled}
              value={linesCount}
              onChange={(e) => setLinesCount(clampCount(Number(e.target.value)))}
              className="w-20 text-center text-lg font-bold tabular-nums bg-white border border-[#E2E8F0] rounded-xl min-h-[44px] text-[#0F172A] disabled:opacity-45"
            />
            <button
              type="button"
              disabled={!heard || disabled}
              onClick={() => setLinesCount((v) => clampCount(v + 1))}
              aria-label={`${title} ${t.lessons.lines} ${t.lessons.increase}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mistakes Count */}
        <div className="bg-[#F6F8F7] rounded-xl border border-[#E2E8F0] p-3">
          <label
            htmlFor={`${lessonType}-mistakes`}
            className="block text-xs font-semibold text-[#64748B] mb-2"
          >
            {t.lessons.mistakes}
          </label>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!heard || disabled}
              onClick={() => setMistakesCount((v) => clampCount(v - 1))}
              aria-label={`${title} ${t.lessons.mistakes} ${t.lessons.decrease}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 disabled:opacity-40"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <input
              id={`${lessonType}-mistakes`}
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              disabled={!heard || disabled}
              value={mistakesCount}
              onChange={(e) => setMistakesCount(clampCount(Number(e.target.value)))}
              className="w-20 text-center text-lg font-bold tabular-nums bg-white border border-[#E2E8F0] rounded-xl min-h-[44px] text-[#0F172A] disabled:opacity-45"
            />
            <button
              type="button"
              disabled={!heard || disabled}
              onClick={() => setMistakesCount((v) => clampCount(v + 1))}
              aria-label={`${title} ${t.lessons.mistakes} ${t.lessons.increase}`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Grade */}
      <div>
        <span className="block text-xs font-semibold text-[#64748B] mb-2">
          {t.lessons.grade}
        </span>
        <GradeSelector
          value={grade}
          disabled={!heard || disabled}
          onChange={setGrade}
        />
      </div>

      {/* Note */}
      <div>
        <label
          htmlFor={`${lessonType}-note`}
          className="block text-xs font-semibold text-[#64748B] mb-1.5"
        >
          {t.lessons.note}
        </label>
        <textarea
          id={`${lessonType}-note`}
          rows={2}
          disabled={disabled}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.lessons.notePlaceholder}
          className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#64748B]/70 focus:bg-white focus:border-[#0F766E] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || saving}
        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#115E59] transition-colors disabled:opacity-50"
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        <span>
          {saving ? t.common.saving : `${title} ${t.common.save}`}
        </span>
      </button>
    </form>
  );
};
