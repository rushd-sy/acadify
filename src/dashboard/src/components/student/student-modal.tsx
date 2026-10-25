import type { StudentDetailsDto } from 'dtos';
import { StudentForm } from './student-form';
import { FormDialog } from '@/components/ui/form-dialog';

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
  const title = student ? 'Update Student' : 'Create Student';
  const description = student
    ? 'Update the student details and save your changes.'
    : 'Fill in the details below to add a new student to the system.';

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <StudentForm
        onCancel={onClose}
        student={student}
        onUpdateSuccess={onUpdateSuccess}
        onCreateSuccess={onCreateSuccess}
      />
    </FormDialog>
  );
}
