type DeleteStudentModalProps = {
  open: boolean;
  studentName: string;
  onYes: () => void;
  onNo: () => void;
  isLoading: boolean;
};

function DeleteStudentModal({
  open,
  studentName,
  onYes,
  onNo,
  isLoading,
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

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onNo}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            No
          </button>

          <button
            type="button"
            onClick={onYes}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Yes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteStudentModal;
