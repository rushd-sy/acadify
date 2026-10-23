import type { StudentDetailsDto } from 'dtos';
import { StudentForm } from './student-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type StudentModalProps = {
  open: boolean;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onCreateSuccess: (createdStudent: StudentDetailsDto) => void;
  onClose: () => void;
};

export default function StudentModal({
  open,
  student,
  onUpdateSuccess,
  onCreateSuccess,
  onClose,
}: StudentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Update Student' : 'Create Student'}
          </DialogTitle>
          <DialogDescription>
            {student
              ? 'Update the students details and save your changes.'
              : 'Fill in the details below to add a new student to the system.'}
          </DialogDescription>
        </DialogHeader>

        <StudentForm
          onCancel={onClose}
          student={student}
          onUpdateSuccess={onUpdateSuccess}
          onCreateSuccess={onCreateSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
