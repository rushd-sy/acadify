import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateSectionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  academicYear?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  gradeId?: string;
}
