import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import GradeModal from '@/components/grade/grade-modal';
import DeleteModal from '@/components/ui/delete-modal';
import { gradeService } from '@/services/grade.service';
import type { GradeDto } from 'dtos';
import { PageHeader } from '@/components/ui/page-header';
import { useDeleteModal } from '@/hooks/use-delete-modal';

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

  const showEmptyState = !isLoading && !fetchError && grades.length === 0;

  return (
    <>
      <div className="w-full min-h-screen bg-white p-8">
        <PageHeader
          title="Grades"
          action={{
            label: 'Add Grade',
            onClick: () => {
              setGradeToEdit(null);
              setIsGradeModalOpen(true);
            },
          }}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Grade Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && fetchError && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-red-600"
                >
                  {fetchError}
                </TableCell>
              </TableRow>
            )}

            {showEmptyState && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center">
                  No grades available.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !fetchError &&
              grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.id}</TableCell>
                  <TableCell>{grade.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setGradeToEdit(grade);
                          setIsGradeModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => openDeleteModal(grade)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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
