import { Section, TeacherCurriculum } from '@prisma/client';

export type SectionWithRelations = Section & {
  teacherCurriculums?: TeacherCurriculum[];
};
