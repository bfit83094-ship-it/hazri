import { addDaysISO, getTodayISO } from '../lib/date';
import { normalizeLessonPayload } from '../lib/grades';
import type {
  AppLanguage,
  AttendanceRecord,
  AttendanceStatus,
  ClassItem,
  LessonRecord,
  LessonUpsertInput,
  Profile,
  Student,
  StudentInput,
} from '../types/db';

const PREVIEW_USER_ID = 'preview-ustaad-001';

function createInitialData() {
  const today = getTodayISO();
  const yesterday = addDaysISO(today, -1);
  const twoDaysAgo = addDaysISO(today, -2);
  const nowIso = new Date().toISOString();

  const profile: Profile = {
    id: PREVIEW_USER_ID,
    full_name: 'حافظ محمد طارق',
    email: 'ustaad@madrasahazri.example',
    avatar_url: null,
    language: 'ur',
    created_at: nowIso,
  };

  const classes: ClassItem[] = [
    { id: 'cls-hifz', user_id: PREVIEW_USER_ID, name: 'درجہ حفظ', sort_order: 1, created_at: nowIso },
    { id: 'cls-1', user_id: PREVIEW_USER_ID, name: 'کلاس 1', sort_order: 2, created_at: nowIso },
    { id: 'cls-2', user_id: PREVIEW_USER_ID, name: 'کلاس 2', sort_order: 3, created_at: nowIso },
    { id: 'cls-3', user_id: PREVIEW_USER_ID, name: 'کلاس 3', sort_order: 4, created_at: nowIso },
  ];

  const students: Student[] = [
    {
      id: 'stu-1',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-hifz',
      name: 'محمد عبداللہ',
      father_name: 'محمد خالد',
      roll_no: '101',
      phone: '03001234567',
      is_active: true,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'stu-2',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-hifz',
      name: 'حذیفہ احمد',
      father_name: 'رشید احمد',
      roll_no: '102',
      phone: '03017654321',
      is_active: true,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'stu-3',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-hifz',
      name: 'انس بن وقاص',
      father_name: 'وقاص علی',
      roll_no: '103',
      phone: null,
      is_active: true,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'stu-4',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-1',
      name: 'بلال حسن',
      father_name: 'غلام حسن',
      roll_no: '201',
      phone: null,
      is_active: true,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'stu-5',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-1',
      name: 'سعد رحمان',
      father_name: 'عبدالرحمان',
      roll_no: '202',
      phone: null,
      is_active: true,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'stu-6',
      user_id: PREVIEW_USER_ID,
      class_id: 'cls-2',
      name: 'عثمان فاروق',
      father_name: 'محمد فاروق',
      roll_no: '301',
      phone: null,
      is_active: false,
      created_at: nowIso,
      updated_at: nowIso,
    },
  ];

  const attendance: AttendanceRecord[] = [
    { id: 'att-1', user_id: PREVIEW_USER_ID, student_id: 'stu-1', attendance_date: today, status: 'present', created_at: nowIso, updated_at: nowIso },
    { id: 'att-2', user_id: PREVIEW_USER_ID, student_id: 'stu-2', attendance_date: today, status: 'present', created_at: nowIso, updated_at: nowIso },
    { id: 'att-3', user_id: PREVIEW_USER_ID, student_id: 'stu-1', attendance_date: yesterday, status: 'present', created_at: nowIso, updated_at: nowIso },
    { id: 'att-4', user_id: PREVIEW_USER_ID, student_id: 'stu-2', attendance_date: yesterday, status: 'leave', created_at: nowIso, updated_at: nowIso },
    { id: 'att-5', user_id: PREVIEW_USER_ID, student_id: 'stu-1', attendance_date: twoDaysAgo, status: 'present', created_at: nowIso, updated_at: nowIso },
  ];

  const lessonRecords: LessonRecord[] = [
    {
      id: 'les-1',
      user_id: PREVIEW_USER_ID,
      student_id: 'stu-1',
      record_date: today,
      lesson_type: 'sabaq',
      heard: true,
      lines_count: 15,
      mistakes_count: 1,
      grade: 'acha',
      note: 'پارہ 12، سورۃ ہود',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'les-2',
      user_id: PREVIEW_USER_ID,
      student_id: 'stu-1',
      record_date: today,
      lesson_type: 'sabqi',
      heard: true,
      lines_count: 30,
      mistakes_count: 2,
      grade: 'theek',
      note: null,
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'les-3',
      user_id: PREVIEW_USER_ID,
      student_id: 'stu-1',
      record_date: yesterday,
      lesson_type: 'sabaq',
      heard: true,
      lines_count: 13,
      mistakes_count: 0,
      grade: 'acha',
      note: 'بہترین روانگی',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'les-4',
      user_id: PREVIEW_USER_ID,
      student_id: 'stu-1',
      record_date: yesterday,
      lesson_type: 'manzil',
      heard: true,
      lines_count: 120,
      mistakes_count: 4,
      grade: 'theek',
      note: 'پارہ 10 مکمل',
      created_at: nowIso,
      updated_at: nowIso,
    },
    {
      id: 'les-5',
      user_id: PREVIEW_USER_ID,
      student_id: 'stu-1',
      record_date: twoDaysAgo,
      lesson_type: 'sabaq',
      heard: false,
      lines_count: 0,
      mistakes_count: 0,
      grade: null,
      note: 'سبق یاد نہیں تھا',
      created_at: nowIso,
      updated_at: nowIso,
    },
  ];

  return { profile, classes, students, attendance, lessonRecords };
}

let state = createInitialData();
let idCounter = 100;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const previewStore = {
  userId: PREVIEW_USER_ID,

  reset() {
    state = createInitialData();
  },

  getProfile(): Profile {
    return { ...state.profile };
  },

  updateLanguage(language: AppLanguage): Profile {
    state.profile.language = language;
    return { ...state.profile };
  },

  listClasses(): ClassItem[] {
    return [...state.classes].sort((a, b) => a.sort_order - b.sort_order);
  },

  createClass(name: string): ClassItem {
    const trimmed = name.trim();
    if (state.classes.some((c) => c.name === trimmed)) {
      throw new Error('CLASS_DUPLICATE');
    }
    const maxOrder = state.classes.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const created: ClassItem = {
      id: nextId('cls'),
      user_id: PREVIEW_USER_ID,
      name: trimmed,
      sort_order: maxOrder + 1,
      created_at: new Date().toISOString(),
    };
    state.classes.push(created);
    return { ...created };
  },

  updateClass(id: string, patch: { name?: string; sort_order?: number }): ClassItem {
    const idx = state.classes.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('CLASS_NOT_FOUND');
    if (patch.name !== undefined) {
      const trimmed = patch.name.trim();
      if (state.classes.some((c) => c.id !== id && c.name === trimmed)) {
        throw new Error('CLASS_DUPLICATE');
      }
      state.classes[idx].name = trimmed;
    }
    if (patch.sort_order !== undefined) {
      state.classes[idx].sort_order = patch.sort_order;
    }
    return { ...state.classes[idx] };
  },

  reorderClasses(orderedIds: string[]): void {
    orderedIds.forEach((id, idx) => {
      const cls = state.classes.find((c) => c.id === id);
      if (cls) cls.sort_order = idx + 1;
    });
  },

  deleteClass(id: string): void {
    const hasStudents = state.students.some((s) => s.class_id === id);
    if (hasStudents) {
      throw new Error('CLASS_HAS_STUDENTS');
    }
    state.classes = state.classes.filter((c) => c.id !== id);
  },

  listStudents(filters?: { classId?: string; includeArchived?: boolean; search?: string }): Student[] {
    return state.students
      .filter((s) => {
        if (!filters?.includeArchived && !s.is_active) return false;
        if (filters?.classId && filters.classId !== 'all' && s.class_id !== filters.classId) {
          return false;
        }
        if (filters?.search && filters.search.trim().length > 0) {
          const q = filters.search.trim().toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchFather = (s.father_name ?? '').toLowerCase().includes(q);
          const matchRoll = (s.roll_no ?? '').toLowerCase().includes(q);
          if (!matchName && !matchFather && !matchRoll) return false;
        }
        return true;
      })
      .map((s) => ({ ...s }));
  },

  getStudentById(id: string): Student | null {
    const s = state.students.find((item) => item.id === id);
    return s ? { ...s } : null;
  },

  createStudent(input: StudentInput): Student {
    const now = new Date().toISOString();
    const created: Student = {
      id: nextId('stu'),
      user_id: PREVIEW_USER_ID,
      class_id: input.class_id,
      name: input.name.trim(),
      father_name: input.father_name?.trim() || null,
      roll_no: input.roll_no?.trim() || null,
      phone: input.phone?.trim() || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    state.students.push(created);
    return { ...created };
  },

  updateStudent(id: string, input: Partial<StudentInput> & { is_active?: boolean }): Student {
    const idx = state.students.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('STUDENT_NOT_FOUND');
    const prev = state.students[idx];
    const updated: Student = {
      ...prev,
      class_id: input.class_id ?? prev.class_id,
      name: input.name !== undefined ? input.name.trim() : prev.name,
      father_name: input.father_name !== undefined ? input.father_name?.trim() || null : prev.father_name,
      roll_no: input.roll_no !== undefined ? input.roll_no?.trim() || null : prev.roll_no,
      phone: input.phone !== undefined ? input.phone?.trim() || null : prev.phone,
      is_active: input.is_active !== undefined ? input.is_active : prev.is_active,
      updated_at: new Date().toISOString(),
    };
    state.students[idx] = updated;
    return { ...updated };
  },

  deleteStudent(id: string): void {
    state.students = state.students.filter((s) => s.id !== id);
    state.attendance = state.attendance.filter((a) => a.student_id !== id);
    state.lessonRecords = state.lessonRecords.filter((l) => l.student_id !== id);
  },

  listAttendanceByDate(date: string): AttendanceRecord[] {
    return state.attendance.filter((a) => a.attendance_date === date).map((a) => ({ ...a }));
  },

  listAttendanceByStudent(studentId: string): AttendanceRecord[] {
    return state.attendance
      .filter((a) => a.student_id === studentId)
      .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date))
      .map((a) => ({ ...a }));
  },

  upsertAttendance(studentId: string, date: string, status: AttendanceStatus): AttendanceRecord {
    const now = new Date().toISOString();
    const existing = state.attendance.find(
      (a) => a.student_id === studentId && a.attendance_date === date
    );
    if (existing) {
      existing.status = status;
      existing.updated_at = now;
      return { ...existing };
    }
    const created: AttendanceRecord = {
      id: nextId('att'),
      user_id: PREVIEW_USER_ID,
      student_id: studentId,
      attendance_date: date,
      status,
      created_at: now,
      updated_at: now,
    };
    state.attendance.push(created);
    return { ...created };
  },

  markAllPresent(studentIds: string[], date: string): AttendanceRecord[] {
    return studentIds.map((sid) => previewStore.upsertAttendance(sid, date, 'present'));
  },

  listLessonsByDate(date: string): LessonRecord[] {
    return state.lessonRecords.filter((l) => l.record_date === date).map((l) => ({ ...l }));
  },

  getLessonsByStudentAndDate(studentId: string, date: string): LessonRecord[] {
    return state.lessonRecords
      .filter((l) => l.student_id === studentId && l.record_date === date)
      .map((l) => ({ ...l }));
  },

  listLessonsByStudent(studentId: string): LessonRecord[] {
    return state.lessonRecords
      .filter((l) => l.student_id === studentId)
      .sort((a, b) => b.record_date.localeCompare(a.record_date))
      .map((l) => ({ ...l }));
  },

  upsertLessonRecord(input: LessonUpsertInput): LessonRecord {
    const normalized = normalizeLessonPayload(input);
    const now = new Date().toISOString();
    const existing = state.lessonRecords.find(
      (l) =>
        l.student_id === normalized.student_id &&
        l.record_date === normalized.record_date &&
        l.lesson_type === normalized.lesson_type
    );
    if (existing) {
      Object.assign(existing, {
        heard: normalized.heard,
        lines_count: normalized.lines_count,
        mistakes_count: normalized.mistakes_count,
        grade: normalized.grade,
        note: normalized.note,
        updated_at: now,
      });
      return { ...existing };
    }
    const created: LessonRecord = {
      id: nextId('les'),
      user_id: PREVIEW_USER_ID,
      student_id: normalized.student_id,
      record_date: normalized.record_date,
      lesson_type: normalized.lesson_type,
      heard: normalized.heard,
      lines_count: normalized.lines_count,
      mistakes_count: normalized.mistakes_count,
      grade: normalized.grade,
      note: normalized.note,
      created_at: now,
      updated_at: now,
    };
    state.lessonRecords.push(created);
    return { ...created };
  },
};
