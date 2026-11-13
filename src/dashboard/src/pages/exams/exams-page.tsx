import { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import DeleteModal from '@/components/ui/delete-modal';
import ExamModal from '@/components/exam/exam-modal';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { examService } from '@/services/exam.service';
import type { ExamDto } from 'dtos';

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    itemToDelete: examToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<ExamDto>(
    'Failed to delete the exam. Please try again later.',
  );

  useEffect(() => {
    let isMounted = true;

    const loadExams = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await examService.getAllExams();

        if (isMounted) {
          setExams(data);
        }
      } catch (error) {
        console.error('Failed to load exams:', error);

        if (isMounted) {
          setFetchError('Failed to load exams. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExams();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditExam = (exam: ExamDto) => {
    console.info('Edit exam selected:', exam.id);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(
      (examToRemove) => examService.deleteExamById(examToRemove.id),
      (deletedExam) => {
        setExams((prev) => prev.filter((exam) => exam.id !== deletedExam.id));
      },
    );
  };

  const handleCreateSuccess = (createdExam: ExamDto) => {
    setExams((previousExams) => [...previousExams, createdExam]);
  };

  const columns: DataTableColumn<ExamDto>[] = [
    {
      id: 'title',
      header: 'Title',
      accessorKey: 'title',
      sortable: true,
    },
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
      sortable: true,
      cell: (exam) => new Date(exam.date).toLocaleDateString(),
      sortValue: (exam) => new Date(exam.date).getTime(),
    },
    {
      id: 'curriculumId',
      header: 'Curriculum ID',
      accessorKey: 'curriculumId',
      sortable: true,
      cell: (exam) => exam.curriculumId ?? '—',
    },
    {
      id: 'minScore',
      header: 'Min Score',
      accessorKey: 'minScore',
      sortable: true,
    },
    {
      id: 'maxScore',
      header: 'Max Score',
      accessorKey: 'maxScore',
      sortable: true,
    },
    {
      id: 'document',
      header: 'Document',
      cell: (exam) =>
        exam.documentUrl ? (
          <a
            href={exam.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-primary underline underline-offset-4"
            onClick={(event) => event.stopPropagation()}
          >
            View document
          </a>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="w-full min-w-0">
        <PageHeader
          title="Exams"
          description="A list of all available exams."
          action={{
            label: 'Create Exam',
            onClick: () => setIsModalOpen(true),
          }}
        />

        <div className="mt-8 w-full min-w-0">
          <DataTable
            columns={columns}
            data={exams}
            rowKey="id"
            isLoading={isLoading}
            loadingMessage="Loading exams..."
            error={fetchError}
            emptyMessage="No exams available."
            actions={(exam) => (
              <DropdownMenu
                items={[
                  {
                    label: 'Edit',
                    onSelect: () => handleEditExam(exam),
                  },
                  {
                    label: 'Delete',
                    variant: 'destructive',
                    onSelect: () => openDeleteModal(exam),
                  },
                ]}
              />
            )}
          />
        </div>
      </div>

      <DeleteModal
        open={examToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete the exam{' '}
            <span className="font-semibold">{examToDelete?.title}</span>?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <ExamModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSuccess={handleCreateSuccess}
      />
    </div>
  );
}
