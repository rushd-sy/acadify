import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import DeleteCurriculumModal from '@/components/delete-curriculum-modal';
import CurriculumModal from '@/components/curriculum-modal';
import { curriculumService } from '@/services/curriculum.service';
import type { CurriculumDto } from 'dtos';

export default function CurriculumsPage() {
  const [curriculums, setCurriculums] = useState<CurriculumDto[]>([]);
  const [curriculumToDelete, setCurriculumToDelete] =
    useState<CurriculumDto | null>(null);
  const [curriculumToEdit, setCurriculumToEdit] =
    useState<CurriculumDto | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculums = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await curriculumService.getAllCurriculums();
      setCurriculums(data);
    } catch {
      setError('Failed to load curriculums.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    curriculumService
      .getAllCurriculums()
      .then((data) => {
        if (isMounted) {
          setCurriculums(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load curriculums.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmDelete = async () => {
    if (!curriculumToDelete) return;
    try {
      setIsDeleting(true);
      await curriculumService.deleteCurriculumById(curriculumToDelete.id);
      setCurriculums((prev) =>
        prev.filter((curriculum) => curriculum.id !== curriculumToDelete.id),
      );
      setCurriculumToDelete(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setCurriculumToEdit(null);
    fetchCurriculums();
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Curriculums</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Curriculum</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            Manage academic subjects.
          </TableCaption>
          <TableHeader>
            <TableRow className="text-base">
              <TableHead className="py-5">Name</TableHead>
              <TableHead className="py-5">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-base">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-red-600 py-10"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : curriculums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  No curriculums found.
                </TableCell>
              </TableRow>
            ) : (
              curriculums.map((curriculum) => (
                <TableRow key={curriculum.id} className="h-16">
                  <TableCell className="font-medium">
                    {curriculum.name}
                  </TableCell>
                  <TableCell>{curriculum.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCurriculumToEdit(curriculum);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setCurriculumToDelete(curriculum)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteCurriculumModal
        open={!!curriculumToDelete}
        curriculumName={curriculumToDelete?.name || ''}
        onYes={handleConfirmDelete}
        onNo={() => setCurriculumToDelete(null)}
        isLoading={isDeleting}
      />

      <CurriculumModal
        open={isModalOpen}
        curriculum={curriculumToEdit || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setCurriculumToEdit(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
