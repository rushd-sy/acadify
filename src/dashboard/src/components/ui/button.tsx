import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        secondary:
          'bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_15%)]',
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
);

function Button({
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  );
}

export { Button };
