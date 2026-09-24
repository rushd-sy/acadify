import { Injectable } from '@nestjs/common';
import { Section } from '@prisma/client';
import { SectionDomain } from '../domaine/section.domain';
import { CreateSectionDto, SectionDto } from 'dtos';

@Injectable()
export class SectionMapper {
  toDomain(section: Section): SectionDomain {
    return SectionDomain.fromPersistence({
      id: section.id,
      name: section.name,
      academicYear: section.academicYear,
      gradeId: section.gradeId,
    });
  }

  toDokmainFromCreateDto(createDto: CreateSectionDto): SectionDomain {
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
    };
  }

  toDtoList(sections: SectionDomain[]): SectionDto[] {
    return sections.map((section) => this.toDto(section));
  }
}
