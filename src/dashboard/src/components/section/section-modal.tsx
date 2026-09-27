import { SectionForm } from './SectionForm';

type SectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SectionModal({
  open,
  onClose,
  onSuccess,
}: SectionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">Create Section</h2>
        <SectionForm onCancel={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
