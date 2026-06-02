import { cn } from '../../lib/utils'

export function MetricCard({ title, value, icon: Icon, subtitle, trend, className }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card-bg p-6 shadow-sm hover:shadow-md transition-all duration-200', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-text-muted">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-bg">
            <Icon size={24} className="text-primary" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
          <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
          <span className="text-text-muted font-normal">em relação ao mês anterior</span>
        </div>
      )}
    </div>
  )
}
