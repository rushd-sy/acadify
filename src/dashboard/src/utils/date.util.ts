export const formatDateForInput = (value?: Date | string) => {
  if (!value) return '';

  const date = new Date(value);

  return Number.isFinite(date.getTime())
    ? date.toISOString().split('T')[0]
    : '';
};
