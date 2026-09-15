import { Role } from '../auth/role.enum';

export class TeacherDto {
  id!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  degree!: string;
  role!: Role;
}
