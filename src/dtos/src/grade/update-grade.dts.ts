import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateGradeDto {
  @IsString()
  @IsNotEmpty()
  name?: string;
}
