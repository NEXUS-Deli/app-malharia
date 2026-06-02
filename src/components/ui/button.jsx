import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  destructive: 'bg-danger text-white hover:bg-red-600',
  outline: 'border border-border bg-card-bg hover:bg-gray-50 text-text-primary',
  secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200',
  ghost: 'hover:bg-gray-100 text-text-secondary',
  link: 'text-primary underline-offset-4 hover:underline',
}

const sizes = {
  default: 'h-10 px-5 py-2',
  sm: 'h-9 rounded-lg px-3',
  lg: 'h-11 rounded-xl px-8',
  icon: 'h-10 w-10',
}

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
