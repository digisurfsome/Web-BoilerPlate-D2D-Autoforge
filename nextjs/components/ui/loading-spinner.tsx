import { cn } from "@/utils/cn"

const SPINNER_SIZES = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const

type SpinnerSize = keyof typeof SPINNER_SIZES

export interface LoadingSpinnerProps {
  /** Spinner diameter: sm (16px), md (32px), lg (48px) */
  size?: SpinnerSize
  className?: string
}

/**
 * Animated spinning loader.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" />
 * ```
 */
function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-foreground",
        SPINNER_SIZES[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export interface PageLoaderProps {
  /** Optional message displayed below the spinner */
  message?: string
  /** Spinner size, defaults to lg for page-level use */
  size?: SpinnerSize
  className?: string
}

/**
 * Full-page centered spinner with an optional text message.
 * Use this as a loading state for entire pages or large sections.
 *
 * @example
 * ```tsx
 * <PageLoader />
 * <PageLoader message="Loading dashboard..." />
 * ```
 */
function PageLoader({ message, size = "lg", className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4",
        className
      )}
    >
      <LoadingSpinner size={size} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )
}

export interface SkeletonCardProps {
  /** Number of text lines to show in the skeleton */
  lines?: number
  className?: string
}

/**
 * Content placeholder card with pulse/shimmer animation.
 * Use this while data is loading to indicate the shape of the
 * content that will appear.
 *
 * @example
 * ```tsx
 * <SkeletonCard />
 * <SkeletonCard lines={4} />
 * ```
 */
function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg border border-border bg-card p-6",
        className
      )}
    >
      {/* Title placeholder */}
      <div className="mb-4 h-5 w-2/5 rounded bg-muted" />
      {/* Text line placeholders */}
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 rounded bg-muted",
              // Last line is shorter for a more natural look
              i === lines - 1 ? "w-3/5" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { LoadingSpinner, PageLoader, SkeletonCard }
