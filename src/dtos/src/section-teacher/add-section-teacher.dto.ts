import { IsInt, Min } from 'class-validator';

export class AddSectionTeacherDto {
  @IsInt()
  @Min(1)
  teacherId!: number;
}
