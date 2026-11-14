import type { ExamDto } from 'dtos';
import { ExamForm } from './exam-form';
import { FormDialog } from '../ui/form-dialog';

type ExamModalProps = {
  open: boolean;
  exam?: ExamDto;
  onUpdateSuccess: (updatedExam: ExamDto) => void;
  onCreateSuccess: (createdExam: ExamDto) => void;
  onClose: () => void;
};

export default function ExamModal({
  open,
  exam,
  onUpdateSuccess,
  onCreateSuccess,
  onClose,
}: ExamModalProps) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={exam ? 'Update Exam' : 'Create Exam'}
      description={
        exam
          ? 'Update the exam details and save your changes.'
          : 'Fill in the details below to add a new exam to the system.'
      }
    >
      <ExamForm
        onCancel={onClose}
        exam={exam}
        onUpdateSuccess={onUpdateSuccess}
        onCreateSuccess={onCreateSuccess}
      />
    </FormDialog>
  );
}
