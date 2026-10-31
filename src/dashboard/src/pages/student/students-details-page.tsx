import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DeleteModal from '@/components/ui/delete-modal';
import UpdateStudentModal from '@/components/student/student-modal';
import { studentService } from '@/services/student.service';
import type { StudentDetailsDto } from 'dtos';
import { useDeleteModal } from '@/hooks/use-delete-modal';

export default function StudentsDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const userId = Number(id);

  const {
    itemToDelete: studentToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<StudentDetailsDto>();
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setFetchError('Student ID is missing.');
        setIsLoading(false);
        return;
      }

      if (!Number.isInteger(userId) || userId <= 0) {
        setFetchError('Invalid student ID.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await studentService.getStudentById(userId);
        setStudent(data);
      } catch (error) {
        console.error('Failed to fetch student:', error);
        setStudent(null);
        setFetchError('Failed to load student. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id, userId]);

  const handleConfirmDelete = () => {
    handleDelete(
      (student) => studentService.deleteStudentById(student.userId),
      () => {
        navigate('/students');
      },
    );
  };

  if (isLoading) {
    return <div className="mt-20 text-center text-2xl">Loading student...</div>;
  }

  if (fetchError) {
    return (
      <div className="mt-20 text-center text-2xl text-red-600">
        {fetchError}
      </div>
    );
  }

  if (!student) {
    return <div className="mt-20 text-center text-2xl">Student Not Found</div>;
  }

  const handleUpdateSuccess = (updatedStudent: StudentDetailsDto) => {
    setStudent(updatedStudent);
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <Card className="border-0 shadow-none">
        <CardHeader className="border-b bg-white pb-6 px-0">
          <CardTitle className="mx-auto text-2xl font-bold">
            Student Details
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-10 px-0">
          <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                First Name
              </span>
              <span className="text-lg font-semibold">{student.firstName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Second Name
              </span>
              <span className="text-lg font-semibold">{student.lastName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Phone Number
              </span>
              <span className="text-lg font-semibold">
                {student.phoneNumber}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-lg font-semibold">{student.email}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/50 pt-6">
          <Button variant="secondary" onClick={() => setIsUpdateOpen(true)}>
            Edit
          </Button>

          <Button variant="secondary" onClick={() => openDeleteModal(student)}>
            Delete
          </Button>
        </CardFooter>
      </Card>

      <DeleteModal
        open={!!studentToDelete}
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
        error={deleteError ?? undefined}
      />

      <UpdateStudentModal
        open={isUpdateOpen}
        student={student}
        onClose={() => setIsUpdateOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
        onCreateSuccess={() => {}}
      />
    </div>
  );
}
