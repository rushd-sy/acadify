import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import DeleteStudentModal from '@/components/delete-student-modal';
import StudentModal from '@/components/student/student-modal';

import { studentService } from '@/services/student.service';
import type { StudentDetailsDto, StudentDto } from 'dtos';

export default function StudentsPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentDto[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    userId: number;
    action: 'delete' | 'update';
  } | null>(null);
  const [studentToUpdateData, setStudentToUpdateData] =
    useState<StudentDetailsDto | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

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
    if (selectedStudent === null) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await studentService.deleteStudentById(selectedStudent.userId);

      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student.userId !== selectedStudent.userId,
        ),
      );

      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
      setDeleteError('Failed to delete the student. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setSelectedStudent(null);
    setDeleteError(null);
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

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="mb-4 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setStudentToUpdateData(null);
              setIsStudentModalOpen(true);
            }}
          >
            Add Student
          </Button>
        </div>
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
                  key={student.userId}
                  className="h-16 cursor-pointer"
                  onClick={() => navigate(`/students/${student.userId}`)}
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
                        onClick={async (event) => {
                          event.stopPropagation();
                          try {
                            const studentDetails =
                              await studentService.getStudentById(
                                student.userId,
                              );
                            setStudentToUpdateData(studentDetails);
                            setIsStudentModalOpen(true);
                          } catch (error) {
                            console.error(
                              `Failed to fetch student details: ${error}`,
                            );
                          }
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="secondary"
                        className="h-8 px-3 text-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedStudent({
                            userId: student.userId,
                            action: 'delete',
                          });
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
        open={selectedStudent?.action === 'delete'}
        studentName={
          students.find((student) => student.userId === selectedStudent?.userId)
            ?.firstName || ''
        }
        onYes={handleConfirmDelete}
        onNo={handleCloseDeleteModal}
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
