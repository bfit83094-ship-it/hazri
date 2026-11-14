import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { lessonRecordsService } from '../services/lessonRecordsService';
import type { LessonRecord, LessonUpsertInput } from '../types/db';

export const LESSONS_KEY = ['lesson_records'] as const;

export function useLessonsByDate(date: string) {
  const { userId } = useAuth();

  return useQuery<LessonRecord[]>({
    queryKey: [...LESSONS_KEY, 'byDate', userId, date],
    queryFn: () => lessonRecordsService.listByDate(date),
    enabled: Boolean(userId && date),
  });
}

export function useStudentLessonsByDate(studentId: string | undefined, date: string) {
  const { userId } = useAuth();

  return useQuery<LessonRecord[]>({
    queryKey: [...LESSONS_KEY, 'byStudentDate', userId, studentId, date],
    queryFn: () =>
      studentId
        ? lessonRecordsService.getByStudentAndDate(studentId, date)
        : Promise.resolve([]),
    enabled: Boolean(userId && studentId && date),
  });
}

export function useStudentLessons(
  studentId: string | undefined,
  startDate?: string | null,
  endDate?: string | null
) {
  const { userId } = useAuth();

  return useQuery<LessonRecord[]>({
    queryKey: [...LESSONS_KEY, 'byStudent', userId, studentId, startDate ?? null, endDate ?? null],
    queryFn: () =>
      studentId
        ? lessonRecordsService.listByStudent(studentId, startDate, endDate)
        : Promise.resolve([]),
    enabled: Boolean(userId && studentId),
  });
}

export function useUpsertLessonRecord() {
  const { userId } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: LessonUpsertInput) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return lessonRecordsService.upsertLessonRecord(userId, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LESSONS_KEY });
    },
  });
}
