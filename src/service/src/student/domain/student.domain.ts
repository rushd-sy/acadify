import { UserDomain } from 'src/auth/domain/user.domain';

export class StudentDomain {
  userId: number;
  user: UserDomain;

  private constructor(input: { userId: number; user: UserDomain }) {
    this.userId = input.userId;
    this.user = input.user;
  }

  static create(user: UserDomain): StudentDomain {
    return new StudentDomain({
      userId: -1,
      user,
    });
  }

  static fromPersistence(input: {
    userId: number;
    user: UserDomain;
  }): StudentDomain {
    return new StudentDomain(input);
  }
}
