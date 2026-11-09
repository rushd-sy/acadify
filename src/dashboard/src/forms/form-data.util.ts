export const getFormString = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
};

export const getOptionalNumber = (
  formData: FormData,
  name: string,
): number | undefined => {
  const value = getFormString(formData, name).trim();
  return value ? Number(value) : undefined;
};
