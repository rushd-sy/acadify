import type { Key, ReactNode } from 'react';

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

type DataTableSortingBase = {
  columnId?: string;
  direction?: DataTableSortDirection;
  onChange: (
    columnId: string,
    direction: DataTableSortDirection | undefined,
  ) => void;
};

export type DataTableSorting =
  | (DataTableSortingBase & {
      mode?: 'client';
    })
  | (DataTableSortingBase & {
      mode: 'server';
    });

type DataTableSearchBase = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export type DataTableSearch<T> =
  | (DataTableSearchBase & {
      mode?: 'client';
      filter: (row: T, searchValue: string) => boolean;
    })
  | (DataTableSearchBase & {
      mode: 'server';
    });

type DataTablePaginationBase = {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export type DataTablePagination =
  | (DataTablePaginationBase & {
      mode?: 'client';
    })
  | (DataTablePaginationBase & {
      mode: 'server';
      total: number;
    });

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
