import { PropsWithChildren } from 'react';

/**
 * Hides content visually while keeping it accessible to screen readers.
 * Uses Tailwind's `sr-only` utility which applies the standard screen-reader-only pattern.
 *
 * Usage:
 *   <VisuallyHidden>Descriptive text for screen readers</VisuallyHidden>
 */
export function VisuallyHidden({ children }: PropsWithChildren) {
  return <span className="sr-only">{children}</span>;
}
