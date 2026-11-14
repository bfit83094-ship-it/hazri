import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { classesService } from '../services/classesService';
import type { ClassItem } from '../types/db';

export const CLASSES_KEY = ['classes'] as const;

export function useClasses() {
  const { userId } = useAuth();

  return useQuery<ClassItem[]>({
    queryKey: [...CLASSES_KEY, userId],
    queryFn: () => classesService.listClasses(),
    enabled: Boolean(userId),
  });
}

export function useCreateClass() {
  const { userId } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ name, sortOrder }: { name: string; sortOrder: number }) => {
      if (!userId) throw new Error('NOT_AUTHENTICATED');
      return classesService.createClass(userId, name, sortOrder);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { name?: string; sort_order?: number };
    }) => classesService.updateClass(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useReorderClasses() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (items: { id: string; sort_order: number }[]) =>
      classesService.reorderClasses(items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesService.deleteClass(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });
}
