export type SortableValue = string | number | null | undefined;

export function compareValues(
  first: SortableValue,
  second: SortableValue,
): number {
  if (first == null && second == null) return 0;
  if (first == null) return 1;
  if (second == null) return -1;

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}
