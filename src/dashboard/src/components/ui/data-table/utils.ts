import type { Key, ReactNode } from 'react';

import { compareValues } from '@/lib/sort-utils';

import type {
  DataTableColumn,
  DataTablePagination,
  DataTableSearch,
  DataTableSorting,
} from './types';

type GetDisplayedRowsParams<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  search?: DataTableSearch<T>;
  sorting?: DataTableSorting;
  pagination?: DataTablePagination;
};

export function getCellValue<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.cell) {
    return column.cell(row);
  }

  if (column.accessorKey !== undefined) {
    return Reflect.get(
      row as object,
      column.accessorKey as PropertyKey,
    ) as ReactNode;
  }

  return null;
}

export function getRowKey<T>(
  row: T,
  index: number,
  rowKey: keyof T | ((row: T, index: number) => Key),
): Key {
  if (typeof rowKey === 'function') {
    return rowKey(row, index);
  }

  return String(Reflect.get(row as object, rowKey as PropertyKey));
}

function getSortValue<T>(
  row: T,
  column: DataTableColumn<T>,
): string | number | null | undefined {
  if (column.sortValue) {
    return column.sortValue(row);
  }

  if (column.accessorKey !== undefined) {
    return Reflect.get(row as object, column.accessorKey as PropertyKey) as
      | string
      | number
      | null
      | undefined;
  }

  return null;
}

export function getPageCount(total: number, pageSize: number): number {
  const safePageSize = Math.max(1, pageSize);

  return Math.max(1, Math.ceil(Math.max(0, total) / safePageSize));
}

export function getSafePage(page: number, pageCount: number): number {
  return Math.min(Math.max(1, page), pageCount);
}

export function getVisiblePages(
  currentPage: number,
  pageCount: number,
): readonly (number | 'ellipsis')[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', pageCount];
  }

  if (currentPage >= pageCount - 2) {
    return [1, 'ellipsis', pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, 'ellipsis', currentPage, 'ellipsis', pageCount];
}

export function getDisplayedRows<T>({
  data,
  columns,
  search,
  sorting,
  pagination,
}: GetDisplayedRowsParams<T>) {
  // Client-side filtering only.
  const filteredData =
    search && search.mode !== 'server' && search.value.trim().length > 0
      ? data.filter((row) => search.filter(row, search.value))
      : data;

  // Find the sortable column once instead of searching for it
  // during every comparison.
  const sortColumn =
    sorting && sorting.mode !== 'server' && sorting.columnId
      ? columns.find(
          (column) => column.id === sorting.columnId && column.sortable,
        )
      : undefined;

  // Extract each row's sort value once before sorting.
  const sortedData =
    sortColumn && sorting?.direction
      ? filteredData
          .map((row, index) => ({
            row,
            index,
            value: getSortValue(row, sortColumn),
          }))
          .sort((first, second) => {
            const comparison = compareValues(first.value, second.value);

            if (comparison === 0) {
              return first.index - second.index;
            }

            return sorting.direction === 'asc' ? comparison : -comparison;
          })
          .map(({ row }) => row)
      : filteredData;

  // Server-side pagination receives an already paginated dataset.
  const total =
    pagination?.mode === 'server' ? pagination.total : sortedData.length;

  const pageCount = pagination ? getPageCount(total, pagination.pageSize) : 1;

  const currentPage = pagination ? getSafePage(pagination.page, pageCount) : 1;

  const safePageSize = pagination ? Math.max(1, pagination.pageSize) : 1;

  const displayedData =
    pagination && pagination.mode !== 'server'
      ? sortedData.slice(
          (currentPage - 1) * safePageSize,
          currentPage * safePageSize,
        )
      : sortedData;

  return {
    displayedData,
    pageCount,
    currentPage,
    visiblePages: getVisiblePages(currentPage, pageCount),
  };
}
