import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

type ActionItem = {
  label: string;
  onSelect: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
};

type RowActionsMenuProps = {
  items: ActionItem[];
  label?: string;
};

export function RowActionsMenu({ items, label }: RowActionsMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={label ?? 'Open actions menu'}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={4}
          onClick={(event) => event.stopPropagation()}
          className="z-50 min-w-36 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {items.map((item, index) => (
            <DropdownMenuPrimitive.Item
              key={`${item.label}-${index}`}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(
                'flex cursor-pointer items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                item.variant === 'destructive' &&
                  'text-destructive focus:bg-destructive/10 focus:text-destructive',
              )}
            >
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
