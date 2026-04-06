/**
 * Typed environment variable access.
 *
 * Client-safe variables (NEXT_PUBLIC_*) are always available.
 * Server-only variables throw a descriptive error if accessed on the client.
 */

function getServerVar(name: string): string {
  if (typeof window !== 'undefined') {
    throw new Error(
      `[env] "${name}" is a server-only variable and cannot be accessed on the client. ` +
        'Move this code to a Server Component, Route Handler, or Server Action.'
    );
  }
  return process.env[name] ?? '';
}

function getClientVar(name: string): string {
  return process.env[name] ?? '';
}

export const env = {
  /** Supabase configuration */
  supabase: {
    get url() {
      return getClientVar('NEXT_PUBLIC_SUPABASE_URL');
    },
    get anonKey() {
      return getClientVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    },
    get serviceRoleKey() {
      return getServerVar('SUPABASE_SERVICE_ROLE_KEY');
    }
  },

  /** Stripe configuration (server-only) */
  stripe: {
    get secretKey() {
      return getServerVar('STRIPE_SECRET_KEY');
    },
    get webhookSecret() {
      return getServerVar('STRIPE_WEBHOOK_SECRET');
    }
  },

  /** PostHog analytics */
  posthog: {
    get key() {
      return getClientVar('NEXT_PUBLIC_POSTHOG_KEY');
    },
    get host() {
      return getClientVar('NEXT_PUBLIC_POSTHOG_HOST');
    }
  },

  /** General app configuration */
  app: {
    get url() {
      return getClientVar('NEXT_PUBLIC_SITE_URL');
    },
    get name() {
      return 'DevToDollars';
    }
  }
} as const;
