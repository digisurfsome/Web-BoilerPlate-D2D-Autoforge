'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

type ConsentStatus = 'accepted' | 'declined' | null;

/**
 * Cookie consent banner that persists the user's choice to localStorage.
 *
 * Usage in app/layout.tsx:
 *   import { CookieConsent } from '@/components/misc/CookieConsent';
 *   // Place <CookieConsent /> inside <body>, after <Toaster /> or similar
 */
export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus;
    setConsent(stored);
    setMounted(true);
  }, []);

  // Don't render during SSR or if user already made a choice
  if (!mounted || consent !== null) {
    return null;
  }

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setConsent('declined');
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-md sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-6"
    >
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience. By continuing to use this
        site, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
        <button
          onClick={handleDecline}
          className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
