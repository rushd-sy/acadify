import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';

import { examService } from '@/services/exam.service';
import type { ExamDto } from 'dtos';
import DeleteExamModal from '@/components/exam/delete-exam-modal';
import ExamModal from '@/components/exam/exam-modal';
interface MenuPosition {
  top: number;
  left: number;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [examToDelete, setExamToDelete] = useState<ExamDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (openMenuId === null) return;

    const closeMenu = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Element && !target.closest('[data-exam-menu]')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [openMenuId]);

  const showEmptyState = !isLoading && !fetchError && exams.length === 0;

  const handleMenuToggle = (examId: number, button: HTMLButtonElement) => {
    if (openMenuId === examId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 144;
    const viewportPadding = 8;

    const left = Math.max(
      viewportPadding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    setMenuPosition({
      top: rect.bottom + 8,
      left,
    });

    setOpenMenuId(examId);
  };

  const handleEditExam = (exam: ExamDto) => {
    setOpenMenuId(null);
    setMenuPosition(null);
    console.info('Edit exam selected:', exam.id);
  };

  const handleDeleteExam = (exam: ExamDto) => {
    setOpenMenuId(null);
    setMenuPosition(null);
    setDeleteError(null);
    setExamToDelete(exam);
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;
    try {
      setIsDeleting(true);
      await examService.deleteExamById(examToDelete.id);
      setExams((prev) => prev.filter((exam) => exam.id !== examToDelete.id));
      setExamToDelete(null);
    } catch (error) {
      console.log('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSuccess = (createdCurriculum: ExamDto) => {
    setExams((previousCurriculums) => [
      ...previousCurriculums,
      createdCurriculum,
    ]);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="w-full min-w-0">
        <PageHeader
          title="Exams"
          description="A list of all available exams."
          action={{
            label: 'Create Exam',
            onClick: () => setIsModalOpen(true),
          }}
        />

        <div className="mt-8 w-full min-w-0 overflow-x-auto rounded-md">
          <Table className="w-full min-w-[900px] table-auto text-sm">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="h-14 w-[24%] whitespace-nowrap px-4 font-semibold">
                  Title
                </TableHead>

                <TableHead className="h-14 w-[14%] whitespace-nowrap px-4 font-semibold">
                  Date
                </TableHead>

                <TableHead className="h-14 w-[16%] whitespace-nowrap px-4 font-semibold">
                  Curriculum ID
                </TableHead>

                <TableHead className="h-14 w-[12%] whitespace-nowrap px-4 font-semibold">
                  Min Score
                </TableHead>

                <TableHead className="h-14 w-[12%] whitespace-nowrap px-4 font-semibold">
                  Max Score
                </TableHead>

                <TableHead className="h-14 w-[14%] whitespace-nowrap px-4 font-semibold">
                  Document
                </TableHead>

                <TableHead className="h-14 w-[8%] whitespace-nowrap px-4 text-center font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && fetchError && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-red-600"
                  >
                    {fetchError}
                  </TableCell>
                </TableRow>
              )}

              {showEmptyState && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No exams available.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !fetchError &&
                exams.map((exam) => {
                  const isMenuOpen = openMenuId === exam.id;

                  return (
                    <TableRow key={exam.id} className="h-[72px]">
                      <TableCell className="px-4 font-medium">
                        {exam.title}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4">
                        {new Date(exam.date).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4">
                        {exam.curriculumId ?? '—'}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4">
                        {exam.minScore}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-4">
                        {exam.maxScore}
                      </TableCell>

                      <TableCell className="px-4">
                        {exam.documentUrl ? (
                          <a
                            href={exam.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-primary underline underline-offset-4"
                          >
                            View document
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>

                      <TableCell className="px-4 text-center">
                        <div data-exam-menu className="inline-flex">
                          <button
                            type="button"
                            aria-label={`Actions for ${exam.title}`}
                            aria-haspopup="menu"
                            aria-expanded={isMenuOpen}
                            onClick={(event) =>
                              handleMenuToggle(exam.id, event.currentTarget)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-md text-xl text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                          >
                            <span aria-hidden="true">⋯</span>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <div
            data-exam-menu
            role="menu"
            aria-hidden={openMenuId === null}
            className={`fixed z-[9999] w-36 rounded-md border border-gray-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-200 ease-out ${
              openMenuId !== null && menuPosition
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
            style={{
              top: menuPosition?.top ?? 0,
              left: menuPosition?.left ?? 0,
              transformOrigin: 'top right',
            }}
          >
            {openMenuId !== null &&
              (() => {
                const selectedExam = exams.find(
                  (exam) => exam.id === openMenuId,
                );

                if (!selectedExam) return null;

                return (
                  <>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleEditExam(selectedExam)}
                      className="w-full rounded-sm px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleDeleteExam(selectedExam)}
                      className="w-full rounded-sm px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                    >
                      Delete
                    </button>
                  </>
                );
              })()}
          </div>,
          document.body,
        )}
      <DeleteExamModal
        open={!!examToDelete}
        examName={examToDelete?.title || ''}
        onYes={handleConfirmDelete}
        onNo={() => setExamToDelete(null)}
        isLoading={isDeleting}
        error={deleteError ?? undefined}
      />

      <ExamModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateSuccess={handleCreateSuccess}
      />
    </div>
  );
}
