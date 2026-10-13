import { SectionDomain } from '../domain/section.domain';
import {
  Section as PrismaSection,
  TeacherCurriculum as PrismaAssignment,
} from '@prisma/client';
import { TeachingAssignment } from '../domain/teaching-assignment.entity';

type PrismaSectionWithAssignments = PrismaSection & {
  teacherCurriculums: PrismaAssignment[];
};

export class SectionPersistenceMapper {
  static toDomain(prismaSection: PrismaSectionWithAssignments): SectionDomain {
    const assignments = prismaSection.teacherCurriculums.map((tc) =>
      TeachingAssignment.fromPersistence(tc.id, tc.userId, tc.curriculumId),
    );
    return SectionDomain.fromPersistence({
      id: prismaSection.id,
      name: prismaSection.name,
      academicYear: prismaSection.academicYear,
      gradeId: prismaSection.gradeId,
      assignments,
    });
  }
}
