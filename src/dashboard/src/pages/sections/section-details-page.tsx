import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
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
import type { SectionDto } from 'dtos';

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

export default function SectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<SectionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('students');

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

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-slate-900">
              {section.name}
            </h1>
            <p className="text-base text-slate-500">
              Academic Year: {section.academicYear}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2"
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

        <div className="rounded-xl border border-slate-100 p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900">
            Teachers ({teacherCount})
          </h2>

          {teacherCount > 0 ? (
            <div className="flex flex-wrap gap-4">
              {section.teachers!.map((teacher, index) => {
                const initials =
                  `${teacher.teacherFirstName[0]}${teacher.teacherLastName[0]}`.toUpperCase();
                return (
                  <div
                    key={`${teacher.teacherId}-${index}`}
                    onClick={() => navigate(`/teachers/${teacher.teacherId}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-100 bg-white p-2 pr-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarStyle(teacher.teacherFirstName)}`}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {teacher.teacherFirstName} {teacher.teacherLastName}
                    </span>
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
                <Button className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2">
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

            <div className="mb-6 max-w-md relative">
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
                  <Button variant="secondary" className="w-8 h-8 p-0">
                    &lt;
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-8 h-8 p-0 bg-slate-900 text-white"
                  >
                    1
                  </Button>
                  <Button variant="secondary" className="w-8 h-8 p-0">
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
        onSuccess={(updatedSection) => {
          setSection(updatedSection);
          setIsEditModalOpen(false);
        }}
        section={section}
      />
    </div>
  );
}
