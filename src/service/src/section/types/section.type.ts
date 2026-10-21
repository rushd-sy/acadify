import { Section, SectionCurriculumTeacher, Prisma } from '@prisma/client';

export type SectionWithRelations = Section & {
  sectionCurriculumTeachers?: SectionCurriculumTeacher[];
};

export type SectionCurriculumTeacherWithRelations =
  Prisma.SectionCurriculumTeacherGetPayload<{
    include: {
      teacher: {
        include: {
          user: true;
        };
      };
      curriculum: true;
    };
  }>;

export type StudentSectionWithRelations = Prisma.StudentSectionGetPayload<{
  include: {
    student: {
      include: {
        user: true;
      };
    };
  };
}>;
