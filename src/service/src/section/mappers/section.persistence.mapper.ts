import { Injectable } from '@nestjs/common';
import { SectionDomain } from '../domain/section.domain';
import { SectionCurriculumTeacher } from '../domain/section-teaching-assignment.entity';
import type { SectionWithRelations } from '../types/section.type';

@Injectable()
export class SectionPersistenceMapper {
  toDomain(prismaSection: SectionWithRelations): SectionDomain {
    return SectionDomain.fromPersistence({
      id: prismaSection.id,
      name: prismaSection.name,
      academicYear: prismaSection.academicYear,
      gradeId: prismaSection.gradeId,
      assignments: prismaSection.sectionCurriculumTeachers
        ? prismaSection.sectionCurriculumTeachers.map((tc) =>
            SectionCurriculumTeacher.fromPersistence({
              id: tc.id,
              teacherId: tc.userId,
              curriculumId: tc.curriculumId,
            }),
          )
        : [],
    });
  }
}
