import { StringUtils } from '../../utils/string.util';
import { TraceableDomain } from 'src/utils/traceable.domain';

export class UserDomain extends TraceableDomain {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;

  private constructor(input: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
    super(input);
    this.id = input.id;
    this.firstName = StringUtils.normalizeRequiredText(
      input.firstName,
      'First name',
    );
    this.lastName = StringUtils.normalizeRequiredText(
      input.lastName,
      'Last name',
    );
    this.phoneNumber = StringUtils.normalizeRequiredText(
      input.phoneNumber,
      'Phone number',
    );
    this.email = StringUtils.normalizeEmail(input.email);
    this.hashedPassword = StringUtils.normalizeRequiredText(
      input.hashedPassword,
      'Password',
    );
  }

  static create(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
    createdBy: number;
  }): UserDomain {
    return new UserDomain({
      id: -1,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(input: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
    createdBy: number;
    createdAt: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }): UserDomain {
    return new UserDomain(input);
  }
}
