import { DialogContent, Dialog, DialogTitle } from '../ui/dialog';
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[450px]">
        <DialogTitle className="mb-6 text-2xl font-semibold">
          {section ? 'Edit Section' : 'Create Section'}
        </DialogTitle>
        <SectionForm
          onCancel={onClose}
          onUpdateSuccess={onUpdateSuccess}
          onCreateSuccess={onCreateSuccess}
          section={section}
        />
      </DialogContent>
    </Dialog>
  );
}
