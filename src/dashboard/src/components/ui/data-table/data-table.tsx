import type {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { DataTablePagination } from './data-table-pagination';
import { SortableHeader } from './sortable-header';
import {
  getCellValue,
  getDisplayedRows,
  getRowKey,
} from './utils';
import type { DataTableProps } from './types';

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

  const {
    displayedData,
    pageCount,
    currentPage,
    visiblePages,
  } = getDisplayedRows<T>({
    data,
    columns,
    search,
    sorting,
    pagination,
  });

  const resetPage = () => {
    if (pagination && pagination.page !== 1) {
      pagination.onPageChange(1);
    }
  };

  const renderState = (
    content: ReactNode,
    stateClassName?: string,
  ) => (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className={cn('h-24 text-center', stateClassName)}
      >
        {content}
      </TableCell>
    </TableRow>
  );

  const handleRowClick = (
    event: MouseEvent<HTMLTableRowElement>,
    row: T,
  ) => {
    if (!onRowClick) return;

    const target = event.target;

    if (
      target instanceof Element &&
      target.closest(
        'button, a, input, select, textarea, [role="button"], [role="menuitem"], [data-row-action]',
      )
    ) {
      return;
    }

    onRowClick(row);
  };

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    row: T,
  ) => {
    if (!onRowClick) return;

    // Do not intercept keyboard events from controls inside the row.
    if (event.target !== event.currentTarget) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className={cn('w-full min-w-0', containerClassName)}>
      {search && (
        <div className="mt-6 mb-8 w-full max-w-sm">
          <Input
            type="search"
            value={search.value}
            placeholder={search.placeholder ?? 'Search...'}
            onChange={(event) => {
              resetPage();
              search.onChange(event.target.value);
            }}
            aria-label={search.placeholder ?? 'Search'}
          />
        </div>
      )}

      <div className="w-full min-w-0 overflow-x-auto rounded-md">
        <Table
          className={cn('w-full table-auto text-sm', className)}
        >
          {caption && (
            <TableCaption>{caption}</TableCaption>
          )}

          <TableHeader>
            <TableRow className="border-b">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  aria-sort={
                    sorting?.columnId === column.id &&
                    sorting.direction
                      ? sorting.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                        ? 'none'
                        : undefined
                  }
                  className={cn(
                    'h-14 whitespace-nowrap px-4 font-semibold',
                    {
                      'text-left':
                        column.align === undefined ||
                        column.align === 'left',
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                    },
                    column.headerClassName,
                  )}
                >
                  <SortableHeader
                    column={column}
                    sorting={sorting}
                    onPageReset={resetPage}
                  />
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
                  <div className="flex justify-center">
                    {loadingMessage}
                  </div>,
                )
              : error
                ? renderState(error, 'text-red-600')
                : displayedData.length === 0
                  ? renderState(emptyMessage)
                  : displayedData.map(
                      (row: T, index: number) => (
                        <TableRow
                          key={getRowKey(row, index, rowKey)}
                          tabIndex={onRowClick ? 0 : undefined}
                          className={cn(
                            'h-[72px]',
                            onRowClick && 'cursor-pointer',
                            typeof rowClassName === 'function'
                              ? rowClassName(row)
                              : rowClassName,
                          )}
                          onClick={(event) =>
                            handleRowClick(event, row)
                          }
                          onKeyDown={(event) =>
                            handleRowKeyDown(event, row)
                          }
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              className={cn(
                                'px-4',
                                {
                                  'text-left':
                                    column.align === undefined ||
                                    column.align === 'left',
                                  'text-center':
                                    column.align === 'center',
                                  'text-right':
                                    column.align === 'right',
                                },
                                column.className,
                              )}
                            >
                              {getCellValue(row, column)}
                            </TableCell>
                          ))}

                          {hasActions && (
                            <TableCell className="px-4 text-center">
                              {typeof actions === 'function'
                                ? actions(row)
                                : actions}
                            </TableCell>
                          )}
                        </TableRow>
                      ),
                    )}
          </TableBody>
        </Table>

        {pagination && !isLoading && !error && (
          <DataTablePagination
            currentPage={currentPage}
            pageCount={pageCount}
            visiblePages={visiblePages}
            onPageChange={pagination.onPageChange}
          />
        )}
      </div>
    </div>
  );
}

export { DataTable };
