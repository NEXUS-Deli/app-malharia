import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Combobox({ options = [], value, onChange, placeholder = 'Selecione...', searchPlaceholder = 'Pesquisar...', emptyMessage = 'Nenhum resultado', className }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const wrapperRef = useRef(null)

  const selected = options.find(o => o.value === value)
  const filtered = search
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [search, open])

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex]
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filtered.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filtered.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          onChange(filtered[highlightedIndex].value)
          setOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={open ? search : (selected?.label || '')}
          onChange={(e) => {
            if (!open) setOpen(true)
            setSearch(e.target.value)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={open ? searchPlaceholder : placeholder}
          className="flex h-10 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-text"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
        />
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-border bg-white shadow-lg"
        >
          {filtered.length > 0 ? (
            filtered.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-3 transition-colors ${
                  index === highlightedIndex
                    ? 'bg-primary/10 text-primary'
                    : option.value === value
                    ? 'bg-primary/5 text-text-primary font-medium'
                    : 'text-text-primary hover:bg-gray-50'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(option.value)
                  setOpen(false)
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-text-muted text-center">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  )
}
