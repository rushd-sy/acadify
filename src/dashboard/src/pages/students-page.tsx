import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
          {array.map((e) => {
            return (
              <TableRow key={e.id} className="bg-gray-50 hover:bg-gray-100">
                <TableCell className="py-6">{e.name}</TableCell>
                <TableCell className="py-6">{e.secondName}</TableCell>
                <TableCell className="py-6">{e.number}</TableCell>
                <TableCell className="py-6">{e.email}</TableCell>
                <TableCell className="py-6">
                  <ButtonGroup>
                    <Button className="text-lg p-4">Edit</Button>
                    <Button className="text-lg p-4">Delete</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
