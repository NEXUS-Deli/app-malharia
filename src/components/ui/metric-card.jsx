import { cn } from '../../lib/utils'

export function MetricCard({ title, value, icon: Icon, className }) {
  return (
    <div className={cn('rounded-xl border border-border-light bg-card-bg p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">{title}</p>
        {Icon && <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon size={20} /></div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
    </div>
  )
}
