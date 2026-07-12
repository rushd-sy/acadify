export class StringUtils {
  private constructor() {}

  public static normalizeRequiredText(
    value: string,
    fieldName: string,
  ): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error(`${fieldName} cannot be empty or whitespace`);
    }
    return trimmedValue;
  }

  public static normalizeEmail(email: string): string {
    const normalizedEmail = this.normalizeRequiredText(
      email,
      'Email',
    ).toLowerCase();

    if (!normalizedEmail.includes('@')) {
      throw new Error('Email must be valid (contian an "@" symbol');
    }
    return normalizedEmail;
  }
}
