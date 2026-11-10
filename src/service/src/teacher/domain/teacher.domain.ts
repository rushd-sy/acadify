import { UserDomain } from 'src/auth/domain/user.domain';
import { TraceableDomain } from 'src/utils/traceable.domain';

export class TeacherDomain extends TraceableDomain {
  user: UserDomain;
  degree: string;

  private constructor(input: {
    user: UserDomain;
    degree: string;
    createdBy?: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.user = input.user;
    this.degree = input.degree;
  }

  static create(
    input: { user: UserDomain; degree: string },
    createdBy?: number,
  ): TeacherDomain {
    return new TeacherDomain({
      ...input,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(input: {
    user: UserDomain;
    degree: string;
    createdBy?: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt: Date;
    archivedAt?: Date;
  }): TeacherDomain {
    return new TeacherDomain(input);
  }
}
