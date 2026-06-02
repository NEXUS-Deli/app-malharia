import { useState } from 'react'
import { cn } from '../../lib/utils'

export function Tabs({ defaultValue, children, className }) {
  const [active, setActive] = useState(defaultValue)
  return (
    <div className={cn('w-full', className)}>
      {children({ active, setActive })}
    </div>
  )
}

export function TabsList({ children, active, className }) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, active, setActive, children, className }) {
  const isActive = active === value
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer',
        isActive
          ? 'bg-white text-text-primary shadow-sm'
          : 'text-text-secondary hover:text-text-primary',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, active, children, className }) {
  if (active !== value) return null
  return <div className={cn('mt-4', className)}>{children}</div>
}
