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

export class UpdateExamDto {
  @IsOptional()
  @IsInt()
  examTemplateId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  curriculumId?: number;

  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  documentUrl?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minScore?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  maxScore?: number;
}
