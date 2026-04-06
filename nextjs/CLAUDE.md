# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Production-ready Next.js SaaS boilerplate with Supabase backend, Stripe payments, PostHog analytics, and a comprehensive pre-built component library. Built for autonomous agent development via AutoForge.

### Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, RSC, Turbopack) | 16.1 |
| Language | TypeScript | 5.5+ |
| UI Library | React | 19 |
| Styling | Tailwind CSS v4 + tw-animate-css | 4.1 |
| Components | shadcn/ui (Radix UI primitives) | latest |
| Icons | Lucide React | 0.562 |
| Auth | Supabase Auth (email/password + OAuth) | - |
| Database | Supabase (PostgreSQL + Row Level Security) | - |
| Payments | Stripe (checkout, subscriptions, webhooks) | 15.x |
| Analytics | PostHog | 1.139+ |
| Package Manager | pnpm | - |
| Linting | ESLint 9 + eslint-config-next | - |
| Formatting | Prettier + prettier-plugin-tailwindcss | - |

---

## SUBSCRIPTION AUTH -- NON-NEGOTIABLE

```
+---------------------------------------------------------------------+
|  ALL CLAUDE MODELS (200K AND 1M) -> SUBSCRIPTION ONLY               |
|  (force_subscription=True)                                           |
|  NO EXCEPTIONS. NO API KEYS FOR SUBSCRIPTION MODELS. EVER.          |
+---------------------------------------------------------------------+
```

**Before you write a single line that calls Claude, confirm:**
1. Are you calling a Claude model? -> Subscription auth. `unset ANTHROPIC_API_KEY`. Always.
2. Not sure? -> Subscription. Default safe.

**How it works:** `get_effective_sdk_env()` in AutoForge's `registry.py` is the single
source of truth. When `force_subscription=True`, it clears `ANTHROPIC_API_KEY` and
`ANTHROPIC_AUTH_TOKEN` so the CLI falls back to `~/.claude/.credentials.json`
(subscription OAuth). Every Claude call in the system goes through this function.

**If you skip this, the user burns API credits on their subscription models. That is a bug.**

---

## SDK CLIENT PATTERN -- 3 BUGS THAT BREAK EVERYTHING

```
+---------------------------------------------------------------------+
|  NEVER use permission_mode="bypassPermissions" -- IT CRASHES         |
|  (exit code 3, Bun runtime crash on Windows).                        |
|                                                                      |
|  ALWAYS use permission_mode="acceptEdits" + settings file.           |
|  ALWAYS wrap receive_response() in try/except for recovery.          |
|  ALWAYS pass on_progress callbacks through to _call_via_sdk().       |
+---------------------------------------------------------------------+
```

**The 3 bugs (stacked -- each hid the next):**

1. **`permission_mode="bypassPermissions"` crashes the CLI.** Use `"acceptEdits"` +
   a settings file at `.autoforge/settings.json` with:
   ```json
   {
     "permissions": {
       "defaultMode": "acceptEdits",
       "allow": []
     }
   }
   ```

2. **No logging = blind debugging.** Every SDK call MUST log to both `logger.info()`
   AND the `on_progress()` callback. SDK calls take 120-200 seconds. Without logs
   streaming to the browser, nobody can diagnose failures.

3. **The SDK throws `"Unknown message type: rate_limit_event"` as an EXCEPTION,
   not a yielded message.** This kills the `async for msg in client.receive_response()`
   loop AFTER the full response has been collected, throwing away completed work.
   ALWAYS wrap that loop in try/except and recover `full_text` if content was already
   received:
   ```python
   try:
       async for msg in client.receive_response():
           # ... collect full_text ...
   except Exception as exc:
       if full_text.strip() and "unknown message type" in str(exc).lower():
           pass  # Use the text we already have
       elif full_text.strip():
           pass  # Try to use what we have
       else:
           raise  # No text -- re-raise
   ```

---

## Commands

```bash
# Development
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server (Turbopack, port 3000)
pnpm build                      # Production build (catches type errors)
pnpm start                      # Start production server
pnpm lint                       # Run ESLint
pnpm prettier-fix               # Format code with Prettier

# Supabase
pnpm supabase:start             # Start local Supabase (Docker)
pnpm supabase:stop              # Stop local Supabase
pnpm supabase:status            # View connection info
pnpm supabase:reset             # Reset database (destructive)
pnpm supabase:generate-types    # Regenerate types_db.ts from schema

# Stripe (local development)
pnpm stripe:login               # Authenticate with Stripe CLI
pnpm stripe:listen              # Forward webhooks to local Supabase
pnpm stripe:fixtures            # Load test products/prices

# Type checking (standalone)
npx tsc --noEmit                # TypeScript type check without build
```

---

## Project Structure

```
nextjs/
|-- app/                          # Next.js App Router pages
|   |-- layout.tsx                # Root layout (providers, fonts, analytics)
|   |-- page.tsx                  # Landing page
|   |-- providers.tsx             # PostHog + theme providers
|   |-- PostHogPageView.tsx       # Pageview tracking component
|   |-- not-found.tsx             # Custom 404 page
|   |-- error.tsx                 # Custom error boundary page
|   |-- account/page.tsx          # User account management
|   |-- auth/[id]/page.tsx        # Login/signup/reset forms
|   |-- privacy/page.tsx          # Privacy policy shell
|   |-- terms/page.tsx            # Terms of service shell
|   |-- api/                      # API route handlers
|       |-- auth_callback/route.ts
|       |-- reset_password/route.ts
|       |-- og/route.tsx          # Open Graph image generation
|
|-- components/
|   |-- icons/                    # Custom icon components (Logo, GitHub)
|   |-- landing/                  # Landing page sections
|   |   |-- Hero.tsx, FAQ.tsx, Footer.tsx, Navbar.tsx
|   |   |-- Pricing.tsx, Stats.tsx, Cta.tsx, Items.tsx
|   |   |-- Logos.tsx, Icons.tsx, mode-toggle.tsx
|   |-- misc/                     # Shared miscellaneous components
|   |   |-- AccountPage.tsx       # Account page content
|   |   |-- AuthForm.tsx          # Auth form component
|   |   |-- SEOMeta.tsx           # Metadata generation helper
|   |   |-- CookieConsent.tsx     # GDPR cookie consent banner
|   |   |-- PostHogPageViewWrapper.tsx
|   |-- ui/                       # UI primitives (shadcn/ui + custom)
|       |-- accordion.tsx, avatar.tsx, badge.tsx, breadcrumb.tsx
|       |-- button.tsx, card.tsx, dialog.tsx, dropdown-menu.tsx
|       |-- glow.tsx, input.tsx, item.tsx, label.tsx
|       |-- navigation-menu.tsx, scroll-area.tsx, section.tsx
|       |-- sheet.tsx, skeleton.tsx, toast.tsx, toaster.tsx
|       |-- use-toast.ts
|       |-- error-boundary.tsx    # React error boundary with retry
|       |-- loading-spinner.tsx   # Reusable loading spinner
|       |-- empty-state.tsx       # Empty list state (icon + CTA)
|       |-- form-field.tsx        # Labeled input with error display
|       |-- skip-nav.tsx          # Accessibility skip-to-content
|       |-- visually-hidden.tsx   # Screen reader-only content
|
|-- lib/
|   |-- utils.ts                  # cn() class merger utility
|   |-- toast.ts                  # showSuccess(), showError() helpers
|   |-- form-validation.ts       # Zod validation schemas
|   |-- env.ts                    # Typed environment variable access
|   |-- design-tokens.ts         # Centralized design tokens
|   |-- services/
|       |-- base-service.ts       # Base CRUD service pattern
|       |-- index.ts              # Service exports
|
|-- utils/
|   |-- cn.ts                     # Class name utility
|   |-- helpers.ts                # General helper functions
|   |-- types.ts                  # Shared utility types
|   |-- supabase/
|       |-- server.ts             # Server Component client
|       |-- client.ts             # Client Component client
|       |-- middleware.ts         # Auth session refresh
|       |-- api.ts                # Route handler client
|       |-- admin.ts              # Service-role admin client
|       |-- queries.ts            # Common data-fetching helpers
|
|-- types_db.ts                   # Auto-generated DB types (from Supabase)
|-- schema.sql                    # Database schema with RLS policies
|-- .autoforge/                   # AutoForge agent configuration
|   |-- prompts/
|   |   |-- initializer_prompt.md # Session 1 prompt
|   |   |-- coding_prompt.md      # Continuation session prompt
|   |-- allowed_commands.yaml     # Allowed bash commands for agents
|   |-- settings.json             # Permission mode config
|   |-- .gitignore                # Ignore features.db, .agent.lock
|-- scripts/
|   |-- verify-autoforge-connection.sh  # Verify AutoForge setup (Unix)
|   |-- verify-autoforge-connection.bat # Verify AutoForge setup (Windows)
```

---

## Pre-Built Components Inventory

Agents: before building ANY of these, check if they already exist. They do.

### UI Components

| Component | File | Purpose | How to Use |
|-----------|------|---------|------------|
| Error Boundary | `components/ui/error-boundary.tsx` | Catches React errors, shows fallback with retry | Wrap component trees: `<ErrorBoundary><YourComponent /></ErrorBoundary>` |
| Loading Spinner | `components/ui/loading-spinner.tsx` | Animated spinner for async states | `<LoadingSpinner />` or `<LoadingSpinner size="lg" />` |
| Skeleton | `components/ui/skeleton.tsx` | Shimmer placeholder for loading content | `<Skeleton className="h-4 w-full" />` |
| Empty State | `components/ui/empty-state.tsx` | Icon + message + CTA for empty lists | `<EmptyState icon={InboxIcon} title="No items" action={<Button>Create</Button>} />` |
| Toast System | `components/ui/toast.tsx` + `toaster.tsx` + `use-toast.ts` | Radix-based notifications | Already mounted in layout. Call `showSuccess("Done!")` or `showError("Failed")` |
| Toast Helpers | `lib/toast.ts` | Convenience wrappers | `import { showSuccess, showError } from '@/lib/toast'` |
| Form Field | `components/ui/form-field.tsx` | Labeled input with error message | `<FormField label="Email" error={errors.email} {...register('email')} />` |
| Form Validation | `lib/form-validation.ts` | Zod schemas | `import { emailSchema, passwordSchema } from '@/lib/form-validation'` |
| Skip Nav | `components/ui/skip-nav.tsx` | Accessibility skip-to-content link | Already in layout |
| Visually Hidden | `components/ui/visually-hidden.tsx` | Screen reader-only text | `<VisuallyHidden>Loading</VisuallyHidden>` |
| Design Tokens | `lib/design-tokens.ts` | Centralized color/spacing/typography | `import { colors, spacing } from '@/lib/design-tokens'` |
| Service Layer | `lib/services/base-service.ts` | Base CRUD operations against Supabase | Extend `BaseService` for each entity |

### shadcn/ui Primitives (All in `components/ui/`)

Accordion, Avatar, Badge, Breadcrumb, Button, Card, Dialog, Dropdown Menu,
Glow, Input, Item, Label, Navigation Menu, Scroll Area, Section, Sheet.

### Pages

| Page | Route | File |
|------|-------|------|
| Landing | `/` | `app/page.tsx` |
| Auth (login/signup/reset) | `/auth/[id]` | `app/auth/[id]/page.tsx` |
| Account | `/account` | `app/account/page.tsx` |
| Privacy Policy | `/privacy` | `app/privacy/page.tsx` |
| Terms of Service | `/terms` | `app/terms/page.tsx` |
| 404 Not Found | (auto) | `app/not-found.tsx` |
| Error | (auto) | `app/error.tsx` |

### Backend Infrastructure

| Component | File | Purpose |
|-----------|------|---------|
| Supabase Server Client | `utils/supabase/server.ts` | Auth-aware client for Server Components |
| Supabase Browser Client | `utils/supabase/client.ts` | Auth-aware client for Client Components |
| Supabase Middleware | `utils/supabase/middleware.ts` | Session refresh on every request |
| Supabase API Client | `utils/supabase/api.ts` | Auth-aware client for Route Handlers |
| Supabase Admin | `utils/supabase/admin.ts` | Service-role client (bypasses RLS) |
| DB Queries | `utils/supabase/queries.ts` | Common data-fetching helpers |
| DB Types | `types_db.ts` | Auto-generated from `schema.sql` |
| Stripe Integration | Supabase edge functions | Checkout, webhooks, subscription sync |
| PostHog | `app/providers.tsx` | Analytics initialization and pageview tracking |

---

## Architecture Patterns

### Authentication

- Supabase Auth handles all auth (email/password, OAuth)
- Server Components use `createClient()` from `utils/supabase/server.ts`
- Client Components use `createClient()` from `utils/supabase/client.ts`
- Middleware refreshes sessions via `utils/supabase/middleware.ts`
- On user creation, `handle_new_user()` trigger creates entry in `users` table
- Row Level Security (RLS) enforces data isolation per user

### Data Access Pattern

```
Component -> Service (lib/services/) -> Supabase Client -> PostgreSQL
                                                            (with RLS)
```

**NEVER** call the database directly from components. Always go through
the service layer or Supabase query helpers.

### Payment Flow

1. User initiates checkout from frontend
2. Frontend calls `get_stripe_url` edge function with price ID
3. Edge function creates Stripe checkout session, returns URL
4. User completes payment in Stripe
5. Stripe sends webhook to `stripe_webhook` edge function
6. Webhook syncs subscription data to `subscriptions` table
7. Frontend refreshes to show updated subscription status

### Database Tables (from schema.sql)

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | User profiles with billing info | Yes |
| `customers` | Supabase user ID -> Stripe customer ID mapping | Yes (private) |
| `products` | Stripe products (synced via webhook) | Yes |
| `prices` | Stripe prices (synced via webhook) | Yes |
| `subscriptions` | User subscription status (synced via webhook) | Yes |

### Supabase Client Usage Rules

**Do NOT** create Supabase clients directly with `createClient()` from `@supabase/supabase-js`.
Always use the appropriate utility:

| Context | Import |
|---------|--------|
| Server Components | `import { createClient } from '@/utils/supabase/server'` |
| Client Components | `import { createClient } from '@/utils/supabase/client'` |
| Middleware | `import { updateSession } from '@/utils/supabase/middleware'` |
| Route Handlers | `import { createClient } from '@/utils/supabase/api'` |
| Admin operations | `import { createClient } from '@/utils/supabase/admin'` |

### Type Generation

After modifying the database schema:
```bash
pnpm supabase:generate-types
```
This updates `types_db.ts` in both `nextjs/` and `supabase/functions/`.

---

## Coding Standards for Agents

### Must Do

1. Use TypeScript with explicit types (NO `any`)
2. Use Tailwind CSS classes (NO inline styles)
3. Use Lucide React for icons (`import { Icon } from 'lucide-react'`)
4. Use the service layer for data operations (NOT direct DB calls in components)
5. Use `showSuccess()` / `showError()` from `lib/toast` for user feedback
6. Use `EmptyState` component for empty lists
7. Use `Skeleton` component for loading states
8. Use `next-themes` for dark mode (already configured)
9. Autofocus first input in all forms
10. Add search/filter to lists with 5+ expected items
11. Separate Detail View from Edit View (never combine)
12. Use Dialog (from shadcn/ui) for destructive action confirmations

### Must NOT Do

1. Create duplicate components that already exist (check inventory above)
2. Use `alert()`, `confirm()`, or `prompt()` -- use toast and Dialog
3. Use mock data, hardcoded arrays, or `globalThis` stores
4. Skip error handling or leave TODO comments for "real API later"
5. Use `permission_mode="bypassPermissions"` anywhere
6. Set `ANTHROPIC_API_KEY` for subscription-model calls
7. Put database queries directly in components
8. Use `any` type in TypeScript

---

## Environment Variables

Uses `.env` (or `.env.local` for local dev). Check `.env.example` for required vars.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key (server only)
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog instance URL

---

## AutoForge Integration

### Directory: `.autoforge/`

| File | Purpose |
|------|---------|
| `prompts/initializer_prompt.md` | First-session prompt (feature creation) |
| `prompts/coding_prompt.md` | Continuation session prompt (feature implementation) |
| `allowed_commands.yaml` | Bash commands agents can use (pnpm, next, tsc, eslint, etc.) |
| `settings.json` | Permission mode config (`acceptEdits`) |
| `.gitignore` | Ignores runtime files (features.db, .agent.lock, *.log) |

### Verification Script

Run `scripts/verify-autoforge-connection.sh` (Unix) or
`scripts/verify-autoforge-connection.bat` (Windows) to verify:
- Subscription credentials are present
- API key is not set (subscription mode)
- AutoForge directory structure is correct

---

## Local Development Ports

| Service | Port | URL |
|---------|------|-----|
| Next.js | 3000 | http://localhost:3000 |
| Supabase API | 54321 | http://localhost:54321 |
| Supabase DB | 54322 | postgresql://postgres:postgres@localhost:54322/postgres |
| Supabase Studio | 54323 | http://localhost:54323 |

---

## Package Manager

This project uses **pnpm**. Do NOT use npm or yarn.

```bash
pnpm install           # Install deps
pnpm add <package>     # Add a dependency
pnpm add -D <package>  # Add a dev dependency
```
