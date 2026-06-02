import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { BarChart3 } from 'lucide-react'

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Relatórios</h1>
        <p className="text-sm text-text-muted mt-1">Relatórios e análises da produção</p>
      </div>

      <div className="text-center py-16">
        <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={40} className="text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Em breve</h3>
        <p className="text-sm text-text-muted max-w-sm mx-auto">
          Os relatórios detalhados de produção, desempenho e análise de gargalos estarão disponíveis em breve.
        </p>
      </div>
    </div>
  )
}
