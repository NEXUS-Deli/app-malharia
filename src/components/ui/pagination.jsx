import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const getPages = () => {
    const pages = []
    const delta = 1
    const start = Math.max(2, page - delta)
    const end = Math.min(totalPages - 1, page + delta)

    pages.push(1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <span className="text-xs text-text-muted">
        Mostrando {from} a {to} de {total} resultado{total !== 1 ? 's' : ''}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          {getPages().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-text-muted">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  p === page
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100'
                )}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
