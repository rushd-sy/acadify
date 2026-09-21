import { useEffect } from 'react';
import { Spinner } from './spinner';

type DeleteModalProps = {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  error?: string;
};

export default function DeleteModal({
  open,
  title = 'Confirm Delete',
  message,
  onConfirm,
  onClose,
  isLoading = false,
  error,
}: DeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCloseCase = event.key === 'Escape' && open && !isLoading;
      if (isCloseCase) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, isLoading]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        const isCloseCase = e.target === e.currentTarget && !isLoading;
        if (isCloseCase) {
          onClose();
        }
      }}
    >
      <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <div className="mb-6 text-gray-700">{message}</div>
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex min-w-[80px] items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Spinner className="text-white" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
