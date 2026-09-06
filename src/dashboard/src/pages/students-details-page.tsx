import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UpdateStudentModal from '@/components/update-student-modal';
import DeleteStudentModal from '@/components/delete-student-modal';
import { studentService } from '@/services/student.service';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

export default function StudentsDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const student = array.find((e) => e.id === id);

  const handleConfirmDelete = async () => {
    if (!id) {
      return;
    }

    try {
      setIsDeleting(true);
      await studentService.deleteStudentById(id);
      navigate('/students');
    } catch (error) {
      console.log(`Failed to delete student: ${error}`);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!student) {
    return <div className="mt-20 text-center text-2xl">Student Not Found</div>;
  }

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
              <span className="text-lg font-semibold">{student.name}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Second Name
              </span>
              <span className="text-lg font-semibold">
                {student.secondName}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Phone Number
              </span>
              <span className="text-lg font-semibold">{student.number}</span>
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
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <DeleteStudentModal
        open={isDeleteModalOpen}
        studentName={student.name}
        onYes={handleConfirmDelete}
        onNo={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />

      <UpdateStudentModal
        open={isUpdateOpen}
        studentId={id ?? null}
        onClose={() => setIsUpdateOpen(false)}
      />
    </div>
  );
}
