import { FormDialog } from '../ui/form-dialog';
import { SectionForm } from './section-form';
import type { SectionDto } from 'dtos';

type SectionModalProps = {
  open: boolean;
  onClose: () => void;
  onUpdateSuccess: (updateSection: SectionDto) => void;
  onCreateSuccess: (createSection: SectionDto) => void;
  section?: SectionDto;
};

export default function SectionModal({
  open,
  onClose,
  onUpdateSuccess,
  onCreateSuccess,
  section,
}: SectionModalProps) {
  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={section ? 'Update Secction' : 'Create Section'}
      description={
        section
          ? 'Update the section details and save your changes.'
          : 'Fill in the details below to add a new section to the system.'
      }
    >
      <SectionForm
        onCancel={onClose}
        onCreateSuccess={onCreateSuccess}
        onUpdateSuccess={onUpdateSuccess}
        section={section}
      />
    </FormDialog>
  );
}
