import { StringUtils } from '../../utils/string.util';

export class UserDomain {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;

  private constructor(input: {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
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
  }

  static create(input: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hashedPassword: string;
  }): UserDomain {
    return new UserDomain(input);
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
