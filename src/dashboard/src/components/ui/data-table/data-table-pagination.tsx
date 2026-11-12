import { cn } from '@/lib/utils';

type DataTablePaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  visiblePages: readonly (number | 'ellipsis')[];
};

export function DataTablePagination({
  currentPage,
  pageCount,
  onPageChange,
  visiblePages,
}: DataTablePaginationProps) {
  if (pageCount <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < pageCount;

  return (
    <div className="flex justify-center overflow-x-auto border-t px-4 py-4">
      <div className="flex min-w-max items-center gap-1 text-sm">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(pageItem)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-base text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
