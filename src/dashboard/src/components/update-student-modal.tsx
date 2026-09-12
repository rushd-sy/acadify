import type { StudentDetailsDto } from 'dtos/dist/src/student/student-details.dto';
import { StudentUpdateForm } from './StudentUpdateForm';

type UpdateStudentModalProps = {
  open: boolean;
  studentId?: string;
  student?: StudentDetailsDto;
  onUpdateSuccess: (updatedStudent: StudentDetailsDto) => void;
  onClose: () => void;
};

export default function UpdateStudentModal({
  open,
  studentId,
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
          studentId={studentId}
          student={student}
          onUpdateSuccess={onUpdateSuccess}
        />
      </div>
    </div>
  );
}
