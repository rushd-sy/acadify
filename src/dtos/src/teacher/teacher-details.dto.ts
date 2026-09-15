import { Role } from '../auth/role.enum';

export class TeacherDetailsDto {
  id!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  degree!: string;
  role!: Role;
}
