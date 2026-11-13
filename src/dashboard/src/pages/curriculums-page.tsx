import { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import DeleteModal from '@/components/ui/delete-modal';
import CurriculumModal from '@/components/curriculum/curriculum-modal';
import { PageHeader } from '@/components/ui/page-header';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { curriculumService } from '@/services/curriculum.service';

import type { CurriculumDto } from 'dtos';

export default function CurriculumsPage() {
  const [curriculums, setCurriculums] = useState<CurriculumDto[]>([]);
  const [curriculumToEdit, setCurriculumToEdit] =
    useState<CurriculumDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    itemToDelete: curriculumToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<CurriculumDto>(
    'Failed to delete the curriculum. Please try again later.',
  );

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
    await handleDelete(
      (curriculum) => curriculumService.deleteCurriculumById(curriculum.id),
      (deletedCurriculum) => {
        setCurriculums((prev) =>
          prev.filter((c) => c.id !== deletedCurriculum.id),
        );
      },
    );
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setCurriculumToEdit(null);
    fetchCurriculums();
  };

  const handleCreateSuccess = (createdCurriculum: CurriculumDto) => {
    setCurriculums((previousCurriculums) => [
      ...previousCurriculums,
      createdCurriculum,
    ]);
  };

  const columns: DataTableColumn<CurriculumDto>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <PageHeader
        title="Curriculums"
        description="A list of available curriculums."
        action={{
          label: 'Create Curriculum',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={curriculums}
        rowKey="id"
        isLoading={isLoading}
        loadingMessage="Loading..."
        error={error ?? undefined}
        emptyMessage="No curriculums found."
        actions={(curriculum) => (
          <DropdownMenu
            items={[
              {
                label: 'Edit',
                onSelect: () => {
                  setCurriculumToEdit(curriculum);
                  setIsModalOpen(true);
                },
              },
              {
                label: 'Delete',
                variant: 'destructive',
                onSelect: () => openDeleteModal(curriculum),
              },
            ]}
          />
        )}
      />

      <DeleteModal
        open={curriculumToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete the curriculum{' '}
            <span className="font-semibold">{curriculumToDelete?.name}</span>?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <CurriculumModal
        open={isModalOpen}
        curriculum={curriculumToEdit || undefined}
        onClose={() => {
          setIsModalOpen(false);
          setCurriculumToEdit(null);
        }}
        onUpdateSuccess={handleFormSuccess}
        onCreateSuccess={handleCreateSuccess}
      />
    </div>
  );
}
