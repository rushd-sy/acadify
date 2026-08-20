import { Role } from '../auth/role.enum';

export class UserDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  role?: Role;
}
