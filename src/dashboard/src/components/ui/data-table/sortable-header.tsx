import type {
  DataTableColumn,
  DataTableSorting,
  DataTableSortDirection,
} from './types';

type SortableHeaderProps<T> = {
  column: DataTableColumn<T>;
  sorting?: DataTableSorting;
  onPageReset?: () => void;
};

export function SortableHeader<T>({
  column,
  sorting,
  onPageReset,
}: SortableHeaderProps<T>) {
  if (!column.sortable || !sorting) {
    return <>{column.header}</>;
  }

  const isActive = sorting.columnId === column.id;

  const nextDirection: DataTableSortDirection | undefined =
    !isActive
      ? 'asc'
      : sorting.direction === 'asc'
        ? 'desc'
        : sorting.direction === 'desc'
          ? undefined
          : 'asc';

  const handleSort = () => {
    sorting.onChange(column.id, nextDirection);
    onPageReset?.();
  };

  const directionLabel =
    !isActive || !sorting.direction
      ? 'not sorted'
      : sorting.direction === 'asc'
        ? 'sorted ascending'
        : 'sorted descending';

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-semibold hover:text-gray-900"
      onClick={handleSort}
      aria-label={`Sort by ${
        typeof column.header === 'string'
          ? column.header
          : column.id
      }, ${directionLabel}`}
    >
      {column.header}

      <span
        aria-hidden="true"
        className="text-xs text-gray-500"
      >
        {!isActive || !sorting.direction
          ? '↕'
          : sorting.direction === 'asc'
            ? '↑'
            : '↓'}
      </span>
    </button>
  );
}
