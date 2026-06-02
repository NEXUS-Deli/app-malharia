import { cn } from '../../lib/utils'

const colors = {
  default: 'bg-gray-100 text-text-primary',
  primary: 'bg-primary-bg text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ name, color = 'default', size = 'md', className }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        colors[color],
        sizes[size],
        className
      )}
    >
      {initials || '?'}
    </div>
  )
}
