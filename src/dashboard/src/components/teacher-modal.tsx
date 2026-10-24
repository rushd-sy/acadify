import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { TeacherForm } from './teacher-form';
import { FormDialog } from './ui/form-dialog';

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
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={teacher ? 'Update Teacher' : 'Create Teacher'}
      description={
        teacher
          ? 'Update the teacher details and save your changes.'
          : 'Fill in the details below to add a new teacher to the system.'
      }
    >
      <TeacherForm
        onCancel={onClose}
        teacher={teacher}
        onUpdateSuccess={onUpdateSuccess}
        onCreateSuccess={onCreateSuccess}
      />
    </FormDialog>
  );
}
