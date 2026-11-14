import React, { useMemo, useState } from 'react';
import { BookOpen, Check, Pencil, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AttendanceToggle } from '../components/AttendanceToggle';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LessonSection } from '../components/LessonSection';
import { LoadingState } from '../components/LoadingState';
import { SheetModal } from '../components/SheetModal';
import { StudentFormSheet } from '../components/StudentFormSheet';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import {
  useStudentAttendance,
  useUpsertAttendance,
} from '../hooks/useAttendance';
import { useClasses } from '../hooks/useClasses';
import {
  useStudentLessons,
  useUpsertLessonRecord,
} from '../hooks/useLessonRecords';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStudent, useUpdateStudent } from '../hooks/useStudents';
import {
  type DateRangePreset,
  formatDateFull,
  formatGregorianDate,
  formatWeekday,
  getRangeStartISO,
  getTodayISO,
  isFutureISO,
} from '../lib/date';
import {
  buildStudentHistoryAndStats,
  getAttendanceLabel,
  getGradeLabel,
  getGradeStyle,
  getLessonLabel,
  LESSON_TYPES,
  type StudentDayHistory,
} from '../lib/grades';
import type {
  AttendanceStatus,
  LessonRecord,
  LessonType,
  LessonUpsertInput,
  StudentInput,
} from '../types/db';

export const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();

  const rangeOptions: { key: DateRangePreset; label: string }[] = [
    { key: 'week', label: t.studentDetail.rangeWeek },
    { key: 'month', label: t.studentDetail.rangeMonth },
    { key: 'all', label: t.studentDetail.rangeAll },
    { key: 'custom', label: t.studentDetail.rangeCustom },
  ];

  const today = getTodayISO();
  const [rangePreset, setRangePreset] = useState<DateRangePreset>('month');
  const [customStart, setCustomStart] = useState<string>(() =>
    getRangeStartISO('month', today) ?? today
  );
  const [customEnd, setCustomEnd] = useState<string>(today);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<StudentDayHistory | null>(null);
  const [savingLessonType, setSavingLessonType] = useState<LessonType | null>(null);

  const startDate =
    rangePreset === 'custom'
      ? customStart || null
      : getRangeStartISO(rangePreset, today);
  const endDate = rangePreset === 'custom' ? customEnd || null : null;

  const studentQuery = useStudent(studentId);
  const classesQuery = useClasses();
  const attendanceQuery = useStudentAttendance(studentId, startDate, endDate);
  const lessonsQuery = useStudentLessons(studentId, startDate, endDate);

  const updateStudentMutation = useUpdateStudent();
  const upsertAttendanceMutation = useUpsertAttendance(editingDay?.date ?? today);
  const upsertLessonMutation = useUpsertLessonRecord();

  const className = useMemo(() => {
    if (!studentQuery.data) return '';
    return (
      classesQuery.data?.find((c) => c.id === studentQuery.data!.class_id)?.name ?? ''
    );
  }, [studentQuery.data, classesQuery.data]);

  const { history, stats } = useMemo(
    () =>
      buildStudentHistoryAndStats(
        attendanceQuery.data ?? [],
        lessonsQuery.data ?? [],
        startDate,
        endDate
      ),
    [attendanceQuery.data, lessonsQuery.data, startDate, endDate]
  );

  // Keep editingDay synced with latest query data
  const activeEditingDay = useMemo(() => {
    if (!editingDay) return null;
    return history.find((h) => h.date === editingDay.date) ?? editingDay;
  }, [editingDay, history]);

  const handleUpdateStudent = async (input: StudentInput) => {
    if (!studentId) return;
    try {
      await updateStudentMutation.mutateAsync({ id: studentId, input });
      showToast(t.students.updatedToast, 'success');
      setEditStudentOpen(false);
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const handleSaveDayAttendance = async (status: AttendanceStatus) => {
    if (!studentId || !activeEditingDay) return;
    if (isFutureISO(activeEditingDay.date)) return;
    try {
      await upsertAttendanceMutation.mutateAsync({
        studentId,
        status,
        targetDate: activeEditingDay.date,
      });
      showToast(t.common.saved, 'success');
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const handleSaveDayLesson = async (payload: LessonUpsertInput) => {
    setSavingLessonType(payload.lesson_type);
    try {
      await upsertLessonMutation.mutateAsync(payload);
      showToast(t.common.saved, 'success');
    } catch {
      showToast(t.common.saveError, 'error');
    } finally {
      setSavingLessonType(null);
    }
  };

  const isLoading =
    studentQuery.isLoading || attendanceQuery.isLoading || lessonsQuery.isLoading;
  const hasError =
    studentQuery.isError || attendanceQuery.isError || lessonsQuery.isError;

  const renderLessonSummaryBlock = (type: LessonType, rec: LessonRecord | null) => {
    const label = getLessonLabel(type, lang);
    const gradeStyle = getGradeStyle(rec?.grade ?? null);

    return (
      <div
        key={type}
        className="rounded-xl bg-[#F6F8F7] border border-[#E2E8F0] p-2.5 space-y-1"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#0F172A]">{label}</span>
          {!rec ? (
            <span className="text-xs text-[#64748B]">{t.lessons.notRecorded}</span>
          ) : rec.heard ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D]">
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.lessons.heard}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B91C1C]">
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.lessons.notHeard}</span>
            </span>
          )}
        </div>

        {rec?.heard && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748B] tabular-nums">
            <span>
              {t.lessons.lines}: <strong className="text-[#0F172A]">{rec.lines_count}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t.lessons.mistakes}:{' '}
              <strong className="text-[#0F172A]">{rec.mistakes_count}</strong>
            </span>
            {rec.grade && (
              <>
                <span aria-hidden="true">·</span>
                <span className={`font-bold ${gradeStyle.text}`}>
                  {getGradeLabel(rec.grade, lang)}
                </span>
              </>
            )}
          </div>
        )}

        {rec?.note && (
          <p className="text-xs text-[#64748B] line-clamp-2 pt-0.5">{rec.note}</p>
        )}
      </div>
    );
  };

  return (
    <AppShell
      title={studentQuery.data?.name ?? t.studentDetail.title}
      backTo="/students"
      headerAction={
        studentQuery.data ? (
          <div className="flex items-center gap-2">
            <Link
              to={`/lessons/${studentQuery.data.id}?date=${today}`}
              className="min-h-[40px] px-3 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#0F766E] hover:text-white transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{t.lessons.sabaq}</span>
            </Link>
            <button
              type="button"
              disabled={!isOnline}
              onClick={() => setEditStudentOpen(true)}
              aria-label={t.students.editStudent}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Pencil className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : undefined
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState
          onRetry={() => {
            studentQuery.refetch();
            attendanceQuery.refetch();
            lessonsQuery.refetch();
          }}
        />
      ) : !studentQuery.data ? (
        <EmptyState
          title={t.studentDetail.studentNotFound}
          actionLabel={t.common.back}
          onAction={() => navigate('/students')}
        />
      ) : (
        <div className="space-y-5">
          {/* Student Header Summary */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[#64748B]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-[#0F766E]">{className}</span>
              {studentQuery.data.father_name && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t.students.fatherNameLabel}: {studentQuery.data.father_name}
                  </span>
                </>
              )}
              {studentQuery.data.roll_no && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {t.students.rollNoLabel}: {studentQuery.data.roll_no}
                  </span>
                </>
              )}
              {studentQuery.data.phone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums" dir="ltr">
                    {studentQuery.data.phone}
                  </span>
                </>
              )}
            </div>
            {!studentQuery.data.is_active && (
              <span className="text-xs font-bold text-[#B45309]">
                {t.students.archivedTag}
              </span>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E2E8F0]">
              {rangeOptions.map((opt) => {
                const active = rangePreset === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRangePreset(opt.key)}
                    className={`min-h-[42px] rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#0F766E] text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {rangePreset === 'custom' && (
              <div className="grid grid-cols-2 gap-2.5 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
                <div>
                  <label
                    htmlFor="range-from"
                    className="block text-xs font-semibold text-[#64748B] mb-1"
                  >
                    {t.studentDetail.fromDate}
                  </label>
                  <input
                    id="range-from"
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full min-h-[40px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-2.5 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="range-to"
                    className="block text-xs font-semibold text-[#64748B] mb-1"
                  >
                    {t.studentDetail.toDate}
                  </label>
                  <input
                    id="range-to"
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full min-h-[40px] rounded-xl border border-[#E2E8F0] bg-[#F6F8F7] px-2.5 text-sm tabular-nums"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2x2 / 4-col Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <p className="text-xs font-medium text-[#64748B]">
                {t.studentDetail.attendancePct}
              </p>
              <p className="text-2xl font-bold text-[#0F766E] tabular-nums mt-1">
                {stats.attendancePercent}%
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <p className="text-xs font-medium text-[#64748B]">
                {t.studentDetail.sabaqDays}
              </p>
              <p className="text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                {stats.sabaqHeardDays}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <p className="text-xs font-medium text-[#64748B]">
                {t.studentDetail.avgLines}
              </p>
              <p className="text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                {stats.averageSabaqLines}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <p className="text-xs font-medium text-[#64748B]">
                {t.studentDetail.presentCount} / {t.studentDetail.absentCount} /{' '}
                {t.studentDetail.leaveCount}
              </p>
              <p className="text-lg md:text-xl font-bold text-[#0F172A] tabular-nums mt-1.5">
                <span className="text-[#16A34A]">{stats.presentCount}</span>
                <span className="text-slate-300 mx-1">/</span>
                <span className="text-[#DC2626]">{stats.absentCount}</span>
                <span className="text-slate-300 mx-1">/</span>
                <span className="text-[#D97706]">{stats.leaveCount}</span>
              </p>
            </div>
          </div>

          {/* Date-wise History List */}
          <section aria-labelledby="history-heading" className="space-y-3">
            <h2
              id="history-heading"
              className="text-base font-bold text-[#0F172A]"
            >
              {t.studentDetail.historyTitle}
            </h2>

            {history.length === 0 ? (
              <EmptyState title={t.studentDetail.noRecords} />
            ) : (
              <div className="space-y-3">
                {history.map((day) => {
                  const attStatus = day.attendance?.status ?? null;
                  const attColor =
                    attStatus === 'present'
                      ? 'text-[#15803D] bg-[#16A34A]/10'
                      : attStatus === 'absent'
                        ? 'text-[#B91C1C] bg-[#DC2626]/10'
                        : attStatus === 'leave'
                          ? 'text-[#B45309] bg-[#D97706]/10'
                          : 'text-[#64748B] bg-slate-100';

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setEditingDay(day)}
                      className="w-full text-start bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#0F766E]/45 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-[#0F172A] tabular-nums">
                            {formatGregorianDate(day.date)}
                          </span>
                          <span
                            aria-hidden="true"
                            className="mx-1.5 text-slate-300"
                          >
                            ·
                          </span>
                          <span className="text-xs text-[#64748B]">
                            {formatWeekday(day.date, lang)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${attColor}`}
                          >
                            {attStatus
                              ? getAttendanceLabel(attStatus, lang)
                              : t.attendance.unmarked}
                          </span>
                          <Pencil
                            className="w-3.5 h-3.5 text-[#64748B]"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {renderLessonSummaryBlock('sabaq', day.sabaq)}
                        {renderLessonSummaryBlock('sabqi', day.sabqi)}
                        {renderLessonSummaryBlock('manzil', day.manzil)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      <StudentFormSheet
        open={editStudentOpen}
        classes={classesQuery.data ?? []}
        initialStudent={studentQuery.data}
        saving={updateStudentMutation.isPending}
        onClose={() => setEditStudentOpen(false)}
        onSubmit={handleUpdateStudent}
      />

      <SheetModal
        open={Boolean(activeEditingDay)}
        onClose={() => setEditingDay(null)}
        title={
          activeEditingDay
            ? `${t.studentDetail.editDayTitle} — ${formatDateFull(
                activeEditingDay.date,
                lang
              )}`
            : t.studentDetail.editDayTitle
        }
      >
        {activeEditingDay && studentQuery.data && (
          <div className="space-y-4">
            <div className="bg-[#F6F8F7] rounded-2xl border border-[#E2E8F0] p-3.5 space-y-2">
              <p className="text-xs font-bold text-[#64748B]">
                {t.attendance.title}
              </p>
              <AttendanceToggle
                studentName={studentQuery.data.name}
                value={activeEditingDay.attendance?.status ?? null}
                disabled={!isOnline || isFutureISO(activeEditingDay.date)}
                onChange={handleSaveDayAttendance}
              />
            </div>

            {LESSON_TYPES.map((lt) => (
              <LessonSection
                key={lt}
                studentId={studentQuery.data!.id}
                date={activeEditingDay.date}
                lessonType={lt}
                initialRecord={activeEditingDay[lt]}
                disabled={!isOnline}
                saving={savingLessonType === lt}
                onSave={handleSaveDayLesson}
              />
            ))}
          </div>
        )}
      </SheetModal>
    </AppShell>
  );
};
