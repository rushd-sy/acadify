import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import DeleteModal from '@/components/ui/delete-modal';
import { FormDialog } from '@/components/ui/form-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SectionModal from '@/components/section/section-modal';
import { sectionService } from '@/services/section.service';
import { teacherService } from '@/services/teacher.service';
import type { SectionDto, TeacherDto } from 'dtos';

const getAvatarStyle = (name: string) => {
  const styles = [
    'bg-blue-100 text-blue-700',
    'bg-rose-100 text-rose-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-amber-100 text-amber-700',
    'bg-cyan-100 text-cyan-700',
  ];
  const index = name.length % styles.length;
  return styles[index];
};

type TabType = 'students' | 'details';
interface MenuPosition {
  top: number;
  left: number;
}

export default function SectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<SectionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [teacherActionError, setTeacherActionError] = useState<string | null>(
    null,
  );
  const [openTeacherMenuId, setOpenTeacherMenuId] = useState<number | null>(
    null,
  );
  const [teacherMenuPosition, setTeacherMenuPosition] =
    useState<MenuPosition | null>(null);
  const [teacherToRemove, setTeacherToRemove] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isRemovingTeacher, setIsRemovingTeacher] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    sectionService
      .getSectionById(Number(id))
      .then((data) => {
        if (isMounted) {
          setSection(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch section details:', err);
        if (isMounted) {
          setError('Failed to load section details.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (openTeacherMenuId === null) return;

    const closeMenu = () => {
      setOpenTeacherMenuId(null);
      setTeacherMenuPosition(null);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('[data-teacher-menu]')) {
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
  }, [openTeacherMenuId]);

  const assignedTeacherIds = new Set(
    (section?.teachers ?? []).map((teacher) => teacher.teacherId),
  );

  const openAddTeacher = async () => {
    setIsAddTeacherOpen(true);
    setSelectedTeacherId('');
    setTeacherActionError(null);
    setIsLoadingTeachers(true);
    try {
      setTeachers(await teacherService.getAllTeachers());
    } catch (err) {
      console.error('Failed to fetch teachers for section assignment:', err);
      setTeacherActionError('Failed to load registered teachers.');
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const addTeacher = async () => {
    if (!id || !selectedTeacherId) return;
    setIsAddingTeacher(true);
    setTeacherActionError(null);
    try {
      const updatedSection = await sectionService.addTeacher(
        Number(id),
        Number(selectedTeacherId),
      );
      setSection(updatedSection);
      setIsAddTeacherOpen(false);
    } catch (err) {
      console.error('Failed to assign teacher to section:', err);
      setTeacherActionError('Failed to add teacher to this section.');
    } finally {
      setIsAddingTeacher(false);
    }
  };

  const removeTeacher = async () => {
    if (!id || !teacherToRemove) return;
    setIsRemovingTeacher(true);
    setTeacherActionError(null);
    try {
      const updatedSection = await sectionService.removeTeacher(
        Number(id),
        teacherToRemove.id,
      );
      setSection(updatedSection);
      setTeacherToRemove(null);
    } catch (err) {
      console.error('Failed to remove teacher from section:', err);
      setTeacherActionError('Failed to remove teacher from this section.');
    } finally {
      setIsRemovingTeacher(false);
    }
  };

  const handleTeacherMenuToggle = (
    teacherId: number,
    button: HTMLButtonElement,
  ) => {
    if (openTeacherMenuId === teacherId) {
      setOpenTeacherMenuId(null);
      setTeacherMenuPosition(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 176;
    const viewportPadding = 8;
    const left = Math.max(
      viewportPadding,
      Math.min(
        rect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    setTeacherMenuPosition({ top: rect.bottom + 8, left });
    setOpenTeacherMenuId(teacherId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'Section not found'}
      </div>
    );
  }

  const teacherCount = section.teachers?.length || 0;
  const studentsList = section.students || [];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <span
          className="cursor-pointer transition-colors hover:text-slate-900"
          onClick={() => navigate('/home')}
        >
          Dashboard
        </span>
        <span className="text-slate-400">&gt;</span>
        <span
          className="cursor-pointer transition-colors hover:text-slate-900"
          onClick={() => navigate('/sections')}
        >
          My Sections
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="font-semibold text-slate-900">{section.name}</span>
      </div>

      <div className="mb-8 flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 py-6 text-center">
          <h1 className="text-2xl font-bold text-slate-700">{section.name}</h1>
        </div>

        <div className="p-8">
          <div className="mb-8 flex flex-wrap gap-x-24 gap-y-6">
            <div>
              <span className="text-sm font-medium text-slate-500">
                Academic Year
              </span>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {section.academicYear}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-500">Grade</span>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {section.gradeId}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Teachers ({teacherCount})
              </span>
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={openAddTeacher}
              >
                <span aria-hidden="true">+</span>
                Add Teacher
              </Button>
            </div>
            {teacherCount > 0 ? (
              <div className="flex flex-wrap gap-4">
                {section.teachers!.map((teacher) => {
                  const initials =
                    `${teacher.teacherFirstName[0]}${teacher.teacherLastName[0]}`.toUpperCase();
                  return (
                    <div
                      key={teacher.teacherId}
                      onClick={() => navigate(`/teachers/${teacher.teacherId}`)}
                      className="relative flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-slate-50 p-2 pr-12 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarStyle(teacher.teacherFirstName)}`}
                      >
                        {initials}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {teacher.teacherFirstName} {teacher.teacherLastName}
                      </span>
                      <button
                        type="button"
                        aria-label={`Actions for ${teacher.teacherFirstName} ${teacher.teacherLastName}`}
                        aria-expanded={openTeacherMenuId === teacher.teacherId}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTeacherMenuToggle(
                            teacher.teacherId,
                            event.currentTarget,
                          );
                        }}
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                      >
                        <span aria-hidden="true">•••</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No teachers assigned to this section yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-b-lg border-t border-slate-200 bg-slate-50/30 p-4">
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="px-6"
          >
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
            Edit Section
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'students'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'border-b-2 border-slate-900 text-slate-900'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Details
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'students' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Students ({studentsList.length})
              </h2>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex items-center gap-2">
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
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filter
                </Button>
                <Button className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800">
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Student
                </Button>
              </div>
            </div>

            <div className="relative mb-6 max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <Input
                placeholder="Search students by name, email, or number..."
                className="pl-10"
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="py-4">Name</TableHead>
                    <TableHead className="py-4">Number</TableHead>
                    <TableHead className="py-4">Email</TableHead>
                    <TableHead className="py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-slate-500"
                      >
                        No students found in this section.
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentsList.map((student) => (
                      <TableRow
                        key={student.studentId}
                        className="cursor-pointer transition-colors hover:bg-slate-50"
                        onClick={() =>
                          navigate(`/students/${student.studentId}`)
                        }
                      >
                        <TableCell className="py-4 font-medium text-slate-900">
                          {student.studentFirstName} {student.studentLastName}
                        </TableCell>
                        <TableCell className="py-4 text-slate-500">
                          202300{student.studentId}
                        </TableCell>
                        <TableCell className="py-4 text-slate-500">
                          {student.email}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Button
                            variant="secondary"
                            className="font-semibold text-slate-700"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {studentsList.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>Showing 1 to {studentsList.length} students</span>
                <div className="flex gap-1">
                  <Button variant="secondary" className="h-8 w-8 p-0">
                    &lt;
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-8 w-8 bg-slate-900 p-0 text-white"
                  >
                    1
                  </Button>
                  <Button variant="secondary" className="h-8 w-8 p-0">
                    &gt;
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Section Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-100 p-4">
                <span className="text-sm text-slate-500">Academic Year</span>
                <p className="mt-1 font-semibold text-slate-900">
                  {section.academicYear}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <span className="text-sm text-slate-500">Grade ID</span>
                <p className="mt-1 font-semibold text-slate-900">
                  {section.gradeId}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <span className="text-sm text-slate-500">Total Teachers</span>
                <p className="mt-1 font-semibold text-slate-900">
                  {teacherCount}
                </p>
              </div>
              <div className="rounded-lg border border-slate-100 p-4">
                <span className="text-sm text-slate-500">Total Students</span>
                <p className="mt-1 font-semibold text-slate-900">
                  {studentsList.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SectionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateSuccess={(updatedSection) => {
          setSection(updatedSection);
          setIsEditModalOpen(false);
        }}
        onCreateSuccess={() => {}}
        section={section}
      />

      <FormDialog
        open={isAddTeacherOpen}
        onClose={() => {
          if (!isAddingTeacher) setIsAddTeacherOpen(false);
        }}
        title="Add Teacher"
        description="Select a registered teacher to assign to this section."
      >
        {isLoadingTeachers ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : teacherActionError ? (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {teacherActionError}
          </p>
        ) : teachers.filter(
            (teacher) => !assignedTeacherIds.has(teacher.userId),
          ).length === 0 ? (
          <p className="py-4 text-sm text-slate-500">
            All registered teachers are already assigned to this section.
          </p>
        ) : (
          <select
            value={selectedTeacherId}
            onChange={(event) => setSelectedTeacherId(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select a teacher</option>
            {teachers
              .filter((teacher) => !assignedTeacherIds.has(teacher.userId))
              .map((teacher) => (
                <option key={teacher.userId} value={teacher.userId}>
                  {teacher.firstName} {teacher.lastName} ({teacher.email})
                </option>
              ))}
          </select>
        )}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsAddTeacherOpen(false)}
            disabled={isAddingTeacher}
          >
            Cancel
          </Button>
          <Button
            onClick={addTeacher}
            disabled={
              isAddingTeacher ||
              isLoadingTeachers ||
              !selectedTeacherId ||
              teachers.every((teacher) =>
                assignedTeacherIds.has(teacher.userId),
              )
            }
          >
            {isAddingTeacher ? (
              <Spinner className="text-white" />
            ) : (
              'Add Teacher'
            )}
          </Button>
        </div>
      </FormDialog>

      {typeof document !== 'undefined' &&
        createPortal(
          <div
            data-teacher-menu
            role="menu"
            aria-hidden={openTeacherMenuId === null}
            className={`fixed z-[9999] w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-200 ease-out ${
              openTeacherMenuId !== null && teacherMenuPosition
                ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
            style={{
              top: teacherMenuPosition?.top ?? 0,
              left: teacherMenuPosition?.left ?? 0,
              transformOrigin: 'top right',
            }}
          >
            {openTeacherMenuId !== null &&
              (() => {
                const teacher = section.teachers?.find(
                  (entry) => entry.teacherId === openTeacherMenuId,
                );
                if (!teacher) return null;

                return (
                  <>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => {
                        setOpenTeacherMenuId(null);
                        setTeacherMenuPosition(null);
                        navigate(`/teachers/${teacher.teacherId}`);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setOpenTeacherMenuId(null);
                        setTeacherMenuPosition(null);
                        setTeacherActionError(null);
                        setTeacherToRemove({
                          id: teacher.teacherId,
                          name: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
                        });
                      }}
                    >
                      Remove from Section
                    </button>
                  </>
                );
              })()}
          </div>,
          document.body,
        )}

      <DeleteModal
        open={teacherToRemove !== null}
        title="Remove Teacher from Section"
        message={
          <>
            Remove <strong>{teacherToRemove?.name}</strong> from{' '}
            <strong>{section.name}</strong>? This only removes the teacher's
            assignment from this section and does not delete their account or
            affect other sections.
          </>
        }
        onConfirm={removeTeacher}
        onClose={() => {
          if (!isRemovingTeacher) setTeacherToRemove(null);
        }}
        isLoading={isRemovingTeacher}
        error={teacherActionError ?? undefined}
      />
    </div>
  );
}
