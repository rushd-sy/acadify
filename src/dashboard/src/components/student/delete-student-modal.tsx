import { Spinner } from '@/components/ui/spinner';

type DeleteStudentModalProps = {
  open: boolean;
  studentName: string;
  onYes: () => void;
  onNo: () => void;
  isLoading: boolean;
  error?: string | null;
};

function DeleteStudentModal({
  open,
  studentName,
  onYes,
  onNo,
  isLoading,
  error,
}: DeleteStudentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Confirm Delete</h2>

        <p className="mb-6 text-gray-700">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{studentName}</span>?
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onNo}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
            disabled={isLoading}
          >
            No
          </button>

          <button
            type="button"
            onClick={onYes}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="text-white" /> : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteStudentModal;
