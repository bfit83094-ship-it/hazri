import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { DateBar } from '../components/DateBar';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LessonSection } from '../components/LessonSection';
import { LoadingState } from '../components/LoadingState';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useClasses } from '../hooks/useClasses';
import {
  useStudentLessonsByDate,
  useUpsertLessonRecord,
} from '../hooks/useLessonRecords';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStudent, useStudents } from '../hooks/useStudents';
import { getTodayISO } from '../lib/date';
import { LESSON_TYPES } from '../lib/grades';
import type { LessonRecord, LessonType, LessonUpsertInput } from '../types/db';

export const LessonEntryPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const { showToast } = useToast();

  const isOnline = useOnlineStatus();
  const date = searchParams.get('date') || getTodayISO();
  const classFilter = searchParams.get('class') || 'all';
  const [savingType, setSavingType] = useState<LessonType | null>(null);

  const studentQuery = useStudent(studentId);
  const classesQuery = useClasses();
  const allStudentsQuery = useStudents({ includeArchived: false });
  const lessonsQuery = useStudentLessonsByDate(studentId, date);
  const upsertMutation = useUpsertLessonRecord();

  const className = useMemo(() => {
    const stu = studentQuery.data;
    if (!stu) return '';
    return classesQuery.data?.find((c) => c.id === stu.class_id)?.name ?? '';
  }, [studentQuery.data, classesQuery.data]);

  const recordByType = useMemo(() => {
    const map: Partial<Record<LessonType, LessonRecord>> = {};
    for (const r of lessonsQuery.data ?? []) {
      map[r.lesson_type] = r;
    }
    return map;
  }, [lessonsQuery.data]);

  const nextStudent = useMemo(() => {
    const list = (allStudentsQuery.data ?? []).filter((s) =>
      classFilter === 'all' ? true : s.class_id === classFilter
    );
    const idx = list.findIndex((s) => s.id === studentId);
    if (idx === -1 || list.length <= 1) return null;
    return list[(idx + 1) % list.length];
  }, [allStudentsQuery.data, classFilter, studentId]);

  const handleDateChange = (nextDate: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('date', nextDate);
    setSearchParams(next, { replace: true });
  };

  const handleSave = async (payload: LessonUpsertInput) => {
    if (!isOnline) return;
    setSavingType(payload.lesson_type);
    try {
      await upsertMutation.mutateAsync(payload);
      showToast(t.common.saved, 'success');
    } catch {
      showToast(t.common.saveError, 'error');
    } finally {
      setSavingType(null);
    }
  };

  const isLoading = studentQuery.isLoading || lessonsQuery.isLoading;
  const hasError = studentQuery.isError || lessonsQuery.isError;

  return (
    <AppShell
      title={studentQuery.data?.name ?? t.lessons.title}
      backTo="/lessons"
      headerAction={
        nextStudent ? (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/lessons/${nextStudent.id}?date=${date}&class=${classFilter}`
              )
            }
            className="min-h-[40px] px-3 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs font-bold inline-flex items-center gap-1 hover:bg-[#0F766E] hover:text-white transition-colors whitespace-nowrap"
          >
            <span>{t.lessons.nextStudent}</span>
            {isRTL ? (
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState
          onRetry={() => {
            studentQuery.refetch();
            lessonsQuery.refetch();
          }}
        />
      ) : !studentQuery.data ? (
        <EmptyState
          title={t.studentDetail.studentNotFound}
          actionLabel={t.common.back}
          onAction={() => navigate('/lessons')}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 text-sm text-[#64748B]">
            <span>{className}</span>
            {studentQuery.data.roll_no && (
              <span>
                {t.students.rollNoLabel}: {studentQuery.data.roll_no}
              </span>
            )}
          </div>

          <DateBar date={date} onChange={handleDateChange} />

          {/* Exact required order: Sabaq -> Sabqi -> Manzil */}
          <div className="space-y-4">
            {LESSON_TYPES.map((lt) => (
              <LessonSection
                key={lt}
                studentId={studentQuery.data!.id}
                date={date}
                lessonType={lt}
                initialRecord={recordByType[lt] ?? null}
                disabled={!isOnline}
                saving={savingType === lt}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
};
