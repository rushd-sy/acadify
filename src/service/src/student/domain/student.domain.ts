import { UserDomain } from 'src/auth/domain/user.domain';
import { TraceableDomain } from '../../utils/traceable.domain';

export class StudentDomain extends TraceableDomain {
  userId: number;
  user: UserDomain;

  private constructor(input: {
    userId: number;
    user: UserDomain;
    createdBy?: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.userId = input.userId;
    this.user = input.user;
  }

  static create(user: UserDomain, createdBy?: number): StudentDomain {
    return new StudentDomain({
      userId: -1,
      user,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(input: {
    userId: number;
    user: UserDomain;
    createdBy?: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt: Date;
    archivedAt?: Date;
  }): StudentDomain {
    return new StudentDomain(input);
  }
}
