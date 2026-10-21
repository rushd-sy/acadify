import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCurriculumDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
