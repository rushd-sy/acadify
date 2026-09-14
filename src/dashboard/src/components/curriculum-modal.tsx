import { CurriculumForm } from './CurriculumForm';
import type { CurriculumDto } from 'dtos';

type CurriculumModalProps = {
  open: boolean;
  curriculum?: CurriculumDto;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CurriculumModal({
  open,
  curriculum,
  onClose,
  onSuccess,
}: CurriculumModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">
          {curriculum ? 'Update Curriculum' : 'Create Curriculum'}
        </h2>
        <CurriculumForm
          key={curriculum ? curriculum.id : 'new-curriculum'}
          onCancel={onClose}
          initialData={curriculum}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
