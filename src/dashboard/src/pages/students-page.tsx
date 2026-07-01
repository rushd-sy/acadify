import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
import DeleteStudentModal from '@/components/ui/delete-student-modal';

type Student = {
  id: string;
  name: string;
  secondName: string;
  number: string;
  email: string;
};
const fakeArray: Student[] = [
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

async function handleConfirmDelete(
  studentId: string | null,
  closeModal: () => void,
) {
  if (!studentId) return;

  closeModal();
}

export default function StudentsPage() {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
   const navigate = useNavigate();

  return (
      <div className="h-[500px] overflow-y-auto mt-20 bg-white w-[70%] p-20 mx-auto">
      <Table>
        <TableCaption className="text-2xl">
          Double Click to View Student Information
        </TableCaption>
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
          {fakeArray.map((e) => {
            return (
              <TableRow
                key={e.id}
                className="bg-gray-50 hover:bg-gray-100"
                onDoubleClick={() =>
                  navigate(`/students/${e.id}`, {
                    state: { student: e },
                  })
                }
              >
                <TableCell className="py-6">{e.name}</TableCell>
                <TableCell className="py-6">{e.secondName}</TableCell>
                <TableCell className="py-6">{e.number}</TableCell>
                <TableCell className="py-6">{e.email}</TableCell>
                <TableCell className="py-6">
                  <ButtonGroup>
                    <Button className="text-lg p-4">Edit</Button>
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
        studentName={fakeArray.find((st) => st.id === studentToDelete)?.name || ''}
        onYes={() =>
          handleConfirmDelete(studentToDelete, () => setStudentToDelete(null))
        }
        onNo={() => setStudentToDelete(null)}
      />
    </div>
  );
}
