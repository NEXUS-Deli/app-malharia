import { useEffect, useState } from 'react'
import { FileText, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { MetricCard } from '../components/ui/metric-card'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { StatusBadge, PriorityBadge } from '../components/ui/status-badge'
import { formatDate } from '../lib/utils'
import { dashboardService } from '../services/dashboard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export function Dashboard() {
  const [metrics, setMetrics] = useState({ open: 0, inProduction: 0, finished: 0, delayed: 0 })
  const [productionByStage, setProductionByStage] = useState([])
  const [latestOrders, setLatestOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [m, p, l] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getProductionByStage(),
          dashboardService.getLatestOrders(),
        ])
        setMetrics(m)
        setProductionByStage(p)
        setLatestOrders(l)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Visão geral da produção</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="OS Abertas" value={metrics.open} icon={FileText} />
        <MetricCard title="Em Produção" value={metrics.inProduction} icon={PlayCircle} />
        <MetricCard title="Finalizadas" value={metrics.finished} icon={CheckCircle2} />
        <MetricCard title="Atrasadas" value={metrics.delayed} icon={AlertCircle} className="border-red-200" />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produção por Fase</CardTitle>
          </CardHeader>
          <CardContent>
            {productionByStage.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionByStage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                    <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-12">Nenhuma OS em produção</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Ordens de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            {latestOrders.length > 0 ? (
              <div className="space-y-3">
                {latestOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border border-border-light p-3">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        #{order.order_number} - {order.clients?.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {order.products?.name} • {order.quantity} un • {formatDate(order.delivery_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={order.priority} />
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-12">Nenhuma OS criada ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
