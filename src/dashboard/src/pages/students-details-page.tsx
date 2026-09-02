import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useState } from 'react';
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

export default function StudentsDetailsPage() {
  const { id } = useParams();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const student = array.find((e) => e.id === id);

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
        <Button>Delete</Button>
      </ButtonGroup>

      <UpdateStudentModal
        open={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
      />
    </div>
  );
}
