import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  academicYear!: string;

  @IsInt()
  @IsNotEmpty()
  gradeId!: number;
}
