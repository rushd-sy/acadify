import { UserDomain } from 'src/auth/domain/user.domain';

export class TeacherDomain {
  user: UserDomain;
  degree: string;

  private constructor(input: { user: UserDomain; degree: string }) {
    this.user = input.user;
    this.degree = input.degree;
  }

  static create(input: { user: UserDomain; degree: string }): TeacherDomain {
    return new TeacherDomain(input);
  }

  static fromPersistence(input: {
    user: UserDomain;
    degree: string;
  }): TeacherDomain {
    return new TeacherDomain(input);
  }
}
