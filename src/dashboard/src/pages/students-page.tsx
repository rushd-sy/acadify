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
import { useState } from 'react';
import DeleteStudentModal from '@/components/delete-student-modal';
import { studentService } from '@/services/student.service';
import UpdateStudentModal from '@/components/update-student-modal';

const array = [
  {
    id: '1',
    name: 'Yehya',
    secondName: 'msouty',
    number: '092323223',
    email: 'yehya@gmail.com',
  },
  {
    id: '2',
    name: 'adel',
    secondName: 'obaji',
    number: '092323223',
    email: 'adel@gmail.com',
  },
];

export default function StudentsPage() {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [students, setStudents] = useState(array);
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentToUpdate, setStudentToUpdate] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirmDelete = async () => {
    if (!studentToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await studentService.deleteStudentById(studentToDelete);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentToDelete),
      );
      setStudentToDelete(null);
    } catch (error) {
      console.log(`Failed to delete student: ${error}`);
      setDeleteError('Failed to delete the student. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setStudentToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="container mx-auto mt-20 max-w-5xl px-4">
      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            A list of registered students.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((e) => {
              return (
                <TableRow
                  key={e.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/students/${e.id}`)}
                >
                  <TableCell className="font-medium">
                    {e.name} {e.secondName}
                  </TableCell>
                  <TableCell>{e.number}</TableCell>
                  <TableCell>{e.email}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="h-8 px-3 text-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setStudentToUpdate(e.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-8 px-3 text-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setStudentToDelete(e.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DeleteStudentModal
        open={!!studentToDelete}
        studentName={
          students.find((st) => st.id === studentToDelete)?.name || ''
        }
        onYes={handleConfirmDelete}
        onNo={handleCloseModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <UpdateStudentModal
        open={!!studentToUpdate}
        studentId={studentToUpdate || ''}
        onClose={() => setStudentToUpdate(null)}
      />
    </div>
  );
}
