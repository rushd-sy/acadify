import { SectionCurriculumTeacherDto } from '../section-teacher';
import { SectionStudentDto } from '../section-student/section-student.dto';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachers?: SectionCurriculumTeacherDto[];
  students?: SectionStudentDto[];
}
