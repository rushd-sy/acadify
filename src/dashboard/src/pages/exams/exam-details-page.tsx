import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import DeleteModal from '@/components/ui/delete-modal';
import ExamModal from '@/components/exam/exam-modal';
import { useNumericParam } from '@/hooks/use-numeric-param';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { examService } from '@/services/exam.service';
import type { ExamDto, ExamSectionDto } from 'dtos';

const getSectionStatus = (
  startAt: Date | string,
  durationMinutes: number = 0,
) => {
  const startTime = new Date(startAt).getTime();
  if (isNaN(startTime)) {
    return {
      label: 'Scheduled',
      className: 'bg-gray-100 text-gray-600 border border-gray-200',
      dotClassName: 'bg-gray-400',
    };
  }

  const now = Date.now();
  const endTime = startTime + durationMinutes * 60 * 1000;

  if (now < startTime) {
    return {
      label: 'Upcoming',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      dotClassName: 'bg-emerald-500',
    };
  }

  if (now >= startTime && now <= endTime) {
    return {
      label: 'In Progress',
      className: 'bg-amber-50 text-amber-700 border border-amber-200',
      dotClassName: 'bg-amber-500',
    };
  }

  return {
    label: 'Completed',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
    dotClassName: 'bg-gray-400',
  };
};

export default function ExamDetailsPage() {
  const navigate = useNavigate();
  const examId = useNumericParam('id');
  const [exam, setExam] = useState<ExamDto | null>(null);
  const [assignedSections, setAssignedSections] = useState<ExamSectionDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

    const loadExamData = async () => {
      if (!examId) {
        if (isMounted) {
          setFetchError('Invalid exam ID.');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        const [examResult, sectionsResult] = await Promise.allSettled([
          examService.getExamById(examId),
          examService.getAssignedSections(examId),
        ]);

        if (!isMounted) return;

        if (examResult.status === 'fulfilled') {
          setExam(examResult.value);
        } else {
          console.error('Failed to load exam details:', examResult.reason);
          setFetchError('Failed to load exam details. Please try again later.');
        }

        if (sectionsResult.status === 'fulfilled') {
          setAssignedSections(sectionsResult.value);
        } else {
          console.error(
            'Failed to load assigned sections:',
            sectionsResult.reason,
          );
        }
      } catch (error) {
        console.error('Unexpected error loading exam details:', error);
        if (isMounted) {
          setFetchError('Failed to load exam details. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExamData();

    return () => {
      isMounted = false;
    };
  }, [examId]);

  const handleConfirmDelete = async () => {
    if (!exam) return;
    await handleDelete(
      () => examService.deleteExamById(exam.id),
      () => navigate('/exams'),
    );
  };

  const handleUpdateSuccess = (updatedExam: ExamDto) => {
    setExam(updatedExam);
    setIsEditModalOpen(false);
  };

  const displayedSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return assignedSections;

    return assignedSections.filter((s) => {
      const sectionName = (
        s.sectionName ?? `Section #${s.sectionId}`
      ).toLowerCase();
      const academicYear = (s.academicYear ?? '').toLowerCase();
      const grade = s.gradeId !== undefined ? `grade ${s.gradeId}` : '';
      const gradeNumber = s.gradeId !== undefined ? String(s.gradeId) : '';

      return (
        sectionName.includes(query) ||
        academicYear.includes(query) ||
        grade.includes(query) ||
        gradeNumber.includes(query)
      );
    });
  }, [assignedSections, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (fetchError && !exam) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{fetchError}</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/exams')}
            className="mt-4"
          >
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  return (
    <div className="w-full p-8 space-y-8">
      <Card className="border-0 shadow-none">
        <CardHeader className="border-b bg-white pb-6 px-0">
          <CardTitle className="mx-auto text-2xl font-bold">
            {exam.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-10 px-0">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Exam Date
              </span>
              <span className="text-lg font-semibold">
                {new Date(exam.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Passing / Max Score
              </span>
              <span className="text-lg font-semibold">
                {exam.minScore} / {exam.maxScore} pts
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Curriculum
              </span>
              <span className="text-lg font-semibold">
                {exam.curriculumId ? `Curriculum #${exam.curriculumId}` : '—'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Assessment Sheet
              </span>
              <span className="text-lg font-semibold">
                {exam.documentUrl ? (
                  <a
                    href={exam.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    View document
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : (
                  <span className="text-gray-400 font-normal text-base">
                    No document attached
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/50 pt-6">
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Edit Exam
          </Button>

          <Button variant="secondary" onClick={() => openDeleteModal(exam)}>
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-0 shadow-none">
        <CardHeader className="border-b bg-white p-6 sm:p-8 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Assigned Sections ({displayedSections.length})
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                List of sections taking this assessment and their respective
                schedules.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white py-1.5 pl-9 pr-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          {displayedSections.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-base font-medium">
                {searchQuery
                  ? 'No sections match your search query.'
                  : 'No sections assigned to this exam.'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {searchQuery
                  ? 'Try clearing your search query.'
                  : 'Use the assignment action to link class sections.'}
              </p>
              {searchQuery && (
                <Button
                  variant="secondary"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayedSections.map((sec) => (
                <div
                  key={sec.id}
                  className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-gray-300 transition-all hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => navigate(`/sections/${sec.sectionId}`)}
                        className="font-bold text-gray-900 hover:text-primary cursor-pointer text-base"
                      >
                        {sec.sectionName ?? `Section #${sec.sectionId}`}
                      </h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {sec.gradeId ? `Grade ${sec.gradeId}` : '—'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Academic Year: {sec.academicYear ?? '—'}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Time:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(sec.startAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          •{' '}
                          {new Date(sec.startAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-semibold text-gray-900">
                          {sec.duration} mins
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status:</span>
                        {(() => {
                          const status = getSectionStatus(
                            sec.startAt,
                            sec.duration,
                          );
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${status.dotClassName}`}
                              />
                              {status.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/sections/${sec.sectionId}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Details
                      <ExternalLink className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
        open={isEditModalOpen}
        exam={exam ?? undefined}
        onUpdateSuccess={handleUpdateSuccess}
        onCreateSuccess={() => {}}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
