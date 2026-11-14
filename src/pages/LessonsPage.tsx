import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ClassFilter } from '../components/ClassFilter';
import { DateBar } from '../components/DateBar';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { StudentRow } from '../components/StudentRow';
import { useLanguage } from '../contexts/LanguageContext';
import { useAttendanceByDate } from '../hooks/useAttendance';
import { useClasses } from '../hooks/useClasses';
import { useLessonsByDate } from '../hooks/useLessonRecords';
import { useStudents } from '../hooks/useStudents';
import { getTodayISO } from '../lib/date';
import { getLessonLabel, LESSON_TYPES } from '../lib/grades';
import type { AttendanceStatus, LessonRecord, LessonType } from '../types/db';

export const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, isRTL, t } = useLanguage();
  const [date, setDate] = useState<string>(() => getTodayISO());
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    setVisibleCount(50);
  }, [selectedClassId]);

  const classesQuery = useClasses();
  const studentsQuery = useStudents({ includeArchived: false });
  const lessonsQuery = useLessonsByDate(date);
  const attendanceQuery = useAttendanceByDate(date);

  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of classesQuery.data ?? []) {
      map.set(c.id, c.name);
    }
    return map;
  }, [classesQuery.data]);

  const filteredStudents = useMemo(() => {
    const all = studentsQuery.data ?? [];
    if (selectedClassId === 'all') return all;
    return all.filter((s) => s.class_id === selectedClassId);
  }, [studentsQuery.data, selectedClassId]);

  const lessonMap = useMemo(() => {
    const map = new Map<string, Partial<Record<LessonType, LessonRecord>>>();
    for (const r of lessonsQuery.data ?? []) {
      const entry = map.get(r.student_id) ?? {};
      entry[r.lesson_type] = r;
      map.set(r.student_id, entry);
    }
    return map;
  }, [lessonsQuery.data]);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    for (const a of attendanceQuery.data ?? []) {
      map.set(a.student_id, a.status);
    }
    return map;
  }, [attendanceQuery.data]);

  const isLoading =
    classesQuery.isLoading || studentsQuery.isLoading || lessonsQuery.isLoading;
  const hasError =
    classesQuery.isError || studentsQuery.isError || lessonsQuery.isError;

  const refetchAll = () => {
    classesQuery.refetch();
    studentsQuery.refetch();
    lessonsQuery.refetch();
    attendanceQuery.refetch();
  };

  return (
    <AppShell title={t.lessons.title}>
      <div className="space-y-4">
        <DateBar date={date} onChange={setDate} />

        {(classesQuery.data?.length ?? 0) > 0 && (
          <ClassFilter
            classes={classesQuery.data ?? []}
            selectedClassId={selectedClassId}
            onSelect={setSelectedClassId}
          />
        )}

        {isLoading ? (
          <LoadingState />
        ) : hasError ? (
          <ErrorState onRetry={refetchAll} />
        ) : (studentsQuery.data?.length ?? 0) === 0 ? (
          <EmptyState
            title={t.attendance.noStudentsTitle}
            description={t.attendance.noStudentsBody}
            actionLabel={t.attendance.addFirstStudent}
            onAction={() => navigate('/students')}
            icon={<UserPlus className="w-7 h-7" aria-hidden="true" />}
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState title={t.attendance.noClassStudents} />
        ) : (
          <div className="space-y-2.5">
            {filteredStudents.slice(0, visibleCount).map((student) => {
              const studentLessons = lessonMap.get(student.id) ?? {};
              const attStatus = attendanceMap.get(student.id);
              const className = classMap.get(student.class_id) ?? '';
              const badgeText =
                attStatus === 'absent'
                  ? t.lessons.absentBadge
                  : attStatus === 'leave'
                    ? t.lessons.leaveBadge
                    : undefined;
              const badgeClassName =
                attStatus === 'absent' ? 'text-[#DC2626]' : 'text-[#D97706]';

              return (
                <StudentRow
                  key={student.id}
                  name={student.name}
                  subtitle={className}
                  badgeText={badgeText}
                  badgeClassName={badgeClassName}
                  to={`/lessons/${student.id}?date=${date}&class=${selectedClassId}`}
                  trailing={
                    isRTL ? (
                      <ChevronLeft
                        className="w-5 h-5 text-[#64748B] shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronRight
                        className="w-5 h-5 text-[#64748B] shrink-0"
                        aria-hidden="true"
                      />
                    )
                  }
                  footer={
                    <div className="mt-3 pt-2.5 border-t border-[#E2E8F0]/70 grid grid-cols-3 gap-2">
                      {LESSON_TYPES.map((lt) => {
                        const rec = studentLessons[lt];
                        const label = getLessonLabel(lt, lang);

                        if (!rec) {
                          return (
                            <div
                              key={lt}
                              className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-[#F6F8F7] text-xs font-medium text-[#64748B]"
                            >
                              <span>{label}</span>
                              <span aria-label={t.lessons.notRecorded}>–</span>
                            </div>
                          );
                        }

                        if (rec.heard) {
                          return (
                            <div
                              key={lt}
                              className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#16A34A]/10 text-xs font-bold text-[#15803D]"
                            >
                              <span>{label}</span>
                              <Check
                                className="w-3.5 h-3.5 shrink-0"
                                aria-label={t.lessons.heard}
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={lt}
                            className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#DC2626]/10 text-xs font-bold text-[#B91C1C]"
                          >
                            <span>{label}</span>
                            <X
                              className="w-3.5 h-3.5 shrink-0"
                              aria-label={t.lessons.notHeard}
                            />
                          </div>
                        );
                      })}
                    </div>
                  }
                />
              );
            })}

            {filteredStudents.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 50)}
                className="w-full min-h-[44px] rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold text-[#0F766E] hover:bg-[#F6F8F7] transition-colors"
              >
                {t.common.showMore} ({filteredStudents.length - visibleCount})
              </button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};
