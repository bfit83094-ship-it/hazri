import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { validateStudentForm } from '../lib/grades';
import type { ClassItem, Student, StudentInput } from '../types/db';
import { SheetModal } from './SheetModal';

interface StudentFormSheetProps {
  open: boolean;
  classes: ClassItem[];
  initialStudent?: Student | null;
  defaultClassId?: string;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (input: StudentInput) => Promise<void>;
}

export const StudentFormSheet: React.FC<StudentFormSheetProps> = ({
  open,
  classes,
  initialStudent,
  defaultClassId,
  saving = false,
  onClose,
  onSubmit,
}) => {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; class_id?: string }>({});

  useEffect(() => {
    if (!open) return;
    if (initialStudent) {
      setName(initialStudent.name);
      setClassId(initialStudent.class_id);
      setFatherName(initialStudent.father_name ?? '');
      setRollNo(initialStudent.roll_no ?? '');
      setPhone(initialStudent.phone ?? '');
    } else {
      setName('');
      const fallbackClass =
        defaultClassId && defaultClassId !== 'all'
          ? defaultClassId
          : classes[0]?.id ?? '';
      setClassId(fallbackClass);
      setFatherName('');
      setRollNo('');
      setPhone('');
    }
    setErrors({});
  }, [open, initialStudent, defaultClassId, classes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: StudentInput = {
      name,
      class_id: classId,
      father_name: fatherName || null,
      roll_no: rollNo || null,
      phone: phone || null,
    };
    const check = validateStudentForm(input, lang);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    await onSubmit(input);
  };

  return (
    <SheetModal
      open={open}
      onClose={onClose}
      title={initialStudent ? t.students.editStudent : t.students.addStudent}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="student-name"
            className="block text-sm font-semibold text-[#0F172A] mb-1.5"
          >
            {t.students.nameLabel}{' '}
            <span className="text-[#DC2626]" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder={t.students.namePlaceholder}
            className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
          />
          {errors.name && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#DC2626]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-class"
            className="block text-sm font-semibold text-[#0F172A] mb-1.5"
          >
            {t.students.classLabel}{' '}
            <span className="text-[#DC2626]" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="student-class"
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              if (errors.class_id)
                setErrors((prev) => ({ ...prev, class_id: undefined }));
            }}
            className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.class_id && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#DC2626]">
              {errors.class_id}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-father"
            className="block text-sm font-semibold text-[#0F172A] mb-1.5"
          >
            {t.students.fatherNameLabel}{' '}
            <span className="text-xs font-normal text-[#64748B]">
              ({t.common.optional})
            </span>
          </label>
          <input
            id="student-father"
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            placeholder={t.students.fatherNamePlaceholder}
            className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="student-roll"
              className="block text-sm font-semibold text-[#0F172A] mb-1.5"
            >
              {t.students.rollNoLabel}
            </label>
            <input
              id="student-roll"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder={t.students.rollNoPlaceholder}
              className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label
              htmlFor="student-phone"
              className="block text-sm font-semibold text-[#0F172A] mb-1.5"
            >
              {t.students.phoneLabel}
            </label>
            <input
              id="student-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.students.phonePlaceholder}
              className="w-full min-h-[44px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-3.5 py-2 text-base text-[#0F172A] focus:bg-white focus:border-[#0F766E]"
            />
          </div>
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
