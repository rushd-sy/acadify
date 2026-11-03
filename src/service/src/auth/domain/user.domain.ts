import { StringUtils } from '../../utils/string.util';

export class UserDomain {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
  createdBy?: number;
  createAt?: Date;
  updatedBy?: number;
  updatedAt?: Date;
  archivedAt?: Date;

  private constructor(input: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
    createdBy?: number;
    createAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;
    archivedAt?: Date;
  }) {
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
    this.createdBy = input.createdBy;
    this.createAt = input.createAt;
    this.updatedBy = input.updatedBy;
    this.updatedAt = input.updatedAt;
    this.archivedAt = input.archivedAt;
  }

  static create(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
  }): UserDomain {
    return new UserDomain({
      id: -1,
      ...input,
    });
  }

  static fromPersistence(input: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
  }): UserDomain {
    return new UserDomain(input);
  }
}
