import { Student, User } from '@prisma/client';

export type StudentWithUser = Student & { user: User };
