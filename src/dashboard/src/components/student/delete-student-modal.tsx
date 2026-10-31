import DeleteModal from '../ui/delete-modal';

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
  return (
    <DeleteModal
      open={open}
      title="Confirm Delete"
      message={
        <>
          Are you sure you want to delete{' '}
          <span className="font-semibold">{studentName}</span>?
        </>
      }
      onConfirm={onYes}
      onClose={onNo}
      isLoading={isLoading}
      error={error || undefined}
    />
  );
}

export default DeleteStudentModal;
