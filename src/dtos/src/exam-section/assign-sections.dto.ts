import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  Min,
} from 'class-validator';

export class AssignSectionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  sectionIds!: number[];
}
