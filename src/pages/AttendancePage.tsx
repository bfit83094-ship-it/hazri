import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AttendanceToggle } from '../components/AttendanceToggle';
import { ClassFilter } from '../components/ClassFilter';
import { DateBar } from '../components/DateBar';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { StudentRow } from '../components/StudentRow';
import { useT } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import {
  useAttendanceByDate,
  useMarkAllPresent,
  useUpsertAttendance,
} from '../hooks/useAttendance';
import { useClasses } from '../hooks/useClasses';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStudents } from '../hooks/useStudents';
import { getTodayISO, isFutureISO } from '../lib/date';
import { computeAttendanceSummary } from '../lib/grades';
import type { AttendanceStatus } from '../types/db';

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const t = useT();
  const [date, setDate] = useState<string>(() => getTodayISO());
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [savingStudentId, setSavingStudentId] = useState<string | null>(null);
  const [savedStudentId, setSavedStudentId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(50);
  const savedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setVisibleCount(50);
  }, [selectedClassId]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
    };
  }, []);

  const classesQuery = useClasses();
  const studentsQuery = useStudents({ includeArchived: false });
  const attendanceQuery = useAttendanceByDate(date);
  const upsertMutation = useUpsertAttendance(date);
  const markAllMutation = useMarkAllPresent(date);

  const isOnline = useOnlineStatus();
  const isFuture = isFutureISO(date);
  const actionsDisabled = isFuture || !isOnline;

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

  const statusMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    for (const r of attendanceQuery.data ?? []) {
      map.set(r.student_id, r.status);
    }
    return map;
  }, [attendanceQuery.data]);

  const summary = useMemo(
    () => computeAttendanceSummary(filteredStudents, attendanceQuery.data ?? []),
    [filteredStudents, attendanceQuery.data]
  );

  const handleToggle = async (studentId: string, status: AttendanceStatus) => {
    if (actionsDisabled) return;
    setSavingStudentId(studentId);
    try {
      await upsertMutation.mutateAsync({ studentId, status });
      setSavedStudentId(studentId);
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
      savedTimerRef.current = window.setTimeout(() => {
        setSavedStudentId((curr) => (curr === studentId ? null : curr));
      }, 1500);
    } catch {
      showToast(t.common.saveError, 'error');
    } finally {
      setSavingStudentId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (actionsDisabled) return;
    const unmarkedIds = filteredStudents
      .filter((s) => !statusMap.has(s.id))
      .map((s) => s.id);
    if (unmarkedIds.length === 0) return;

    try {
      await markAllMutation.mutateAsync(unmarkedIds);
      showToast(t.attendance.allMarkedToast, 'success');
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const isLoading =
    classesQuery.isLoading || studentsQuery.isLoading || attendanceQuery.isLoading;
  const hasError =
    classesQuery.isError || studentsQuery.isError || attendanceQuery.isError;

  const refetchAll = () => {
    classesQuery.refetch();
    studentsQuery.refetch();
    attendanceQuery.refetch();
  };

  return (
    <AppShell title={t.attendance.title}>
      <div className="space-y-4">
        <DateBar date={date} onChange={setDate} />

        {(classesQuery.data?.length ?? 0) > 0 && (
          <ClassFilter
            classes={classesQuery.data ?? []}
            selectedClassId={selectedClassId}
            onSelect={setSelectedClassId}
          />
        )}

        {isFuture && (
          <div
            role="alert"
            className="rounded-2xl bg-[#D97706]/10 border border-[#D97706]/30 p-3.5 flex items-center gap-2.5 text-sm font-medium text-[#B45309]"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t.attendance.futureWarning}</span>
          </div>
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
          <>
            {/* Summary strip + Mark All Present */}
            <div className="md:sticky md:top-[60px] md:z-20 bg-white rounded-2xl border border-[#E2E8F0] px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-xs">
              <div
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm tabular-nums"
                data-testid="attendance-summary"
              >
                <span className="font-bold text-[#16A34A]">
                  {t.attendance.present} {summary.present}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-bold text-[#DC2626]">
                  {t.attendance.absent} {summary.absent}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-bold text-[#D97706]">
                  {t.attendance.leave} {summary.leave}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-medium text-[#64748B]">
                  {t.attendance.unmarked} {summary.unmarked}
                </span>
              </div>

              <button
                type="button"
                disabled={
                  actionsDisabled || summary.unmarked === 0 || markAllMutation.isPending
                }
                onClick={handleMarkAllPresent}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 hover:bg-[#0F766E] hover:text-white transition-colors disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <CheckCheck className="w-4 h-4" aria-hidden="true" />
                <span>{t.attendance.markAllPresent}</span>
              </button>
            </div>

            {/* Student attendance list */}
            <div className="space-y-2.5">
              {filteredStudents.slice(0, visibleCount).map((student) => {
                const status = statusMap.get(student.id) ?? null;
                const className = classMap.get(student.class_id) ?? '';
                const isSaving = savingStudentId === student.id;
                const isSaved = !isSaving && savedStudentId === student.id;

                const subtitleParts = [
                  className,
                  student.roll_no,
                  isSaving
                    ? t.common.saving
                    : isSaved
                      ? t.common.saved
                      : null,
                ].filter(Boolean);

                return (
                  <StudentRow
                    key={student.id}
                    name={student.name}
                    subtitle={subtitleParts.join(' · ')}
                    to={`/students/${student.id}`}
                    trailing={
                      <div className="w-full sm:w-[340px]">
                        <AttendanceToggle
                          studentName={student.name}
                          value={status}
                          disabled={actionsDisabled}
                          onChange={(nextStatus) => handleToggle(student.id, nextStatus)}
                        />
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
          </>
        )}
      </div>
    </AppShell>
  );
};
