import { cn } from '../../lib/utils'

export function Tooltip({ children, content, className }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-sidebar text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50',
          className
        )}
      >
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sidebar" />
      </div>
    </div>
  )
}
