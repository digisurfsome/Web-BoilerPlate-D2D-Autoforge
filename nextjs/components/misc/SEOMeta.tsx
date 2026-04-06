import type { Metadata } from 'next'
import { getURL } from '@/utils/helpers'

// ────────────────────────────────────────────────────────────────────
// Site-wide defaults (mirrors the values in app/layout.tsx)
// ────────────────────────────────────────────────────────────────────

const SITE_NAME = 'DevToDollars'
const DEFAULT_OG_IMAGE = getURL('/api/og')

// ────────────────────────────────────────────────────────────────────
// generatePageMetadata
// ────────────────────────────────────────────────────────────────────

interface PageMetadataOptions {
  /** Page title — will be suffixed with the site name (e.g. "Pricing | DevToDollars") */
  title: string
  /** Page description used for meta tags and social cards */
  description: string
  /** Open Graph image URL — falls back to the default OG image */
  ogImage?: string
  /** When true, tells search engines not to index this page */
  noIndex?: boolean
}

/**
 * Creates a Next.js Metadata object for a given page. Use this inside
 * the `generateMetadata` export of any route segment to get consistent
 * OG/Twitter/robots tags across the site.
 *
 * Extends (does not replace) the root layout metadata — Next.js merges
 * them automatically.
 *
 * Usage in a page file:
 *   import { generatePageMetadata } from '@/components/misc/SEOMeta'
 *
 *   export const metadata = generatePageMetadata({
 *     title: 'Pricing',
 *     description: 'Simple, transparent pricing for every team size.'
 *   })
 */
export function generatePageMetadata({
  title,
  description,
  ogImage,
  noIndex = false
}: PageMetadataOptions): Metadata {
  const image = ogImage ?? DEFAULT_OG_IMAGE
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = getURL()

  return {
    title: fullTitle,
    description,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630 }]
    }
  }
}

// ────────────────────────────────────────────────────────────────────
// JsonLd — Structured Data Component
// ────────────────────────────────────────────────────────────────────

interface JsonLdProps {
  /** A JSON-LD structured data object (schema.org). */
  data: Record<string, unknown>
}

/**
 * Renders a `<script type="application/ld+json">` tag containing
 * the provided structured data. Use this in any page or layout to
 * add schema.org markup for richer search results.
 *
 * Usage:
 *   <JsonLd data={{
 *     '@context': 'https://schema.org',
 *     '@type': 'Organization',
 *     name: 'DevToDollars',
 *     url: 'https://devtodollars.com'
 *   }} />
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
