import { Spinner } from '@/components/ui/spinner';

type DeleteGradeModalProps = {
  open: boolean;
  gradeName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  error: string | null;
};

export default function DeleteGradeModal({
  open,
  gradeName,
  onConfirm,
  onCancel,
  isDeleting,
  error,
}: DeleteGradeModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Confirm Delete</h2>

        <p className="mb-6 text-gray-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{gradeName}</span>?
        </p>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            {isDeleting ? <Spinner className="text-white" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
