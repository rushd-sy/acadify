import { SectionTeacherDto } from '../section-teacher';

export class SectionDto {
  id!: number;
  name!: string;
  academicYear!: string;
  gradeId!: number;
  teachers?: SectionTeacherDto[];
}
