'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: React.ReactNode
  className?: string
}

export function Accordion({ 
  type = 'multiple', 
  defaultValue, 
  children, 
  className 
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    })
  }, [type])

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<string | undefined>(undefined)

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn('border border-slate-200 rounded-lg overflow-hidden', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be used within Accordion')

  // Get the parent AccordionItem's value
  const itemElement = React.useContext(AccordionItemContext)
  const isOpen = itemElement ? context.openItems.includes(itemElement) : false

  const handleClick = () => {
    if (itemElement) {
      context.toggleItem(itemElement)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between p-4 text-left font-medium transition-all duration-150 hover:bg-slate-50',
        isOpen && 'border-b border-slate-200',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 text-slate-600 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  const itemElement = React.useContext(AccordionItemContext)
  
  if (!context) throw new Error('AccordionContent must be used within Accordion')
  
  const isOpen = itemElement ? context.openItems.includes(itemElement) : false

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className={cn('p-4 pt-2', className)}>{children}</div>
    </div>
  )
}
