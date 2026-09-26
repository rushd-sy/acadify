import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
export class UpdateSectionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  academicYear?: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  gradeId?: number;
}
