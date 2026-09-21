import { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import DeleteModal from '@/components/ui/delete-modal';
import { teacherService } from '@/services/teacher.service';
import type { TeacherDto } from 'dtos';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteClick = (teacher: TeacherDto) => {
    setSelectedTeacher(teacher);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setSelectedTeacher(null);
    setDeleteError(null);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await teacherService.deleteTeacher(selectedTeacher.userId);

      setTeachers((currentTeachers) =>
        currentTeachers.filter(
          (teacher) => teacher.userId !== selectedTeacher.userId,
        ),
      );

      setIsDeleteModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      setDeleteError('Failed to delete teacher. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            A list of registered teachers.
          </TableCaption>

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
                <TableRow key={teacher.userId} className="h-16">
                  <TableCell className="font-medium">
                    {teacher.firstName} {teacher.lastName}
                  </TableCell>

                  <TableCell>{teacher.email}</TableCell>

                  <TableCell>{teacher.degree}</TableCell>

                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(teacher)}
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
          open={isDeleteModalOpen}
          title="Delete Teacher"
          message={
            <>
              Are you sure you want to delete{' '}
              <span className="font-semibold">
                {selectedTeacher?.firstName} {selectedTeacher?.lastName}
              </span>
              ?
            </>
          }
          onConfirm={handleDeleteTeacher}
          onClose={handleCloseDeleteModal}
          isLoading={isDeleting}
          error={deleteError ?? undefined}
        />
      </div>
    </div>
  );
}
