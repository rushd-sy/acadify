import { Section } from '../domaine/section.aggregate';
import {
  Section as PrismaSection,
  TeacherCurriculum as PrismaAssignment,
} from '@prisma/client';
import { TeachingAssignment } from '../domaine/teaching-assignment.entity';

type PrismaSectionWithAssignments = PrismaSection & {
  teacherCurriculums: PrismaAssignment[];
};

export class SectionPersistenceMapper {
  static toDomain(prismaSection: PrismaSectionWithAssignments): Section {
    const assignments = prismaSection.teacherCurriculums.map((tc) =>
      TeachingAssignment.fromPersistence(tc.id, tc.userId, tc.curriculumId),
    );
    return Section.fromPersistence({
      id: prismaSection.id,
      name: prismaSection.name,
      academicYear: prismaSection.academicYear,
      gradeId: prismaSection.gradeId,
      assignments,
    });
  }
}
