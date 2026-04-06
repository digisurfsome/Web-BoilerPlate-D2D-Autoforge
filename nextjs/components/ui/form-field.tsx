'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { Label } from '@/components/ui/label'

export interface FormFieldProps {
  /** The input's name attribute, used to link the label via htmlFor */
  name: string
  /** Label text displayed above the input */
  label: string
  /** Validation error message — shown in red below the input when present */
  error?: string
  /** Marks the field as required and shows a red asterisk next to the label */
  required?: boolean
  /** Optional helper text shown below the input (hidden when error is displayed) */
  description?: string
  /** Additional class names applied to the outer wrapper */
  className?: string
  /** The form control (input, select, textarea, etc.) to render inside the field */
  children: React.ReactNode
}

/**
 * Reusable form field wrapper that provides consistent label, error, and
 * description rendering around any form control.
 *
 * Usage:
 *   <FormField name="email" label="Email" error={errors.email} required>
 *     <Input id="email" name="email" type="email" />
 *   </FormField>
 */
export function FormField({
  name,
  label,
  error,
  required = false,
  description,
  className,
  children
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className={cn(error && 'text-red-500 dark:text-red-400')}>
        {label}
        {required && (
          <span className="ml-1 text-red-500 dark:text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {children}

      {error && (
        <p
          className="text-sm text-red-500 dark:text-red-400"
          role="alert"
          id={`${name}-error`}
        >
          {error}
        </p>
      )}

      {description && !error && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400" id={`${name}-description`}>
          {description}
        </p>
      )}
    </div>
  )
}
