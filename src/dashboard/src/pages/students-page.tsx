import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import DeleteStudentModal from '@/components/delete-student-modal';
import { studentService } from '@/services/student.service';
import UpdateStudentModal from '@/components/update-student-modal';
import type { StudentDto } from 'dtos';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [studentToUpdate, setStudentToUpdate] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await studentService.getAllStudents();

        if (!Array.isArray(data)) {
          throw new Error('Invalid students response');
        }

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
    if (studentToDelete === null) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await studentService.deleteStudentById(studentToDelete);

      setStudents((previousStudents) =>
        previousStudents.filter((student) => student.id !== studentToDelete),
      );

      setStudentToDelete(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      setDeleteError('Failed to delete the student. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setStudentToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            A list of registered students.
          </TableCaption>

          <TableHeader>
            <TableRow className="text-base">
              <TableHead className="py-5">Name</TableHead>
              <TableHead className="py-5">Number</TableHead>
              <TableHead className="py-5">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-base">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  Loading students...
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
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  No students available.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="h-16 cursor-pointer"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>

                  <TableCell>-</TableCell>

                  <TableCell>{student.email}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="h-9 px-4 text-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setStudentToUpdate(student.id);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="secondary"
                        className="h-8 px-3 text-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setStudentToDelete(student.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteStudentModal
        open={studentToDelete !== null}
        studentName={
          students.find((student) => student.id === studentToDelete)
            ?.firstName || ''
        }
        onYes={handleConfirmDelete}
        onNo={handleCloseDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <UpdateStudentModal
        open={studentToUpdate !== null}
        studentId={studentToUpdate !== null ? String(studentToUpdate) : ''}
        onClose={() => setStudentToUpdate(null)}
      />
    </div>
  );
}
