import { Role } from 'dtos';

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
