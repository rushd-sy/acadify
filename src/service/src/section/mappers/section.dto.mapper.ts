// import { Injectable } from '@nestjs/common';
// import { Section } from '@prisma/client';
// import { SectionDomain } from '../domain/section.domain';
// import { CreateSectionDto, SectionDto } from 'dtos';

// @Injectable()
// export class SectionMapper {
//   toDomain(section: Section): SectionDomain {
//     return SectionDomain.fromPersistence({
//       id: section.id,
//       name: section.name,
//       academicYear: section.academicYear,
//       gradeId: section.gradeId,
//     });
//   }

//   toDomainFromCreateDto(createDto: CreateSectionDto): SectionDomain {
//     return SectionDomain.create({
//       name: createDto.name,
//       academicYear: createDto.academicYear,
//       gradeId: createDto.gradeId,
//     });
//   }

//   toDto(sectionDomain: SectionDomain): SectionDto {
//     return {
//       id: sectionDomain.id,
//       name: sectionDomain.name,
//       academicYear: sectionDomain.academicYear,
//       gradeId: sectionDomain.gradeId,
//     };
//   }

//   toDtoList(sections: SectionDomain[]): SectionDto[] {
//     return sections.map((section) => this.toDto(section));
//   }
// }

import { Injectable } from '@nestjs/common';
import { SectionDto, SectionTeacherDto } from 'dtos';
import { SectionDomain } from '../domain/section.domain';

export interface AssembledSectionData {
  section: SectionDomain;
  teachers: {
    userId: number;
    firstName: string;
    lastName: string;
    curriculumName: string;
  }[];
}

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
          (t): SectionTeacherDto => ({
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
