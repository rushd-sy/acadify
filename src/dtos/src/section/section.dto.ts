import { SectionCurriculumTeacherDto } from '../section-teacher';
import { SectionStudentDto } from '../section-student/section-student.dto';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachers?: SectionCurriculumTeacherDto[];
  students?: SectionStudentDto[];
  createdBy?: number;
  createdAt!: Date;
  updatedBy?: number;
  updatedAt!: Date;
  archivedAt?: Date;
}
