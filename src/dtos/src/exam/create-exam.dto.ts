import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateExamDto {
  @IsOptional()
  @IsInt()
  examTemplateId?: number;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsInt()
  curriculumId?: number;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  minScore!: number;

  @IsNotEmpty()
  @IsNumber()
  maxScore!: number;
}
