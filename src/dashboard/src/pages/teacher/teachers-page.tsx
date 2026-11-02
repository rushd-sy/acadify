import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeleteModal from '@/components/ui/delete-modal';
import { teacherService } from '@/services/teacher.service';
import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { Button } from '@/components/ui/button';
import TeacherModal from '@/components/teacher/teacher-modal';
import { PageHeader } from '@/components/ui/page-header';
import { useDeleteModal } from '@/hooks/use-delete-modal';

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

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
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
        <Table>
          <TableHeader>
            <TableRow className="text-base">
              <TableHead className="py-5">Name</TableHead>
              <TableHead className="py-5">Email</TableHead>
              <TableHead className="py-5">Degree</TableHead>
              <TableHead className="py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-base">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  Loading teachers...
                </TableCell>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-red-600"
                >
                  {fetchError}
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  No teachers available.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow
                  key={teacher.userId}
                  className="h-16 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/teachers/${teacher.userId}`)}
                >
                  <TableCell className="font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </TableCell>

                  <TableCell>{teacher.email}</TableCell>

                  <TableCell>{teacher.degree}</TableCell>

                  <TableCell>
                    <Button
                      variant="secondary"
                      className="h-9 px-4 text-sm"
                      onClick={async (event) => {
                        event.stopPropagation();

                        try {
                          const teacherDetails =
                            await teacherService.getTeacherById(teacher.userId);

                          setTeacherToEditData(teacherDetails);
                          setIsTeacherModalOpen(true);
                        } catch (error) {
                          console.error(
                            'Failed to fetch teacher details:',
                            error,
                          );
                        }
                      }}
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeleteModal(teacher);
                      }}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
    </div>
  );
}
