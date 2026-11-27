import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { AssignSectionsForm } from './assign-sections.form';

type AssignSectionsModalProps = {
  open: boolean;
  examId: number;
  onClose: () => void;
  onAssignSuccess: () => void;
};

export default function AssignSectionsModal({
  open,
  examId,
  onClose,
  onAssignSuccess,
}: AssignSectionsModalProps) {
  const handleAssignSuccess = (): void => {
    onAssignSuccess();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Assign Sections</DialogTitle>
          <DialogDescription>
            Select sections and configure their exam schedules.
          </DialogDescription>
        </DialogHeader>

        <AssignSectionsForm
          examId={examId}
          onCancel={onClose}
          onAssignSuccess={handleAssignSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
