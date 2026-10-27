import type { GradeDto } from 'dtos';
import { GradeForm } from './grade-form';
import { FormDialog } from '@/components/ui/form-dialog';

type GradeModalProps = {
  open: boolean;
  grade?: GradeDto;
  onUpdateSuccess: (updatedGrade: GradeDto) => void;
  onCreateSuccess: (createdGrade: GradeDto) => void;
  onClose: () => void;
};

export default function GradeModal({
  open,
  grade,
  onUpdateSuccess,
  onCreateSuccess,
  onClose,
}: GradeModalProps) {
  if (!open) {
    return null;
  }

  const title = grade ? 'Update Grade' : 'Create Grade';
  const description = grade
    ? 'Update the grade details and save your changes.'
    : 'Fill in the details below to add a new grade to the system.';

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <GradeForm
        onCancel={onClose}
        grade={grade}
        onUpdateSuccess={onUpdateSuccess}
        onCreateSuccess={onCreateSuccess}
      />
    </FormDialog>
  );
}
