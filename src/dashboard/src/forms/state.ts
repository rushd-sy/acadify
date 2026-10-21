export type FormState<T> = {
  success: boolean;
  fieldErrors: Record<string, string>;
  formError: string | null;
  values?: T;
};

export const createInitialFormState = <T>(): FormState<T> => ({
  success: false,
  fieldErrors: {},
  formError: null,
});
