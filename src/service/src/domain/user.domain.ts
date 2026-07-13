import { StringUtils } from '../utils/string.util';

export class UserDomain {
  id?: number;
  fullName: string;
  email: string;
  hashedPassword: string;

  private constructor(input: {
    id?: number;
    fullName: string;
    email: string;
    hashedPassword: string;
  }) {
    this.id = input.id;
    this.fullName = StringUtils.normalizeRequiredText(
      input.fullName,
      'Full name',
    );
    this.email = StringUtils.normalizeEmail(input.email);
    this.hashedPassword = StringUtils.normalizeRequiredText(
      input.hashedPassword,
      'Password',
    );
  }

  static create(input: {
    fullName: string;
    email: string;
    hashedPassword: string;
  }): UserDomain {
    return new UserDomain(input);
  }

  static fromPersistence(input: {
    id: number;
    fullName: string;
    email: string;
    hashedPassword: string;
  }): UserDomain {
    return new UserDomain(input);
  }
}
