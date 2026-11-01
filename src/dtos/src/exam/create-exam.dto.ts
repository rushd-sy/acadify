import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsUrl,
  Min,
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
  @IsUrl()
  documentUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minScore!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  maxScore!: number;
}
