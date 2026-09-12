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

import AddGradeModal from '@/components/add-grade-modal';
import UpdateGradeModal from '@/components/update-grade-modal';
import DeleteGradeModal from '@/components/delete-grade-modal';

import { gradeService } from '@/services/grade.service';
import type { GradeDto } from 'dtos';

export default function GradePage() {
  const [grades, setGrades] = useState<GradeDto[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<GradeDto | null>(null);
  const [gradeToDelete, setGradeToDelete] = useState<GradeDto | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleCreated = (grade: GradeDto) => {
    setGrades((current) => [...current, grade]);
  };

  const handleUpdated = (updatedGrade: GradeDto) => {
    setGrades((current) =>
      current.map((grade) =>
        grade.id === updatedGrade.id ? updatedGrade : grade,
      ),
    );

    setGradeToEdit(null);
  };

  const handleDelete = async () => {
    if (!gradeToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await gradeService.deleteGrade(gradeToDelete.id);

      setGrades((current) =>
        current.filter((grade) => grade.id !== gradeToDelete.id),
      );

      setGradeToDelete(null);
    } catch (error) {
      console.error('Failed to delete grade:', error);
      setDeleteError('Failed to delete grade. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmptyState = !isLoading && !fetchError && grades.length === 0;

  return (
    <>
      <div className="mx-auto mt-20 w-[70%] bg-white p-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Grades</h1>

          <Button onClick={() => setIsAddOpen(true)}>Add Grade</Button>
        </div>

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
                      <Button onClick={() => setGradeToEdit(grade)}>
                        Edit
                      </Button>

                      <Button
                        onClick={() => {
                          setDeleteError(null);
                          setGradeToDelete(grade);
                        }}
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

      <AddGradeModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={handleCreated}
      />

      <UpdateGradeModal
        open={gradeToEdit !== null}
        grade={gradeToEdit}
        onClose={() => setGradeToEdit(null)}
        onUpdated={handleUpdated}
      />

      <DeleteGradeModal
        open={gradeToDelete !== null}
        gradeName={gradeToDelete?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!isDeleting) {
            setGradeToDelete(null);
            setDeleteError(null);
          }
        }}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
}
