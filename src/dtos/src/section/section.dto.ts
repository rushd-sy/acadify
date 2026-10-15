import { SectionCurriculumTeacherDto } from '../section-teacher';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachers?: SectionCurriculumTeacherDto[];
}
