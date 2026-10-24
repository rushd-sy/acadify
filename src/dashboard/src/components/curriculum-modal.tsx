import { CurriculumForm } from './CurriculumForm';
import type { CurriculumDto } from 'dtos';
import { FormDialog } from './ui/form-dialog';

type CurriculumModalProps = {
  open: boolean;
  curriculum?: CurriculumDto;
  onClose: () => void;
  onUpdateSuccess: (updateCurriculum: CurriculumDto) => void;
  onCreateSuccess: (createCurriculum: CurriculumDto) => void;
};

export default function CurriculumModal({
  open,
  curriculum,
  onClose,
  onUpdateSuccess,
  onCreateSuccess,
}: CurriculumModalProps) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={curriculum ? 'Update Curriculum' : 'Create Curriculum'}
      description={
        curriculum
          ? 'Update the curriculum details and save your changes.'
          : 'Fill in the details below to add a new curriculum to the system.'
      }
    >
      <CurriculumForm
        key={curriculum ? curriculum.id : -1}
        onCancel={onClose}
        curriculum={curriculum}
        onUpdateSuccess={onUpdateSuccess}
        onCreateSuccess={onCreateSuccess}
      />
    </FormDialog>
  );
}
