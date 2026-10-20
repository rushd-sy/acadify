import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCurriculumDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
