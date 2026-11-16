import { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { RowActionsMenu } from '@/components/ui/dropdown-menu';
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
  const [examToEdit, setExamToEdit] = useState<ExamDto | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const handleEditExam = async (exam: ExamDto) => {
    if (isFetchingDetails) return;
    setActionError(null);

    try {
      setIsFetchingDetails(true);
      const examDetails = await examService.getExamById(exam.id);
      setExamToEdit(examDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch exam details:', error);
      setActionError('Failed to load exam details. Please try again.');
    } finally {
      setIsFetchingDetails(false);
    }
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

  const handleUpdateSuccess = (updatedExam: ExamDto) => {
    setExams((prev) =>
      prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)),
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExamToEdit(null);
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
            onClick: () => {
              setExamToEdit(null);
              setIsModalOpen(true);
            },
          }}
        />

        {actionError && (
          <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="ml-4 font-semibold text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

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
              <RowActionsMenu
                label={`Actions for ${exam.title}`}
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
        exam={examToEdit ?? undefined}
        onUpdateSuccess={handleUpdateSuccess}
        onCreateSuccess={handleCreateSuccess}
        onClose={handleCloseModal}
      />
    </div>
  );
}
