/**
 * Accessible skip navigation components.
 *
 * Usage in app/layout.tsx:
 *   import { SkipNav, SkipNavContent } from '@/components/ui/skip-nav';
 *
 *   <body>
 *     <SkipNav />
 *     <header>...</header>
 *     <SkipNavContent>
 *       {children}
 *     </SkipNavContent>
 *   </body>
 */

import { PropsWithChildren } from 'react';

/**
 * Hidden link that becomes visible on keyboard focus.
 * Allows keyboard users to skip directly to the main content.
 */
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

/**
 * Renders the skip navigation target with `id="main-content"`.
 * Wrap your main content area with this component.
 */
export function SkipNavContent({ children }: PropsWithChildren) {
  return (
    <div id="main-content" tabIndex={-1} className="outline-hidden">
      {children}
    </div>
  );
}
