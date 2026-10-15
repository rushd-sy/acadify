import { Section, SectionCurriculumTeacher } from '@prisma/client';

export type SectionWithRelations = Section & {
  sectionCurriculumTeachers?: SectionCurriculumTeacher[];
};
