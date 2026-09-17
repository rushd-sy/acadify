import type { StudentDetailsDto } from 'dtos';
import { StudentUpdateForm } from './Student-update-form';

type UpdateStudentModalProps = {
  open: boolean;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onClose: () => void;
};

export default function UpdateStudentModal({
  open,
  student,
  onUpdateSuccess,
  onClose,
}: UpdateStudentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">Update Student</h2>
        <StudentUpdateForm
          onCancel={onClose}
          student={student}
          onUpdateSuccess={onUpdateSuccess}
        />
      </div>
    </div>
  );
}
