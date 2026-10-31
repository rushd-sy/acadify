import type { Key, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableAlign = 'left' | 'center' | 'right';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | null | undefined;
  align?: DataTableAlign;
  className?: string;
  headerClassName?: string;
};

export type DataTableSortDirection = 'asc' | 'desc';

export type DataTableSorting = {
  columnId?: string;
  direction?: DataTableSortDirection;
  mode?: 'server' | 'client';
  onChange: (
    columnId: string,
    direction: DataTableSortDirection | undefined,
  ) => void;
};

export type DataTableSearch<T = never> = {
  value: string;
  placeholder?: string;
  mode?: 'server' | 'client';
  filter?: (row: T, searchValue: string) => boolean;
  onChange: (value: string) => void;
};

export type DataTablePagination = {
  page: number;
  pageSize: number;
  total?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  mode?: 'server' | 'client';
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((row: T, index: number) => Key);
  actions?: ReactNode | ((row: T) => ReactNode);
  actionsHeader?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  error?: ReactNode;
  emptyMessage?: ReactNode;
  onRowClick?: (row: T) => void;
  rowClassName?: string | ((row: T) => string | undefined);
  caption?: ReactNode;
  search?: DataTableSearch<T>;
  sorting?: DataTableSorting;
  pagination?: DataTablePagination;
  className?: string;
  containerClassName?: string;
};

const alignmentClasses: Record<DataTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function getCellValue<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.cell) return column.cell(row);
  if (column.accessorKey) return row[column.accessorKey] as ReactNode;
  return null;
}

function getRowKey<T>(
  row: T,
  index: number,
  rowKey: keyof T | ((row: T, index: number) => Key),
): Key {
  return typeof rowKey === 'function'
    ? rowKey(row, index)
    : String(row[rowKey]);
}

function getPageCount(pagination: DataTablePagination) {
  const pageSize = Math.max(1, pagination.pageSize);
  return Math.max(1, Math.ceil(Math.max(0, pagination.total ?? 0) / pageSize));
}

function getSafePage(page: number, pageCount: number) {
  return Math.min(Math.max(1, page), pageCount);
}

function getVisiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (currentPage <= 3) return [1, 2, 3, 'ellipsis', pageCount] as const;
  if (currentPage >= pageCount - 2) {
    return [1, 'ellipsis', pageCount - 2, pageCount - 1, pageCount] as const;
  }
  return [1, 'ellipsis', currentPage, 'ellipsis', pageCount] as const;
}

function compareValues(
  first: string | number | null | undefined,
  second: string | number | null | undefined,
) {
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

function DataTable<T>({
  columns,
  data,
  rowKey,
  actions,
  actionsHeader = 'Actions',
  isLoading = false,
  loadingMessage = 'Loading...',
  error,
  emptyMessage = 'No records available.',
  onRowClick,
  rowClassName,
  caption,
  search,
  sorting,
  pagination,
  className,
  containerClassName,
}: DataTableProps<T>) {
  const hasActions = actions !== undefined;
  const columnCount = columns.length + (hasActions ? 1 : 0);
  const clientFilter = search?.mode === 'client' ? search.filter : undefined;
  const filteredData = clientFilter
    ? data.filter((row) => clientFilter(row, search?.value ?? ''))
    : data;
  const sortedData =
    sorting?.mode === 'client' && sorting.columnId && sorting.direction
      ? [...filteredData].sort((first, second) => {
          const column = columns.find(
            (candidate) => candidate.id === sorting.columnId,
          );
          if (!column?.sortable) return 0;

          const firstValue = column.sortValue
            ? column.sortValue(first)
            : column.accessorKey
              ? (first[column.accessorKey] as
                  | string
                  | number
                  | null
                  | undefined)
              : null;
          const secondValue = column.sortValue
            ? column.sortValue(second)
            : column.accessorKey
              ? (second[column.accessorKey] as
                  | string
                  | number
                  | null
                  | undefined)
              : null;

          return (
            compareValues(firstValue, secondValue) *
            (sorting.direction === 'asc' ? 1 : -1)
          );
        })
      : filteredData;
  const effectiveTotal =
    pagination?.mode === 'client'
      ? sortedData.length
      : (pagination?.total ?? 0);
  const pageCount = pagination
    ? getPageCount({ ...pagination, total: effectiveTotal })
    : 0;
  const currentPage = pagination ? getSafePage(pagination.page, pageCount) : 1;
  const canGoPrevious = pagination !== undefined && currentPage > 1;
  const canGoNext = pagination !== undefined && currentPage < pageCount;
  const visiblePages = pagination
    ? getVisiblePages(currentPage, pageCount)
    : [];
  const displayedData =
    pagination?.mode === 'client'
      ? sortedData.slice(
          (currentPage - 1) * Math.max(1, pagination.pageSize),
          currentPage * Math.max(1, pagination.pageSize),
        )
      : sortedData;

  const renderState = (content: ReactNode, stateClassName?: string) => (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className={cn('h-24 text-center', stateClassName)}
      >
        {content}
      </TableCell>
    </TableRow>
  );

  return (
    <div className={cn('w-full min-w-0', containerClassName)}>
      {search && (
        <div className="mt-6 mb-8 w-full max-w-sm">
          <Input
            type="search"
            value={search.value}
            placeholder={search.placeholder ?? 'Search...'}
            onChange={(event) => {
              if (pagination && pagination.page !== 1) {
                pagination.onPageChange(1);
              }
              search.onChange(event.target.value);
            }}
            aria-label={search.placeholder ?? 'Search'}
          />
        </div>
      )}

      <div className="w-full min-w-0 overflow-x-auto rounded-md">
        <Table
          className={cn('w-full min-w-[900px] table-auto text-sm', className)}
        >
          {caption}
          <TableHeader>
            <TableRow className="border-b">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  aria-sort={
                    sorting?.columnId === column.id && sorting.direction
                      ? sorting.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                        ? 'none'
                        : undefined
                  }
                  className={cn(
                    'h-14 whitespace-nowrap px-4 font-semibold',
                    alignmentClasses[column.align ?? 'left'],
                    column.headerClassName,
                  )}
                >
                  {column.sortable && sorting ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-semibold hover:text-gray-900"
                      onClick={() => {
                        const nextDirection =
                          sorting.columnId === column.id &&
                          sorting.direction === 'asc'
                            ? 'desc'
                            : 'asc';
                        sorting.onChange(column.id, nextDirection);
                      }}
                    >
                      {column.header}
                      <span
                        aria-hidden="true"
                        className="text-xs text-gray-500"
                      >
                        {sorting.columnId !== column.id
                          ? '↕'
                          : sorting.direction === 'desc'
                            ? '↓'
                            : '↑'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="h-14 whitespace-nowrap px-4 text-center font-semibold">
                  {actionsHeader}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? renderState(
                  <div className="flex justify-center">{loadingMessage}</div>,
                )
              : error
                ? renderState(error, 'text-red-600')
                : displayedData.length === 0
                  ? renderState(emptyMessage)
                  : displayedData.map((row, index) => (
                      <TableRow
                        key={getRowKey(row, index, rowKey)}
                        className={cn(
                          'h-[72px]',
                          onRowClick && 'cursor-pointer',
                          typeof rowClassName === 'function'
                            ? rowClassName(row)
                            : rowClassName,
                        )}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            className={cn(
                              'px-4',
                              alignmentClasses[column.align ?? 'left'],
                              column.className,
                            )}
                          >
                            {getCellValue(row, column)}
                          </TableCell>
                        ))}
                        {hasActions && (
                          <TableCell className="px-4 text-center">
                            <div
                              className="inline-flex"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {typeof actions === 'function'
                                ? actions(row)
                                : actions}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
          </TableBody>
        </Table>

        {pagination && pageCount > 1 && (
          <div className="flex justify-center overflow-x-auto border-t px-4 py-4">
            <div className="flex min-w-max items-center gap-1 text-sm">
              <button
                type="button"
                onClick={() => pagination.onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-base text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
              >
                <span aria-hidden="true">‹</span>
              </button>

              {visiblePages.map((pageItem, index) =>
                pageItem === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center text-gray-500"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageItem}
                    type="button"
                    onClick={() => pagination.onPageChange(pageItem)}
                    aria-current={pageItem === currentPage ? 'page' : undefined}
                    className={cn(
                      'flex h-8 min-w-8 items-center justify-center rounded-md border px-2 transition-colors',
                      pageItem === currentPage
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background text-foreground hover:bg-accent',
                    )}
                  >
                    {pageItem}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => pagination.onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-base text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DataTable };
