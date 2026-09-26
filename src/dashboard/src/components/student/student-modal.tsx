import type { StudentDetailsDto } from 'dtos';
import { StudentForm } from './student-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
      <DialogContent className="w-[450px]">
        <h2 className="mb-6 text-2xl font-semibold">
          {student ? 'Update Student' : 'Create Student'}
        </h2>
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
