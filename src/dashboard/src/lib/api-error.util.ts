import axios from 'axios';

export function getApiErrorMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return null;
}

export function getApiValidationErrors(
  error: unknown,
  fields: string[],
): Record<string, string> {
  if (!axios.isAxiosError(error)) {
    return {};
  }

  const message = error.response?.data?.message;

  if (!Array.isArray(message)) {
    return {};
  }

  const errors: Record<string, string> = {};

  for (const item of message) {
    if (typeof item !== 'string') {
      continue;
    }

    for (const field of fields) {
      if (item.includes(field)) {
        errors[field] = item;
        break;
      }
    }
  }

  return errors;
}
