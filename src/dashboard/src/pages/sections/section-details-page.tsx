import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { RowActionsMenu } from '@/components/ui/dropdown-menu';
import SectionModal from '@/components/section/section-modal';
import { sectionService } from '@/services/section.service';

import type { SectionDto } from 'dtos';

type SectionTeacher = NonNullable<SectionDto['teachers']>[number];
type SectionStudent = NonNullable<SectionDto['students']>[number];

const getStudentNumber = (student: SectionStudent) =>
  `202300${student.studentId}`;

const getAvatarStyle = (name?: string) => {
  const styles = [
    'bg-[var(--brand-sand)] text-[var(--brand-graphite)]',
    'bg-[var(--brand-terracotta)] text-white',
    'bg-[var(--brand-paper)] text-[var(--brand-deep-stone)] border border-[var(--brand-sand)]',
    'bg-[var(--brand-graphite)] text-white',
    'bg-[var(--brand-deep-stone)] text-white',
    'bg-white text-[var(--brand-terracotta)] border border-[var(--brand-sand)]',
  ];

  return styles[(name?.length ?? 0) % styles.length];
};

export default function SectionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<SectionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="p-8 text-center text-destructive">
        {error || 'Section not found'}
      </div>
    );
  }

  const teachersList = section.teachers || [];
  const studentsList = section.students || [];

  const filteredTeachers = teachersList.filter((teacher) =>
    `${teacher.teacherFirstName} ${teacher.teacherLastName}`
      .toLowerCase()
      .includes(teacherSearch.toLowerCase()),
  );

  const filteredStudents = studentsList.filter((student) => {
    const searchValue = studentSearch.toLowerCase();

    return (
      `${student.studentFirstName} ${student.studentLastName}`
        .toLowerCase()
        .includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue) ||
      getStudentNumber(student).includes(searchValue)
    );
  });

  const teacherColumns: DataTableColumn<SectionTeacher>[] = [
    {
      id: 'name',
      header: 'Teacher',
      cell: (teacher) => {
        const initials =
          `${teacher.teacherFirstName?.[0] ?? ''}${teacher.teacherLastName?.[0] ?? ''}`.toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarStyle(teacher.teacherFirstName)}`}
            >
              {initials}
            </div>

            <span className="font-medium text-foreground">
              {teacher.teacherFirstName} {teacher.teacherLastName}
            </span>
          </div>
        );
      },
    },
  ];

  const studentColumns: DataTableColumn<SectionStudent>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (student) => (
        <span className="font-medium">
          {student.studentFirstName} {student.studentLastName}
        </span>
      ),
    },
    {
      id: 'number',
      header: 'Number',
      cell: (student) => getStudentNumber(student),
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* Section Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{section.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview and members of this section.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setIsEditModalOpen(true)}
          className="shrink-0 gap-2"
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
      </header>

      {/* Section Overview */}
      <section className="mb-8 border-b border-border pb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Section Overview
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Academic Year
            </span>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {section.academicYear}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Grade
            </span>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {section.gradeId}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Teachers
            </span>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {teachersList.length}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Students
            </span>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {studentsList.length}
            </p>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Teachers</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="search"
              value={teacherSearch}
              onChange={(event) => setTeacherSearch(event.target.value)}
              placeholder="Search teachers by name..."
              className="w-full sm:w-80"
            />

            <Button type="button" className="shrink-0 gap-2">
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
              Add Teacher
            </Button>
          </div>
        </div>

        <DataTable
          columns={teacherColumns}
          data={filteredTeachers}
          rowKey={(teacher, index) => `${teacher.teacherId}-${index}`}
          emptyMessage="No teachers assigned to this section yet."
          onRowClick={(teacher) => navigate(`/teachers/${teacher.teacherId}`)}
          actions={(teacher) => (
            <div className="flex w-full justify-end">
              <RowActionsMenu
                label={`Actions for ${teacher.teacherFirstName} ${teacher.teacherLastName}`}
                items={[
                  {
                    label: 'View Profile',
                    onSelect: () => navigate(`/teachers/${teacher.teacherId}`),
                  },
                ]}
              />
            </div>
          )}
        />
      </section>

      {/* Students */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Students</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="search"
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="Search students by name, email, or number..."
              className="w-full sm:w-80"
            />

            <Button className="gap-2">
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

        <DataTable
          columns={studentColumns}
          data={filteredStudents}
          rowKey="studentId"
          emptyMessage="No students found in this section."
          onRowClick={(student) => navigate(`/students/${student.studentId}`)}
          actions={(student) => (
            <div className="flex w-full justify-end">
              <RowActionsMenu
                label={`Actions for ${student.studentFirstName} ${student.studentLastName}`}
                items={[
                  {
                    label: 'View',
                    onSelect: () => navigate(`/students/${student.studentId}`),
                  },
                ]}
              />
            </div>
          )}
        />
      </section>

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
    </div>
  );
}
