import type { TeacherDetailsDto, TeacherDto } from 'dtos';
import { TeacherForm } from './teacher-form';

type TeacherModalProps = {
  open: boolean;
  teacher?: TeacherDetailsDto;
  onUpdateSuccess: (updatedTeacher: TeacherDetailsDto) => void;
  onCreateSuccess: (createdTeacher: TeacherDto) => void;
  onClose: () => void;
};

export default function TeacherModal({
  open,
  teacher,
  onUpdateSuccess,
  onCreateSuccess,
  onClose,
}: TeacherModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold">
          {teacher ? 'Update Teacher' : 'Create Teacher'}
        </h2>
        <TeacherForm
          onCancel={onClose}
          teacher={teacher}
          onUpdateSuccess={onUpdateSuccess}
          onCreateSuccess={onCreateSuccess}
        />
      </div>
    </div>
  );
}
