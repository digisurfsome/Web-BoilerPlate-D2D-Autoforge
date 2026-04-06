// Requires: pnpm add zod
import { z, type ZodSchema } from 'zod'

// ────────────────────────────────────────────────────────────────────
// Common Validation Schemas
// ────────────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')

// ────────────────────────────────────────────────────────────────────
// Form Validation Helper
// ────────────────────────────────────────────────────────────────────

type ValidationSuccess<T> = { success: true; data: T }
type ValidationFailure = { success: false; errors: Record<string, string> }
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

/**
 * Validates form data against a Zod schema and returns either the parsed
 * data or a flat record of field-level error messages.
 *
 * Usage:
 *   const result = validateForm(mySchema, formData)
 *   if (!result.success) {
 *     // result.errors is Record<string, string> keyed by field name
 *   }
 */
export function validateForm<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Flatten Zod issues into a single error message per field path
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.')
    // Keep only the first error per field to avoid overwhelming the user
    if (!errors[key]) {
      errors[key] = issue.message
    }
  }

  return { success: false, errors }
}

// Re-export Zod for convenience so consumers don't need a separate import
export { z } from 'zod'
export type { ZodSchema } from 'zod'
