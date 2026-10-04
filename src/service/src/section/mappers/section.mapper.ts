import { Injectable } from '@nestjs/common';
import { SectionDomain } from '../domaine/section.domain';
import { CreateSectionDto, SectionDto } from 'dtos';
import { SectionWithRelations } from '../types/section-relations';
import { Section } from '@prisma/client';

@Injectable()
export class SectionMapper {
  toDomain(section: Section | SectionWithRelations): SectionDomain {
    const hasRelations = 'teacherCurriculums' in section;
    const teacherCurriculums = hasRelations
      ? section.teacherCurriculums
      : undefined;
    return SectionDomain.fromPersistence({
      id: section.id,
      name: section.name,
      academicYear: section.academicYear,
      gradeId: section.gradeId,
      teacherCurriculums: teacherCurriculums?.map((tc) => ({
        teacherId: tc.id,
        teacher: {
          userId: tc.teacher.userId,
          firstName: tc.teacher.user.firstName,
          lastName: tc.teacher.user.lastName,
        },
        curriculum: {
          name: tc.curriculum.name,
        },
      })),
    });
  }

  toDomainFromCreateDto(createDto: CreateSectionDto): SectionDomain {
    return SectionDomain.create({
      name: createDto.name,
      academicYear: createDto.academicYear,
      gradeId: createDto.gradeId,
    });
  }

  toDto(sectionDomain: SectionDomain): SectionDto {
    return {
      id: sectionDomain.id,
      name: sectionDomain.name,
      academicYear: sectionDomain.academicYear,
      gradeId: sectionDomain.gradeId,
      teachers: sectionDomain.teacherCurriculums?.map((tc) => ({
        teacherId: tc.teacher.userId,
        teacherFirstName: tc.teacher.firstName,
        teacherLastName: tc.teacher.lastName,
        curriculumName: tc.curriculum.name,
      })),
    };
  }

  toDtoList(sections: SectionDomain[]): SectionDto[] {
    return sections.map((section) => this.toDto(section));
  }
}
