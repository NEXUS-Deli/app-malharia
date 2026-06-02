import { statusLabels, statusColors, priorityLabels, priorityColors } from '../../lib/utils'

export function StatusBadge({ status }) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800'
  const label = statusLabels[status] || status
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const colorClass = priorityColors[priority] || 'bg-gray-100 text-gray-600'
  const label = priorityLabels[priority] || priority
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
