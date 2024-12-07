'use client'

import type { FieldError } from 'react-hook-form'
import { cn } from '~/lib/ui'
import { Label } from './label'

export interface FieldProps {
  label: string
  icon: React.ReactNode
  error?: FieldError
  children: React.ReactNode
  className?: string
}

export function Field({
  label,
  icon,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <Label className="relative">
        {label}
        <div className={cn('relative [&>input]:pl-10 [&>textarea]:pl-10', {
          '[&>input]:border-red-500 focus-visible:[&>input]:ring-red-500': error,
          '[&>textarea]:border-red-500 focus-visible:[&>textarea]:ring-red-500': error,
        })}
        >
          <div className="absolute left-3 top-5 -translate-y-1/2 text-primary">
            {icon}
          </div>
          {children}
        </div>
        {error && (
          <p className="absolute right-0 top-0 z-10 cursor-pointer text-xs text-red-500">{error.message}</p>
        )}
      </Label>
    </div>
  )
}
