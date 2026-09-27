import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { TeacherForm } from './teacher-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type TeacherModalProps = {
  open: boolean;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
  onClose: () => void;
};

export default function TeacherModal({
  open,
  teacher,
  onUpdateSuccess,
  onCreateSuccess,
  onClose,
}: TeacherModalProps) {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[450px]">
        <h2 className="mb-6 text-2xl font-semibold">
          {teacher ? 'Update Teacher' : 'Create Teacher'}
        </h2>
        <TeacherForm
          onCancel={onClose}
          teacher={teacher}
          onUpdateSuccess={onUpdateSuccess}
          onCreateSuccess={onCreateSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
