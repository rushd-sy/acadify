import { useEffect, type RefObject } from 'react';

export function useFocusFirstError(
  formRef: RefObject<HTMLFormElement | null>,
  fieldErrors?: Record<string, string | undefined> | null,
) {
  useEffect(() => {
    if (!formRef.current || !fieldErrors) return;

    const errorKeys = Object.keys(fieldErrors).filter((key) =>
      Boolean(fieldErrors[key]),
    );
    if (errorKeys.length === 0) return;

    const errorSet = new Set(errorKeys);

    const elements = formRef.current.querySelectorAll<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | HTMLButtonElement
    >('input, select, textarea, button[role="combobox"]');

    for (const el of elements) {
      const name = el.getAttribute('name');
      const id = el.getAttribute('id');

      const matchesError =
        (name && errorSet.has(name)) || (id && errorSet.has(id));

      if (matchesError) {
        if (el instanceof HTMLInputElement && el.type === 'hidden') {
          const container =
            el.closest('[data-slot="field"]') ?? el.parentElement;
          const combobox = container?.querySelector<HTMLButtonElement>(
            'button[role="combobox"]',
          );
          if (combobox && !combobox.disabled) {
            combobox.focus();
            return;
          }
        } else if (!('disabled' in el && el.disabled)) {
          el.focus();
          return;
        }
      }
    }
  }, [formRef, fieldErrors]);
}
