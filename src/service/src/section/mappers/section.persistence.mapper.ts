import { Injectable } from '@nestjs/common';
import { SectionDomain } from '../domain/section.domain';
import { TeachingAssignment } from '../domain/teaching-assignment.entity';
import type { SectionWithRelations } from '../types/section.type';

@Injectable()
export class SectionPersistenceMapper {
  toDomain(prismaSection: SectionWithRelations): SectionDomain {
    return SectionDomain.fromPersistence({
      id: prismaSection.id,
      name: prismaSection.name,
      academicYear: prismaSection.academicYear,
      gradeId: prismaSection.gradeId,
      assignments: prismaSection.teacherCurriculums
        ? prismaSection.teacherCurriculums.map((tc) =>
            TeachingAssignment.fromPersistence({
              id: tc.id,
              teacherId: tc.userId,
              curriculumId: tc.curriculumId,
            }),
          )
        : [],
    });
  }
}
