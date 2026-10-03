import { Prisma } from '@prisma/client';

export type SectionWithRelations = Prisma.SectionGetPayload<{
  include: {
    teacherCurriculums: {
      include: {
        teacher: {
          include: {
            user: true;
          };
        };
        curriculum: true;
      };
    };
  };
}>;
