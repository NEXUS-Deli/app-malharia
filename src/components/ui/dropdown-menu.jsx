import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

export function DropdownMenu({ children, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {children({ open, setOpen })}
    </div>
  )
}

export function DropdownTrigger({ open, setOpen, children, className }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </button>
  )
}

export function DropdownContent({ open, children, align = 'end', className }) {
  if (!open) return null
  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[200px] rounded-xl border border-border bg-card-bg py-1 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownItem({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 border-t border-border" />
}
