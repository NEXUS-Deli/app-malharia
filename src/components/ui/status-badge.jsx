import { statusLabels, statusColors, priorityLabels, priorityColors } from '../../lib/utils'

export function StatusBadge({ status }) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-text-muted'
  const label = statusLabels[status] || status
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const colorClass = priorityColors[priority] || 'bg-gray-100 text-text-muted'
  const label = priorityLabels[priority] || priority
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
