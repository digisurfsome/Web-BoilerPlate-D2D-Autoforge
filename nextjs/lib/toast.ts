/**
 * Thin convenience wrappers around the shadcn/Radix toast system.
 *
 * Instead of importing `toast` from `@/components/ui/use-toast` and
 * figuring out variant/title/description every time, just:
 *
 * @example
 * ```ts
 * import { showSuccess, showError, showInfo, showWarning } from "@/lib/toast"
 *
 * showSuccess("Profile saved")
 * showError("Failed to delete item")
 * showInfo("New version available")
 * showWarning("Your session expires in 5 minutes")
 * ```
 */
import { toast } from "@/components/ui/use-toast"

/**
 * Show a success toast with a checkmark prefix.
 * Uses the default (non-destructive) variant.
 */
export function showSuccess(message: string): void {
  toast({
    title: "Success",
    description: message,
  })
}

/**
 * Show an error toast.
 * Uses the destructive variant for visual urgency.
 */
export function showError(message: string): void {
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  })
}

/**
 * Show an informational toast.
 * Uses the default variant — same look as success but with a
 * neutral "Info" title to distinguish intent.
 */
export function showInfo(message: string): void {
  toast({
    title: "Info",
    description: message,
  })
}

/**
 * Show a warning toast.
 * Uses the default variant with a "Warning" title.
 * (The Radix toast system only ships default + destructive variants;
 * if you later add a "warning" variant to toast.tsx, update this.)
 */
export function showWarning(message: string): void {
  toast({
    title: "Warning",
    description: message,
  })
}
