import { Injectable } from '@nestjs/common';
import { SectionDto, SectionCurriculumTeacherDto } from 'dtos';
import { AssembledSectionData } from '../data/section-assembled-data';

@Injectable()
export class SectionDtoMapper {
  toDto(assembledData: AssembledSectionData): SectionDto {
    return {
      id: assembledData.section.id,
      name: assembledData.section.name,
      academicYear: assembledData.section.academicYear,
      gradeId: assembledData.section.gradeId,
      teachers:
        assembledData.teachers?.map(
          (t): SectionCurriculumTeacherDto => ({
            teacherId: t.userId,
            teacherFirstName: t.firstName,
            teacherLastName: t.lastName,
            curriculumName: t.curriculumName,
          }),
        ) || [],
    };
  }

  toDtoList(assembledDataList: AssembledSectionData[]): SectionDto[] {
    return assembledDataList.map((data) => this.toDto(data));
  }
}
