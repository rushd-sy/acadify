import type { ExamDto } from 'dtos';
import { FormDialog } from '../ui/form-dialog';
import { ExamForm } from './exam-form';

type ExamModalProps = {
  open: boolean;
  exam?: ExamDto;
  onClose: () => void;
  onCreateSuccess: (createExam: ExamDto) => void;
};

export default function ExamModal({
  open,
  exam,
  onClose,
  onCreateSuccess,
}: ExamModalProps) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Create exam"
      description="Fill in the details below to add a new exam to the system."
    >
      <ExamForm
        onCancel={onClose}
        onCreateSuccess={onCreateSuccess}
        exam={exam}
      />
    </FormDialog>
  );
}
