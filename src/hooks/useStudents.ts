import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { studentsService, type StudentFilters } from '../services/studentsService';
import type { Student, StudentInput } from '../types/db';

export const STUDENTS_KEY = ['students'] as const;

export function useStudents(filters: StudentFilters = {}) {
  const { userId } = useAuth();

  return useQuery<Student[]>({
    queryKey: [...STUDENTS_KEY, userId, filters],
    queryFn: () => studentsService.listStudents(filters),
    enabled: Boolean(userId),
  });
}

export function useStudent(studentId: string | undefined) {
  const { userId } = useAuth();

  return useQuery<Student | null>({
    queryKey: [...STUDENTS_KEY, 'detail', userId, studentId],
    queryFn: () => (studentId ? studentsService.getStudentById(studentId) : Promise.resolve(null)),
    enabled: Boolean(userId && studentId),
  });
}

export function useCreateStudent() {
  const { userId } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: StudentInput) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return studentsService.createStudent(userId, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<StudentInput> & { is_active?: boolean };
    }) => studentsService.updateStudent(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsService.deleteStudent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['lesson_records'] });
    },
  });
}
