import { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import DeleteModal from '@/components/ui/delete-modal';
import GradeModal from '@/components/grade/grade-modal';
import { PageHeader } from '@/components/ui/page-header';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { gradeService } from '@/services/grade.service';
import { Spinner } from '@/components/ui/spinner';

import type { GradeDto } from 'dtos';

export default function GradePage() {
  const [grades, setGrades] = useState<GradeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<GradeDto | null>(null);

  const {
    itemToDelete: gradeToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<GradeDto>(
    'Failed to delet the grade. Please try again later.',
  );

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await gradeService.getAllGrades();
        setGrades(data);
      } catch (error) {
        console.error('Failed to load grades:', error);
        setFetchError('Failed to load grades. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGrades();
  }, []);

  const handleGradeSaved = (savedGrade: GradeDto) => {
    if (gradeToEdit) {
      setGrades((current) =>
        current.map((grade) =>
          grade.id === savedGrade.id ? savedGrade : grade,
        ),
      );
    } else {
      setGrades((current) => [...current, savedGrade]);
    }

    setGradeToEdit(null);
    setIsGradeModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(
      (grade) => gradeService.deleteGrade(grade.id),
      (deletedGrade) => {
        setGrades((current) => current.filter((g) => g.id !== deletedGrade.id));
      },
    );
  };

  const columns: DataTableColumn<GradeDto>[] = [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
    },
    {
      id: 'name',
      header: 'Grade Name',
      accessorKey: 'name',
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen bg-white p-8">
        <PageHeader
          title="Grades"
          description="A list of available grades."
          action={{
            label: 'Add Grade',
            onClick: () => {
              setGradeToEdit(null);
              setIsGradeModalOpen(true);
            },
          }}
        />

        <DataTable
          columns={columns}
          data={grades}
          rowKey="id"
          isLoading={isLoading}
          loadingMessage={<Spinner />}
          error={fetchError ?? undefined}
          emptyMessage="No grades available."
          actions={(grade) => (
            <DropdownMenu
              items={[
                {
                  label: 'Edit',
                  onSelect: () => {
                    setGradeToEdit(grade);
                    setIsGradeModalOpen(true);
                  },
                },
                {
                  label: 'Delete',
                  variant: 'destructive',
                  onSelect: () => openDeleteModal(grade),
                },
              ]}
            />
          )}
        />
      </div>

      <GradeModal
        open={isGradeModalOpen}
        grade={gradeToEdit ?? undefined}
        onClose={() => {
          setGradeToEdit(null);
          setIsGradeModalOpen(false);
        }}
        onCreateSuccess={handleGradeSaved}
        onUpdateSuccess={handleGradeSaved}
      />

      <DeleteModal
        open={gradeToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{gradeToDelete?.name}</span>?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />
    </>
  );
}
