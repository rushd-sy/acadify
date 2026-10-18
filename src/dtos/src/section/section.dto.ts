import { SectionCurriculumTeacherDto } from '../section-teacher';
import { StudentDetailsDto } from '../student';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachers?: SectionCurriculumTeacherDto[];
  students?: StudentDetailsDto[];
}
