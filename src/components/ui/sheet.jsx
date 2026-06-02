import { cn } from '../../lib/utils'

export function Sheet({ open, onClose, children, side = 'left' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'fixed top-0 bottom-0 z-50 w-64 bg-sidebar shadow-xl transition-transform duration-300',
          side === 'left' ? 'left-0' : 'right-0'
        )}
      >
        {children}
      </div>
    </div>
  )
}
