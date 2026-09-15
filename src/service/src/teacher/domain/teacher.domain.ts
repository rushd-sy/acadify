import { UserDomain } from 'src/auth/domain/user.domain';

export class TeacherDomain {
  id: number;
  user: UserDomain;
  degree: string;

  private constructor(input: { id: number; user: UserDomain; degree: string }) {
    this.id = input.id;
    this.user = input.user;
    this.degree = input.degree;
  }

  static create(input: { user: UserDomain; degree: string }): TeacherDomain {
    return new TeacherDomain({
      id: -1,
      user: input.user,
      degree: input.degree,
    });
  }

  static fromPersistence(input: {
    id: number;
    user: UserDomain;
    degree: string;
  }): TeacherDomain {
    return new TeacherDomain(input);
  }
}
