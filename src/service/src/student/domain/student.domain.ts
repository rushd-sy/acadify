import { UserDomain } from 'src/auth/domain/user.domain';
import { ITraceable } from 'src/utils/traceable.interface';

export class StudentDomain implements ITraceable {
  userId: number;
  user: UserDomain;
  createdBy?: number;
  createdAt?: Date;
  upadtedBy?: number;
  updatedAt?: Date;
  archivedAt?: Date;

  private constructor(input: {
    userId: number;
    user: UserDomain;
    createdBy?: number;
    createdAt?: Date;
    upadtedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    this.userId = input.userId;
    this.user = input.user;
    this.createdBy = input.createdBy;
    this.createdAt = input.createdAt;
    this.upadtedBy = input.upadtedBy;
    this.updatedAt = input.updatedAt;
    this.archivedAt = input.archivedAt;
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
