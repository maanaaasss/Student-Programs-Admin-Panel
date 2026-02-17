'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    // Lock body scroll when dialog is open
    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fadeIn"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog content */}
      <div className="relative z-50 w-full">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div
      className={cn(
        // Mobile: full screen
        'fixed inset-0 bg-white',
        // Tablet+: centered modal
        'md:relative md:inset-auto md:max-w-lg md:mx-auto md:rounded-lg md:shadow-xl md:border md:border-slate-200',
        // Animation
        'animate-scaleIn',
        // Overflow
        'overflow-y-auto max-h-screen',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn('sticky top-0 bg-white z-10 border-b border-slate-200 px-6 py-4', className)}>
      {children}
    </div>
  )
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-slate-900', className)}>
      {children}
    </h2>
  )
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-slate-600 mt-1', className)}>
      {children}
    </p>
  )
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 justify-end', className)}>
      {children}
    </div>
  )
}

export function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-md p-2 hover:bg-slate-100 transition-colors duration-150"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  )
}
