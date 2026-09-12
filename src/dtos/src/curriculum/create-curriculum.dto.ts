import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCurriculumDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
