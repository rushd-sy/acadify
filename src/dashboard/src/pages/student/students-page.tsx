import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '@/components/ui/delete-modal';
import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import StudentModal from '@/components/student/student-modal';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { studentService } from '@/services/student.service';

import type { StudentDetailsDto, StudentDto } from 'dtos';

export default function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentDto[]>([]);
  const [studentToUpdateData, setStudentToUpdateData] =
    useState<StudentDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const {
    itemToDelete: studentToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<StudentDto>(
    'Failed to delete the student. Please try again later.',
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
        setFetchError('Failed to load students. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleConfirmDelete = async () => {
    await handleDelete(
      (studentToRemove) =>
        studentService.deleteStudentById(studentToRemove.userId),
      (deletedStudent) => {
        setStudents((prev) =>
          prev.filter((student) => student.userId !== deletedStudent.userId),
        );
      },
    );
  };

  const handleUpdateSuccess = (updatedStudent: StudentDetailsDto) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.userId === updatedStudent.userId ? updatedStudent : student,
      ),
    );
  };

  const handleCreateSuccess = (createdStudent: StudentDetailsDto) => {
    setStudents((previousStudent) => [...previousStudent, createdStudent]);
  };

  const columns: DataTableColumn<StudentDto>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (student) => (
        <span className="font-medium">
          {student.firstName} {student.lastName}
        </span>
      ),
    },
    {
      id: 'number',
      header: 'Number',
      cell: () => '-',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <PageHeader
        title="Students"
        description="A list of registered students."
        action={{
          label: 'Add Student',
          onClick: () => {
            setStudentToUpdateData(null);
            setIsStudentModalOpen(true);
          },
        }}
      />

      <DataTable
        columns={columns}
        data={students}
        rowKey="userId"
        isLoading={isLoading}
        loadingMessage="Loading students..."
        error={fetchError ?? undefined}
        emptyMessage="No students available."
        onRowClick={(student) => navigate(`/students/${student.userId}`)}
        actions={(student) => (
          <DropdownMenu
            items={[
              {
                label: 'Edit',
                onSelect: async () => {
                  try {
                    const studentDetails = await studentService.getStudentById(
                      student.userId,
                    );
                    setStudentToUpdateData(studentDetails);
                    setIsStudentModalOpen(true);
                  } catch (error) {
                    console.error(`Failed to fetch student details: ${error}`);
                  }
                },
              },
              {
                label: 'Delete',
                variant: 'destructive',
                onSelect: () => openDeleteModal(student),
              },
            ]}
          />
        )}
      />

      <DeleteModal
        open={studentToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{studentToDelete?.firstName}</span>?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <StudentModal
        open={isStudentModalOpen}
        student={studentToUpdateData ?? undefined}
        onUpdateSuccess={handleUpdateSuccess}
        onCreateSuccess={handleCreateSuccess}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToUpdateData(null);
        }}
      />
    </div>
  );
}
