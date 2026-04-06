"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"

/**
 * Props for the ErrorBoundary component.
 *
 * @example
 * ```tsx
 * // With default fallback
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={<div>Custom error UI</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With render prop fallback for access to error + reset
 * <ErrorBoundary fallback={(error, reset) => (
 *   <div>
 *     <p>{error.message}</p>
 *     <button onClick={reset}>Retry</button>
 *   </div>
 * )}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Custom fallback UI, or a render function receiving (error, resetFn) */
  fallback?:
    | React.ReactNode
    | ((error: Error, reset: () => void) => React.ReactNode)
  /** Called when an error is caught, useful for logging */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Additional className for the default fallback wrapper */
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * React error boundary that catches rendering errors in its subtree
 * and displays a friendly fallback UI instead of crashing the page.
 *
 * React 19 still requires a class component for error boundaries —
 * there is no hook-based equivalent.
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo)
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    if (!this.state.hasError || !this.state.error) {
      return this.props.children
    }

    const { fallback, className } = this.props
    const { error } = this.state

    // Render prop fallback — caller gets error + reset function
    if (typeof fallback === "function") {
      return fallback(error, this.reset)
    }

    // Static ReactNode fallback
    if (fallback !== undefined) {
      return fallback
    }

    // Default fallback UI
    return (
      <div
        className={cn(
          "flex items-center justify-center p-6",
          className
        )}
      >
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-card-foreground">
            Something went wrong
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={this.reset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }
}

/**
 * Higher-order component that wraps a component in an ErrorBoundary.
 *
 * @example
 * ```tsx
 * const SafeDashboard = withErrorBoundary(Dashboard)
 * // or with custom props:
 * const SafeDashboard = withErrorBoundary(Dashboard, {
 *   fallback: <div>Dashboard failed to load</div>,
 *   onError: (err) => console.error(err),
 * })
 * ```
 */
function withErrorBoundary<P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
): React.FC<P> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component"

  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`
  return WithErrorBoundary
}

export { ErrorBoundary, withErrorBoundary }
