import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import UpdateStudentModal from '@/components/ui/update-student-modal';
import DeleteStudentModal from '@/components/ui/delete-student-modal';
import { studentService } from '@/services/student.service';

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
    <div className="bg-white w-[50%] mx-auto mt-20 p-10 rounded-lg">
      <h1 className="text-3xl font-bold mb-8">Student Details</h1>

      <div className="space-y-4 text-xl">
        <p>
          <strong>First Name:</strong> {student.name}
        </p>

        <p>
          <strong>Second Name:</strong> {student.secondName}
        </p>

        <p>
          <strong>Phone Number:</strong> {student.number}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>
      </div>

      <ButtonGroup className="mt-8">
        <Button onClick={() => setIsUpdateOpen(true)}>Edit</Button>
        <Button onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
      </ButtonGroup>

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
