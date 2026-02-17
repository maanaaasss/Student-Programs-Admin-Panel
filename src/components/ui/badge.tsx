import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    | 'default' 
    | 'secondary' 
    | 'destructive' 
    | 'outline' 
    | 'success' 
    | 'warning'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'processing'
    | 'completed'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
        {
          // Original variants
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90':
            variant === 'default',
          'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100':
            variant === 'secondary',
          'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100':
            variant === 'success' || variant === 'approved',
          'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100':
            variant === 'warning' || variant === 'pending',
          'border-red-200 bg-red-50 text-red-700 hover:bg-red-100':
            variant === 'destructive' || variant === 'rejected',
          'border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50':
            variant === 'outline',
          'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100':
            variant === 'processing',
          'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100':
            variant === 'completed',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
