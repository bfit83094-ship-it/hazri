import { getDictionary } from '../i18n';
import type {
  AppLanguage,
  AttendanceRecord,
  AttendanceStatus,
  Grade,
  LessonRecord,
  LessonType,
  LessonUpsertInput,
  Student,
  StudentInput,
} from '../types/db';

export const LESSON_TYPES: readonly LessonType[] = ['sabaq', 'sabqi', 'manzil'];
export const GRADES: readonly Grade[] = ['acha', 'theek', 'kamzor'];

export function getLessonLabel(type: LessonType, lang: AppLanguage = 'ur'): string {
  return getDictionary(lang).lessons[type];
}

export function getGradeLabel(grade: Grade | null, lang: AppLanguage = 'ur'): string {
  if (!grade) return '—';
  return getDictionary(lang).lessons.grades[grade];
}

export function getGradeStyle(grade: Grade | null): {
  bg: string;
  text: string;
  border: string;
} {
  switch (grade) {
    case 'acha':
      return {
        bg: 'bg-[#16A34A]/10',
        text: 'text-[#15803D]',
        border: 'border-[#16A34A]/30',
      };
    case 'theek':
      return {
        bg: 'bg-[#D97706]/10',
        text: 'text-[#B45309]',
        border: 'border-[#D97706]/30',
      };
    case 'kamzor':
      return {
        bg: 'bg-[#DC2626]/10',
        text: 'text-[#B91C1C]',
        border: 'border-[#DC2626]/30',
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
      };
  }
}

export function getAttendanceLabel(
  status: AttendanceStatus,
  lang: AppLanguage = 'ur'
): string {
  return getDictionary(lang).attendance[status];
}

export function clampCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(999, Math.floor(value)));
}

/**
 * Enforces schema CHECK constraint:
 * If heard = false => lines_count = 0, mistakes_count = 0, grade = null
 */
export function normalizeLessonPayload(input: LessonUpsertInput): LessonUpsertInput {
  const trimmedNote = input.note ? input.note.trim() : '';
  if (!input.heard) {
    return {
      ...input,
      heard: false,
      lines_count: 0,
      mistakes_count: 0,
      grade: null,
      note: trimmedNote.length > 0 ? trimmedNote : null,
    };
  }

  return {
    ...input,
    heard: true,
    lines_count: clampCount(input.lines_count),
    mistakes_count: clampCount(input.mistakes_count),
    grade: input.grade && GRADES.includes(input.grade) ? input.grade : null,
    note: trimmedNote.length > 0 ? trimmedNote : null,
  };
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  leave: number;
  unmarked: number;
  total: number;
}

export function computeAttendanceSummary(
  students: Pick<Student, 'id'>[],
  records: Pick<AttendanceRecord, 'student_id' | 'status'>[]
): AttendanceSummary {
  const statusMap = new Map<string, AttendanceStatus>();
  for (const r of records) {
    statusMap.set(r.student_id, r.status);
  }

  let present = 0;
  let absent = 0;
  let leave = 0;
  let unmarked = 0;

  for (const s of students) {
    const st = statusMap.get(s.id);
    if (st === 'present') present += 1;
    else if (st === 'absent') absent += 1;
    else if (st === 'leave') leave += 1;
    else unmarked += 1;
  }

  return {
    present,
    absent,
    leave,
    unmarked,
    total: students.length,
  };
}

export interface StudentDayHistory {
  date: string;
  attendance: AttendanceRecord | null;
  sabaq: LessonRecord | null;
  sabqi: LessonRecord | null;
  manzil: LessonRecord | null;
}

export interface StudentStats {
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  attendancePercent: number;
  sabaqHeardDays: number;
  averageSabaqLines: number;
}

export function buildStudentHistoryAndStats(
  attendance: AttendanceRecord[],
  lessons: LessonRecord[],
  startDate: string | null = null,
  endDate: string | null = null
): { history: StudentDayHistory[]; stats: StudentStats } {
  const inRange = (d: string) => {
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  const dayMap = new Map<string, StudentDayHistory>();
  const ensureDay = (date: string): StudentDayHistory => {
    let entry = dayMap.get(date);
    if (!entry) {
      entry = { date, attendance: null, sabaq: null, sabqi: null, manzil: null };
      dayMap.set(date, entry);
    }
    return entry;
  };

  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  for (const a of attendance) {
    if (!inRange(a.attendance_date)) continue;
    ensureDay(a.attendance_date).attendance = a;
    if (a.status === 'present') presentCount += 1;
    else if (a.status === 'absent') absentCount += 1;
    else if (a.status === 'leave') leaveCount += 1;
  }

  let sabaqHeardDays = 0;
  let sabaqTotalLines = 0;

  for (const l of lessons) {
    if (!inRange(l.record_date)) continue;
    const day = ensureDay(l.record_date);
    day[l.lesson_type] = l;
    if (l.lesson_type === 'sabaq' && l.heard) {
      sabaqHeardDays += 1;
      sabaqTotalLines += l.lines_count;
    }
  }

  const totalMarked = presentCount + absentCount + leaveCount;
  const attendancePercent =
    totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;
  const averageSabaqLines =
    sabaqHeardDays > 0 ? Math.round((sabaqTotalLines / sabaqHeardDays) * 10) / 10 : 0;

  const history = Array.from(dayMap.values()).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return {
    history,
    stats: {
      presentCount,
      absentCount,
      leaveCount,
      attendancePercent,
      sabaqHeardDays,
      averageSabaqLines,
    },
  };
}

export function validateStudentForm(
  input: StudentInput,
  lang: AppLanguage = 'ur'
): {
  valid: boolean;
  errors: { name?: string; class_id?: string };
} {
  const dict = getDictionary(lang);
  const errors: { name?: string; class_id?: string } = {};
  const trimmedName = input.name.trim();
  if (trimmedName.length < 1 || trimmedName.length > 100) {
    errors.name = dict.students.nameRequiredError;
  }
  if (!input.class_id || input.class_id.trim().length === 0) {
    errors.class_id = dict.students.classRequiredError;
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateClassName(
  name: string,
  existingClasses: { id: string; name: string }[],
  excludeId?: string,
  lang: AppLanguage = 'ur'
): string | null {
  const dict = getDictionary(lang);
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return dict.classes.nameRequiredError;
  }
  const duplicate = existingClasses.some(
    (c) => c.id !== excludeId && c.name.trim() === trimmed
  );
  if (duplicate) {
    return dict.classes.duplicateNameError;
  }
  return null;
}
