import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService } from '../services/attendanceService';
import type { AttendanceRecord, AttendanceStatus } from '../types/db';

export const ATTENDANCE_KEY = ['attendance'] as const;

export function useAttendanceByDate(date: string) {
  const { userId } = useAuth();

  return useQuery<AttendanceRecord[]>({
    queryKey: [...ATTENDANCE_KEY, 'byDate', userId, date],
    queryFn: () => attendanceService.listByDate(date),
    enabled: Boolean(userId && date),
  });
}

export function useStudentAttendance(
  studentId: string | undefined,
  startDate?: string | null,
  endDate?: string | null
) {
  const { userId } = useAuth();

  return useQuery<AttendanceRecord[]>({
    queryKey: [...ATTENDANCE_KEY, 'byStudent', userId, studentId, startDate ?? null, endDate ?? null],
    queryFn: () =>
      studentId
        ? attendanceService.listByStudent(studentId, startDate, endDate)
        : Promise.resolve([]),
    enabled: Boolean(userId && studentId),
  });
}

export function useUpsertAttendance(date: string) {
  const { userId } = useAuth();
  const qc = useQueryClient();
  const queryKey = [...ATTENDANCE_KEY, 'byDate', userId, date];

  return useMutation({
    mutationFn: ({
      studentId,
      status,
      targetDate,
    }: {
      studentId: string;
      status: AttendanceStatus;
      targetDate?: string;
    }) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return attendanceService.upsertAttendance(
        userId,
        studentId,
        targetDate ?? date,
        status
      );
    },
    onMutate: async ({ studentId, status, targetDate }) => {
      if (targetDate && targetDate !== date) return undefined;
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData<AttendanceRecord[]>(queryKey);
      const now = new Date().toISOString();

      qc.setQueryData<AttendanceRecord[]>(queryKey, (old = []) => {
        const exists = old.some((r) => r.student_id === studentId);
        if (exists) {
          return old.map((r) =>
            r.student_id === studentId ? { ...r, status, updated_at: now } : r
          );
        }
        return [
          ...old,
          {
            id: `optimistic-${studentId}-${date}`,
            user_id: userId ?? '',
            student_id: studentId,
            attendance_date: date,
            status,
            created_at: now,
            updated_at: now,
          },
        ];
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEY });
    },
  });
}

export function useMarkAllPresent(date: string) {
  const { userId } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (studentIds: string[]) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return attendanceService.markAllPresent(userId, studentIds, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEY });
    },
  });
}
