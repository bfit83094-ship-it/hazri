import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArchiveRestore,
  BookMarked,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ClassFilter } from '../components/ClassFilter';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { StudentFormSheet } from '../components/StudentFormSheet';
import { StudentRow } from '../components/StudentRow';
import { useT } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useClasses } from '../hooks/useClasses';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from '../hooks/useStudents';
import type { Student, StudentInput } from '../types/db';

export const StudentsPage: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { showToast } = useToast();
  const t = useT();
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    setVisibleCount(50);
  }, [selectedClassId, includeArchived, search]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const classesQuery = useClasses();
  const studentsQuery = useStudents({
    classId: selectedClassId,
    includeArchived,
    search,
  });

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of classesQuery.data ?? []) {
      map.set(c.id, c.name);
    }
    return map;
  }, [classesQuery.data]);

  const openAddSheet = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const openEditSheet = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleFormSubmit = async (input: StudentInput) => {
    try {
      if (editingStudent) {
        await updateMutation.mutateAsync({ id: editingStudent.id, input });
        showToast(t.students.updatedToast, 'success');
      } else {
        await createMutation.mutateAsync(input);
        showToast(t.students.createdToast, 'success');
      }
      setFormOpen(false);
      setEditingStudent(null);
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const handleToggleArchive = async (student: Student) => {
    try {
      await updateMutation.mutateAsync({
        id: student.id,
        input: { is_active: !student.is_active },
      });
      showToast(
        student.is_active ? t.students.archivedToast : t.students.restoredToast,
        'success'
      );
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteMutation.mutateAsync(deletingStudent.id);
      showToast(t.students.deletedToast, 'success');
      setDeletingStudent(null);
    } catch {
      showToast(t.common.saveError, 'error');
    }
  };

  return (
    <AppShell
      title={t.students.title}
      headerAction={
        <div className="flex items-center gap-2">
          <Link
            to="/classes"
            className="min-h-[40px] px-3 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap"
          >
            <BookMarked className="w-4 h-4 text-[#0F766E]" aria-hidden="true" />
            <span>{t.students.manageClasses}</span>
          </Link>
          <button
            type="button"
            disabled={!isOnline}
            onClick={openAddSheet}
            className="hidden md:inline-flex min-h-[40px] px-3.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold items-center gap-1.5 hover:bg-[#115E59] whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{t.students.addStudent}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search and archived toggle */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#64748B] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.common.search}
              aria-label={t.common.search}
              className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-sm text-[#0F172A] focus:border-[#0F766E]"
            />
          </div>

          <button
            type="button"
            aria-pressed={includeArchived}
            onClick={() => setIncludeArchived((v) => !v)}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              includeArchived
                ? 'bg-[#0F766E] text-white border-[#0F766E]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A]'
            }`}
          >
            <Archive className="w-4 h-4" aria-hidden="true" />
            <span>{t.students.showArchived}</span>
          </button>
        </div>

        {(classesQuery.data?.length ?? 0) > 0 && (
          <ClassFilter
            classes={classesQuery.data ?? []}
            selectedClassId={selectedClassId}
            onSelect={setSelectedClassId}
          />
        )}

        {studentsQuery.isLoading || classesQuery.isLoading ? (
          <LoadingState />
        ) : studentsQuery.isError || classesQuery.isError ? (
          <ErrorState onRetry={() => studentsQuery.refetch()} />
        ) : (studentsQuery.data?.length ?? 0) === 0 ? (
          <EmptyState
            title={
              search
                ? t.students.emptySearch
                : t.attendance.noStudentsTitle
            }
            description={search ? undefined : t.attendance.noStudentsBody}
            actionLabel={search ? undefined : t.students.addStudent}
            onAction={search ? undefined : openAddSheet}
            icon={<Users className="w-7 h-7" aria-hidden="true" />}
          />
        ) : (
          <div className="space-y-2.5">
            {studentsQuery.data!.slice(0, visibleCount).map((student) => {
              const className = classMap.get(student.class_id) ?? '';
              const subtitle = [
                className,
                student.father_name,
                student.roll_no,
              ]
                .filter(Boolean)
                .join(' · ');

              return (
                <StudentRow
                  key={student.id}
                  name={student.name}
                  subtitle={subtitle}
                  badgeText={!student.is_active ? t.students.archivedTag : undefined}
                  badgeClassName="text-[#B45309]"
                  to={`/students/${student.id}`}
                  dimmed={!student.is_active}
                  trailing={
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={!isOnline}
                        onClick={() => openEditSheet(student)}
                        aria-label={`${t.common.edit} ${student.name}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#0F766E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Pencil className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        disabled={!isOnline}
                        onClick={() => handleToggleArchive(student)}
                        aria-label={
                          student.is_active
                            ? `${t.students.archive} ${student.name}`
                            : `${t.students.unarchive} ${student.name}`
                        }
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#B45309] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {student.is_active ? (
                          <Archive className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ArchiveRestore className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={!isOnline}
                        onClick={() => setDeletingStudent(student)}
                        aria-label={`${t.common.delete} ${student.name}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#64748B] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  }
                />
              );
            })}

            {studentsQuery.data!.length > visibleCount && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 50)}
                className="w-full min-h-[44px] rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold text-[#0F766E] hover:bg-[#F6F8F7] transition-colors"
              >
                {t.common.showMore} ({studentsQuery.data!.length - visibleCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button (above bottom nav) */}
      <button
        type="button"
        disabled={!isOnline}
        onClick={openAddSheet}
        aria-label={t.students.addStudent}
        className="md:hidden fixed bottom-20 end-4 z-30 min-h-[52px] px-4 rounded-2xl bg-[#0F766E] text-white shadow-lg flex items-center gap-2 text-sm font-bold hover:bg-[#115E59] active:scale-95 transition-all disabled:opacity-45 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        <span>{t.students.addStudent}</span>
      </button>

      <StudentFormSheet
        open={formOpen}
        classes={classesQuery.data ?? []}
        initialStudent={editingStudent}
        defaultClassId={selectedClassId}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingStudent)}
        title={t.students.deleteTitle}
        description={t.students.deleteBody}
        confirmLabel={t.common.delete}
        destructive
        busy={deleteMutation.isPending}
        onCancel={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
};
