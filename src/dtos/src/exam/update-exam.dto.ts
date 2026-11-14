import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateExamDto {
  @IsOptional()
  @IsInt()
  examTemplateId?: number;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  curriculumId?: number | null;

  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  documentUrl?: string | null;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minScore?: number;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  maxScore?: number;
}
