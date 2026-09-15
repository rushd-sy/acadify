import { Teacher, User } from '@prisma/client';

export type TeacherWithUser = Teacher & {
  user: User;
};
