import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsDateString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AssignSectionDto {
  @IsInt()
  @Min(1)
  sectionId!: number;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}

export class AssignSectionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique((section: AssignSectionDto) => section.sectionId)
  @ValidateNested({ each: true })
  @Type(() => AssignSectionDto)
  sections!: AssignSectionDto[];
}
