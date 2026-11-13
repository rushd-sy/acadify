import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '@/components/ui/delete-modal';
import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import TeacherModal from '@/components/teacher/teacher-modal';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { teacherService } from '@/services/teacher.service';

import type { TeacherDetailsDto, TeacherDto } from 'dtos';

export default function TeachersPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [teacherToEditData, setTeacherToEditData] =
    useState<TeacherDetailsDto | null>(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const {
    itemToDelete: teacherToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<TeacherDto>(
    'Failed to delete the teacher. Please try again later.',
  );

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await teacherService.getAllTeachers();

        setTeachers(data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setTeachers([]);
        setFetchError('Failed to load teachers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleConfirmDelete = async () => {
    await handleDelete(
      (teacherToRemove) => teacherService.deleteTeacher(teacherToRemove.userId),
      (deletedTeacher) => {
        setTeachers((current) =>
          current.filter((teacher) => teacher.userId !== deletedTeacher.userId),
        );
      },
    );
  };

  const handleUpdateSuccess = (updatedTeacher: TeacherDetailsDto) => {
    setTeachers((previousTeachers) =>
      previousTeachers.map((teacher) =>
        teacher.userId === updatedTeacher.userId ? updatedTeacher : teacher,
      ),
    );
  };

  const handleCreateSuccess = (createdTeacher: TeacherDto) => {
    setTeachers((previousTeachers) => [...previousTeachers, createdTeacher]);
  };

  const columns: DataTableColumn<TeacherDto>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (teacher) => (
        <span className="font-medium">
          {teacher.firstName} {teacher.lastName}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'degree',
      header: 'Degree',
      accessorKey: 'degree',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <PageHeader
        title="Teachers"
        description="A list of registered teachers."
        action={{
          label: 'Add Teacher',
          onClick: () => {
            setTeacherToEditData(null);
            setIsTeacherModalOpen(true);
          },
        }}
      />

      <DataTable
        columns={columns}
        data={teachers}
        rowKey="userId"
        isLoading={isLoading}
        loadingMessage="Loading teachers..."
        error={fetchError ?? undefined}
        emptyMessage="No teachers available."
        onRowClick={(teacher) => navigate(`/teachers/${teacher.userId}`)}
        actions={(teacher) => (
          <DropdownMenu
            items={[
              {
                label: 'Edit',
                onSelect: async () => {
                  try {
                    const teacherDetails = await teacherService.getTeacherById(
                      teacher.userId,
                    );

                    setTeacherToEditData(teacherDetails);
                    setIsTeacherModalOpen(true);
                  } catch (error) {
                    console.error('Failed to fetch teacher details:', error);
                  }
                },
              },
              {
                label: 'Delete',
                variant: 'destructive',
                onSelect: () => openDeleteModal(teacher),
              },
            ]}
          />
        )}
      />

      <DeleteModal
        open={teacherToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {teacherToDelete?.firstName} {teacherToDelete?.lastName}
            </span>
            ?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <TeacherModal
        open={isTeacherModalOpen}
        teacher={teacherToEditData ?? undefined}
        onUpdateSuccess={handleUpdateSuccess}
        onCreateSuccess={handleCreateSuccess}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setTeacherToEditData(null);
        }}
      />
    </div>
  );
}
