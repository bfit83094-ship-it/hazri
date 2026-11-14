import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookMarked,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { ClassFormSheet } from '../components/ClassFormSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useT } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import {
  useClasses,
  useCreateClass,
  useDeleteClass,
  useReorderClasses,
  useUpdateClass,
} from '../hooks/useClasses';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useStudents } from '../hooks/useStudents';
import type { ClassItem } from '../types/db';

export const ClassesPage: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();
  const t = useT();
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null);

  const classesQuery = useClasses();
  const studentsQuery = useStudents({ includeArchived: true });
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const reorderMutation = useReorderClasses();
  const deleteMutation = useDeleteClass();

  const studentCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of studentsQuery.data ?? []) {
      map.set(s.class_id, (map.get(s.class_id) ?? 0) + 1);
    }
    return map;
  }, [studentsQuery.data]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormOpen(true);
  };

  const handleSubmit = async (name: string) => {
    try {
      if (editingClass) {
        await updateMutation.mutateAsync({ id: editingClass.id, patch: { name } });
        showToast(t.classes.updatedToast, 'success');
      } else {
        const list = classesQuery.data ?? [];
        const nextOrder =
          list.reduce((m, c) => Math.max(m, c.sort_order), 0) + 1;
        await createMutation.mutateAsync({ name, sortOrder: nextOrder });
        showToast(t.classes.createdToast, 'success');
      }
      setFormOpen(false);
      setEditingClass(null);
    } catch (err) {
      if (err instanceof Error && err.message === 'CLASS_DUPLICATE') {
        showToast(t.classes.duplicateNameError, 'error');
      } else {
        showToast(t.common.saveError, 'error');
      }
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const list = [...(classesQuery.data ?? [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const payload = list.map((c, idx) => ({ id: c.id, sort_order: idx + 1 }));
    try {
      await reorderMutation.mutateAsync(payload);
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const handleDeleteRequest = (cls: ClassItem) => {
    const count = studentCounts.get(cls.id) ?? 0;
    if (count > 0) {
      showToast(t.classes.deleteBlockedError, 'error');
      return;
    }
    setDeletingClass(cls);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClass) return;
    try {
      await deleteMutation.mutateAsync(deletingClass.id);
      showToast(t.classes.deletedToast, 'success');
      setDeletingClass(null);
    } catch (err) {
      setDeletingClass(null);
      if (err instanceof Error && err.message === 'CLASS_HAS_STUDENTS') {
        showToast(t.classes.deleteBlockedError, 'error');
      } else {
        showToast(t.common.saveError, 'error');
      }
    }
  };

  return (
    <AppShell
      title={t.classes.title}
      backTo="/students"
      headerAction={
        <button
          type="button"
          disabled={!isOnline}
          onClick={handleOpenAdd}
          className="min-h-[40px] px-3.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#115E59] whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{t.classes.addClass}</span>
        </button>
      }
    >
      {classesQuery.isLoading ? (
        <LoadingState />
      ) : classesQuery.isError ? (
        <ErrorState onRetry={() => classesQuery.refetch()} />
      ) : (classesQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          title={t.classes.emptyTitle}
          actionLabel={t.classes.addClass}
          onAction={handleOpenAdd}
          icon={<BookMarked className="w-7 h-7" aria-hidden="true" />}
        />
      ) : (
        <div className="space-y-2.5">
          {classesQuery.data!.map((cls, index) => {
            const count = studentCounts.get(cls.id) ?? 0;
            const total = classesQuery.data!.length;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 md:p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-base md:text-lg font-bold text-[#0F172A] truncate">
                    {cls.name}
                  </p>
                  <p className="text-xs text-[#64748B] tabular-nums">
                    {count}{' '}
                    {count === 1
                      ? t.classes.studentSingular
                      : t.classes.studentCountSuffix}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={!isOnline || index === 0 || reorderMutation.isPending}
                    onClick={() => handleMove(index, -1)}
                    aria-label={`${t.classes.moveUp} ${cls.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    disabled={!isOnline || index === total - 1 || reorderMutation.isPending}
                    onClick={() => handleMove(index, 1)}
                    aria-label={`${t.classes.moveDown} ${cls.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    disabled={!isOnline}
                    onClick={() => handleOpenEdit(cls)}
                    aria-label={`${t.common.edit} ${cls.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#0F766E] disabled:opacity-40"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    disabled={!isOnline}
                    onClick={() => handleDeleteRequest(cls)}
                    aria-label={`${t.common.delete} ${cls.name}`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-[#DC2626]/10 hover:text-[#DC2626] disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ClassFormSheet
        open={formOpen}
        existingClasses={classesQuery.data ?? []}
        initialClass={editingClass}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setFormOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingClass)}
        title={t.classes.deleteTitle}
        description={t.classes.deleteBody}
        confirmLabel={t.common.delete}
        destructive
        busy={deleteMutation.isPending}
        onCancel={() => setDeletingClass(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
};
