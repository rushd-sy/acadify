import { Role } from '../auth/role.enum';

export class StudentDto {
  userId!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: Role;
}
