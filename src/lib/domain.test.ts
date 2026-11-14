import test from 'node:test';
import assert from 'node:assert/strict';
import { roman, ur } from '../i18n';
import {
  addDaysISO,
  formatDateFull,
  formatGregorianDate,
  formatWeekday,
  getRangeStartISO,
  isFutureISO,
} from './date';
import {
  buildStudentHistoryAndStats,
  computeAttendanceSummary,
  getAttendanceLabel,
  getGradeLabel,
  getLessonLabel,
  normalizeLessonPayload,
  validateClassName,
  validateStudentForm,
} from './grades';
import type { AttendanceRecord, LessonRecord } from '../types/db';

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return [`${prefix}[${obj.length}]`];
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .flatMap((k) =>
        collectKeys((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k)
      );
  }
  return [prefix];
}

test('ur and roman dictionaries have identical keys and non-empty strings', () => {
  assert.deepEqual(collectKeys(ur), collectKeys(roman));
  assert.equal(roman.nav.attendance, 'Hazri');
  assert.equal(roman.nav.lessons, 'Sabaq');
  assert.equal(roman.nav.students, 'Talaba');
  assert.equal(roman.nav.settings, 'Settings');
});

test('date helpers format Gregorian DD-MM-YYYY, weekdays, and full dates in ur and roman', () => {
  assert.equal(formatGregorianDate('2026-11-14'), '14-11-2026');
  assert.equal(addDaysISO('2026-11-14', 1), '2026-11-15');
  assert.equal(addDaysISO('2026-11-14', -1), '2026-11-13');
  assert.equal(isFutureISO('2026-11-15', '2026-11-14'), true);
  assert.equal(isFutureISO('2026-11-14', '2026-11-14'), false);
  assert.equal(getRangeStartISO('week', '2026-11-14'), '2026-11-08');
  assert.equal(getRangeStartISO('all', '2026-11-14'), null);
  assert.equal(formatWeekday('2026-11-14', 'ur'), 'ہفتہ');
  assert.equal(formatWeekday('2026-11-14', 'roman'), 'Hafta');
  assert.equal(formatDateFull('2026-11-14', 'roman'), 'Hafta, 14 November 2026');
});

test('bilingual labels return Urdu and Roman Urdu correctly', () => {
  assert.equal(getLessonLabel('sabaq', 'roman'), 'Sabaq');
  assert.equal(getGradeLabel('acha', 'roman'), 'Acha');
  assert.equal(getAttendanceLabel('leave', 'roman'), 'Rukhsat');
});

test('normalizeLessonPayload clears counts and grade when not heard', () => {
  const res = normalizeLessonPayload({
    student_id: 's1',
    record_date: '2026-11-14',
    lesson_type: 'sabaq',
    heard: false,
    lines_count: 15,
    mistakes_count: 3,
    grade: 'acha',
    note: '  غائب تھا  ',
  });
  assert.equal(res.heard, false);
  assert.equal(res.lines_count, 0);
  assert.equal(res.mistakes_count, 0);
  assert.equal(res.grade, null);
  assert.equal(res.note, 'غائب تھا');
});

test('normalizeLessonPayload clamps counts between 0 and 999 when heard', () => {
  const res = normalizeLessonPayload({
    student_id: 's1',
    record_date: '2026-11-14',
    lesson_type: 'manzil',
    heard: true,
    lines_count: 1200,
    mistakes_count: -4,
    grade: 'theek',
    note: '   ',
  });
  assert.equal(res.lines_count, 999);
  assert.equal(res.mistakes_count, 0);
  assert.equal(res.grade, 'theek');
  assert.equal(res.note, null);
});

test('computeAttendanceSummary counts present, absent, leave, and unmarked accurately', () => {
  const students = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
  const records = [
    { student_id: '1', status: 'present' as const },
    { student_id: '2', status: 'absent' as const },
    { student_id: '3', status: 'leave' as const },
  ];
  assert.deepEqual(computeAttendanceSummary(students, records), {
    present: 1,
    absent: 1,
    leave: 1,
    unmarked: 1,
    total: 4,
  });
});

test('buildStudentHistoryAndStats sorts newest first and computes attendance % and avg sabaq lines', () => {
  const attendance: AttendanceRecord[] = [
    {
      id: 'a1',
      user_id: 'u1',
      student_id: 's1',
      attendance_date: '2026-11-12',
      status: 'present',
      created_at: '',
      updated_at: '',
    },
    {
      id: 'a2',
      user_id: 'u1',
      student_id: 's1',
      attendance_date: '2026-11-14',
      status: 'absent',
      created_at: '',
      updated_at: '',
    },
  ];
  const lessons: LessonRecord[] = [
    {
      id: 'l1',
      user_id: 'u1',
      student_id: 's1',
      record_date: '2026-11-12',
      lesson_type: 'sabaq',
      heard: true,
      lines_count: 12,
      mistakes_count: 1,
      grade: 'acha',
      note: null,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'l2',
      user_id: 'u1',
      student_id: 's1',
      record_date: '2026-11-13',
      lesson_type: 'sabaq',
      heard: true,
      lines_count: 8,
      mistakes_count: 2,
      grade: 'theek',
      note: null,
      created_at: '',
      updated_at: '',
    },
  ];

  const { history, stats } = buildStudentHistoryAndStats(attendance, lessons);
  assert.equal(history.length, 3);
  assert.equal(history[0].date, '2026-11-14');
  assert.equal(history[2].date, '2026-11-12');
  assert.equal(stats.presentCount, 1);
  assert.equal(stats.absentCount, 1);
  assert.equal(stats.attendancePercent, 50);
  assert.equal(stats.sabaqHeardDays, 2);
  assert.equal(stats.averageSabaqLines, 10);
});

test('validateStudentForm & validateClassName reject invalid and duplicate inputs in both languages', () => {
  const bad = validateStudentForm({ name: '  ', class_id: '' }, 'ur');
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.class_id);

  const badRoman = validateStudentForm({ name: '  ', class_id: '' }, 'roman');
  assert.equal(badRoman.errors.name, roman.students.nameRequiredError);

  const ok = validateStudentForm({ name: 'انس', class_id: 'c1' }, 'roman');
  assert.equal(ok.valid, true);

  assert.equal(validateClassName('', [], undefined, 'roman'), roman.classes.nameRequiredError);
  assert.ok(validateClassName('درجہ حفظ', [{ id: '1', name: 'درجہ حفظ' }]));
  assert.equal(validateClassName('درجہ حفظ', [{ id: '1', name: 'درجہ حفظ' }], '1'), null);
});
