import { TeacherDto } from '../teacher/teacher.dto';
import { CurriculumDto } from '../curriculum';

export class TeacherCurriculumDto {
  id!: number;
  teacher!: TeacherDto;
  curriculum!: CurriculumDto;
}
