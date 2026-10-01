import { TeacherCurriculumDto } from '../teacher-curriculum';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teacherCurriculums?: TeacherCurriculumDto[];
}
