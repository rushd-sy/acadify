import { Request } from 'express';
import { Role } from 'dtos';

export type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    role: Role;
  };
};
