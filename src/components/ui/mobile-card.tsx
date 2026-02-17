import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface MobileCardProps {
  title: string
  subtitle?: string
  metadata?: { label: string; value: React.ReactNode }[]
  badges?: { label: string; variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' }[]
  actions?: {
    label: string
    icon?: LucideIcon
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link'
  }[]
  className?: string
}

export function MobileCard({
  title,
  subtitle,
  metadata,
  badges,
  actions,
  className,
}: MobileCardProps) {
  return (
    <div className={cn('mobile-card space-y-3', className)}>
      {/* Title and subtitle */}
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
      </div>

      {/* Metadata */}
      {metadata && metadata.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-2 text-sm">
              <span className="text-slate-600 font-medium min-w-0 flex-shrink-0">
                {item.label}:
              </span>
              <span className="text-slate-900 text-right break-words">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant || 'default'}>
              {badge.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              className="flex-1 min-w-[100px]"
            >
              {action.icon && <action.icon className="h-4 w-4 mr-1" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
