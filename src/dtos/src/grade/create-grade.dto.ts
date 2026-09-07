import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
