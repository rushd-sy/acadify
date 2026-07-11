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
    this.fullName = normalizeRequiredText(input.fullName, 'Full name');
    this.email = normalizeEmail(input.email);
    this.hashedPassword = normalizeRequiredText(
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

function normalizeRequiredText(value: string, fieldName: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`${fieldName} cannot be empty or whitespace.`);
  }

  return trimmedValue;
}

function normalizeEmail(email: string): string {
  const normalizedEmail = normalizeRequiredText(email, 'Email').toLowerCase();

  if (!normalizedEmail.includes('@')) {
    throw new Error('Email must be valid (contain an "@" symbol).');
  }

  return normalizedEmail;
}
