import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/utils/cn"

export interface EmptyStateProps {
  /** Lucide icon component to display above the title */
  icon: LucideIcon
  /** Primary heading text */
  title: string
  /** Supporting description text */
  description?: string
  /** Optional action element (typically a Button) rendered below the description */
  action?: React.ReactNode
  className?: string
}

/**
 * Reusable empty state for lists, tables, and pages.
 * Shows a muted icon, heading, optional description, and optional action button.
 *
 * @example
 * ```tsx
 * import { Inbox } from "lucide-react"
 * import { Button } from "@/components/ui/button"
 *
 * <EmptyState
 *   icon={Inbox}
 *   title="No messages yet"
 *   description="When you receive messages, they'll appear here."
 *   action={<Button>Compose message</Button>}
 * />
 * ```
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

export { EmptyState }
