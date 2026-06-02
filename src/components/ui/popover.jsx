import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Popover({ children, className }) {
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
    <div ref={ref} className={cn('relative', className)}>
      {children({ open, setOpen })}
    </div>
  )
}

export function PopoverTrigger({ open, setOpen, children, className }) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </button>
  )
}

export function PopoverContent({ open, children, className }) {
  if (!open) return null
  return (
    <div
      className={cn(
        'absolute z-50 mt-2 rounded-xl border border-border bg-card-bg p-4 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
