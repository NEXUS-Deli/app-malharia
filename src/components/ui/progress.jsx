import { cn } from '../../lib/utils'

export function Progress({ value = 0, className }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-gray-100 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

export function StageProgress({ stages = [], currentStage }) {
  if (!stages.length) return null

  const currentIndex = stages.findIndex((s) => s.name === currentStage)
  const progress = ((currentIndex + 1) / stages.length) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Progresso</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
      <div className="grid gap-2">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={stage.name} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  isCompleted
                    ? 'bg-success-bg text-success'
                    : isCurrent
                    ? 'bg-primary-bg text-primary ring-2 ring-primary/20'
                    : 'bg-gray-100 text-text-muted'
                }`}
              >
                {isCompleted ? '✓' : isCurrent ? '●' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? 'text-success'
                      : isCurrent
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {stage.name}
                </p>
              </div>
              {isCurrent && (
                <span className="shrink-0 rounded-full bg-primary-bg px-2.5 py-0.5 text-xs font-medium text-primary">
                  Em andamento
                </span>
              )}
              {isCompleted && (
                <span className="shrink-0 rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success">
                  Concluída
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
