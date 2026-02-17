'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  destructive?: boolean
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block" data-dropdown>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 transition-colors',
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = 'end', className }: DropdownMenuContentProps) {
  const { isOpen } = React.useContext(DropdownMenuContext)

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'absolute z-50 min-w-[160px] rounded-md border border-slate-200 bg-white p-1 shadow-lg mt-1',
        align === 'end' ? 'right-0' : 'left-0',
        'animate-fadeIn',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className, destructive }: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  return (
    <button
      onClick={() => {
        onClick?.()
        setIsOpen(false)
      }}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left',
        destructive
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-100',
        className
      )}
    >
      {children}
    </button>
  )
}
