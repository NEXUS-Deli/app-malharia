import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Accordion({ children, className }) {
  return <div className={cn('divide-y divide-border', className)}>{children}</div>
}

export function AccordionItem({ value, children, className }) {
  const [open, setOpen] = useState(value === 'open')
  return <div className={cn('py-2', className)}>{children({ open, setOpen })}</div>
}

export function AccordionTrigger({ open, setOpen, children, className }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        'flex w-full items-center justify-between py-3 text-sm font-medium text-text-primary hover:text-primary transition-colors cursor-pointer',
        className
      )}
    >
      {children}
      <ChevronDown
        size={16}
        className={cn(
          'text-text-muted transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  )
}

export function AccordionContent({ open, children, className }) {
  if (!open) return null
  return (
    <div className={cn('pb-4 pt-1 text-sm text-text-secondary', className)}>
      {children}
    </div>
  )
}
