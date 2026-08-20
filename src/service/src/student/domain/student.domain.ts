import { UserDomain } from 'src/auth/domain/user.domain';

export class StudentDomain {
  id?: number;
  userId?: number;
  user: UserDomain;

  private constructor(input: {
    id?: number;
    userId?: number;
    user: UserDomain;
  }) {
    this.id = input.id;
    this.userId = input.userId;
    this.user = input.user;
  }

  static create(user: UserDomain): StudentDomain {
    return new StudentDomain({ user });
  }

  static fromPersistence(input: {
    id: number;
    userId: number;
    user: UserDomain;
  }): StudentDomain {
    return new StudentDomain(input);
  }
}
