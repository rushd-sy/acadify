import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Link } from 'react-router-dom';
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
import UpdateStudentModal from '@/components/ui/update-student-modal';

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
      setStudentToDelete(null);
    }
  };

  const handleCloseMoadal = () => {
    setStudentToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="h-[500px] overflow-y-auto mt-20 bg-white w-[70%] p-20 mx-auto">
      <Table>
        <TableCaption className="text-2xl">Students Informaition</TableCaption>
        <TableHeader>
          <TableRow className="text-2xl p-5">
            <TableHead>Name</TableHead>
            <TableHead>Second Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-xl">
          {students.map((e) => {
            return (
              <TableRow key={e.id} className="bg-gray-50 hover:bg-gray-100">
                <TableCell className="py-6">
                  <Link to={`/students/${e.id}`}>{e.name}</Link>
                </TableCell>

                <TableCell className="py-6">{e.secondName}</TableCell>
                <TableCell className="py-6">{e.number}</TableCell>
                <TableCell className="py-6">{e.email}</TableCell>

                <TableCell className="py-6">
                  <ButtonGroup>
                    <Button
                      className="text-lg p-4"
                      onClick={() => setStudentToUpdate(e.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="text-lg p-4"
                      onClick={() => setStudentToDelete(e.id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DeleteStudentModal
        open={!!studentToDelete}
        studentName={
          students.find((st) => st.id === studentToDelete)?.name || ''
        }
        onYes={handleConfirmDelete}
        onNo={handleCloseMoadal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <UpdateStudentModal
        open={!!studentToUpdate}
        studentId={studentToUpdate}
        onClose={() => setStudentToUpdate(null)}
      />
    </div>
  );
}
