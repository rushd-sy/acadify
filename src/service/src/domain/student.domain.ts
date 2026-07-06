export type NewStudentDomain = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hashedPassword: string;
};

export type StudentDomain = NewStudentDomain & {
  id: number;
};

export function createStudentDomain(input: NewStudentDomain): NewStudentDomain {
  return {
    firstName: normalizeRequiredText(input.firstName, 'First name'),
    lastName: normalizeRequiredText(input.lastName, 'Last name'),
    email: normalizeEmail(input.email),
    phoneNumber: normalizeRequiredText(input.phoneNumber, 'Phone number'),
    hashedPassword: normalizeRequiredText(input.hashedPassword, 'Password'),
  };
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
