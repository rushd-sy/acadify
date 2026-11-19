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

const getAvatarStyle = (name: string) => {
  const styles = [
    'bg-[var(--brand-sand)] text-[var(--brand-graphite)]',
    'bg-[var(--brand-terracotta)] text-white',
    'bg-[var(--brand-paper)] text-[var(--brand-deep-stone)] border border-[var(--brand-sand)]',
    'bg-[var(--brand-graphite)] text-white',
  ];

  return styles[name.length % styles.length];
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
      `202300${student.studentId}`.includes(searchValue)
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
      cell: (student) => `202300${student.studentId}`,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white p-8">
      {/* Section Information */}
      <section className="mb-8 border-b border-border">
        <div className="border-b border-border py-6">
          <h1 className="text-center text-2xl font-bold text-foreground">
            {section.name}
          </h1>
        </div>

        <div className="space-y-8 py-8">
          {/* Academic Information */}
          <div className="flex flex-wrap gap-x-24 gap-y-6">
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
          </div>

          {/* Teachers */}
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Teachers ({teachersList.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <Input
                  type="search"
                  value={teacherSearch}
                  onChange={(event) => setTeacherSearch(event.target.value)}
                  placeholder="Search teachers by name..."
                  className="w-full sm:w-80"
                />

                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(true)}
                  className="shrink-0 gap-2 px-6"
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

            <DataTable
              columns={teacherColumns}
              data={filteredTeachers}
              rowKey="teacherId"
              emptyMessage="No teachers assigned to this section yet."
              onRowClick={(teacher) =>
                navigate(`/teachers/${teacher.teacherId}`)
              }
              actions={(teacher) => (
                <RowActionsMenu
                  label={`Actions for ${teacher.teacherFirstName} ${teacher.teacherLastName}`}
                  items={[
                    {
                      label: 'View Profile',
                      onSelect: () =>
                        navigate(`/teachers/${teacher.teacherId}`),
                    },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* Students */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">
            Students ({studentsList.length})
          </h2>

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
            <RowActionsMenu
              label={`Actions for ${student.studentFirstName} ${student.studentLastName}`}
              items={[
                {
                  label: 'View',
                  onSelect: () => navigate(`/students/${student.studentId}`),
                },
              ]}
            />
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
