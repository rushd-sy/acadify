import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGradeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
