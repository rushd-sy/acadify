import { Role } from '../auth/role.enum';

export class StudentDto {
  id!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: Role;
}
