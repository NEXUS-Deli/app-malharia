import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { StatusBadge, PriorityBadge } from '../components/ui/status-badge'
import { Badge } from '../components/ui/badge'
import { formatDate } from '../lib/utils'
import { ordersService } from '../services/orders'

export function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [o, h] = await Promise.all([
          ordersService.getById(id),
          ordersService.getHistory(id),
        ])
        setOrder(o)
        setHistory(h)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleFinish = async () => {
    if (!confirm('Finalizar esta OS?')) return
    await ordersService.finish(id)
    window.location.reload()
  }

  const handleCancel = async () => {
    if (!confirm('Cancelar esta OS?')) return
    await ordersService.cancel(id)
    window.location.reload()
  }

  const handleAdvance = async () => {
    await ordersService.moveToNextStage(id)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!order) {
    return <p className="text-text-muted">OS não encontrada</p>
  }

  const stages = order.production_order_stages || []
  const currentStage = stages.find(s => s.status === 'em_andamento')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">OS #{order.order_number}</h1>
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
            <p className="text-sm text-text-muted mt-1">Criada em {formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status !== 'finalizada' && order.status !== 'cancelada' && order.status !== 'entregue' && (
            <>
              <Button variant="outline" onClick={handleAdvance}>
                <ArrowLeft size={16} className="rotate-180" /> Avançar Fase
              </Button>
              <Button onClick={handleFinish}>
                <CheckCircle size={16} /> Finalizar
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                <XCircle size={16} /> Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted mb-1">Cliente</p>
                  <p className="font-medium text-text-primary">{order.clients?.name}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Produto</p>
                  <p className="font-medium text-text-primary">{order.products?.name}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Quantidade</p>
                  <p className="font-medium text-text-primary">{order.quantity} unidades</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Data de Entrada</p>
                  <p className="font-medium text-text-primary">{formatDate(order.entry_date)}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Prazo de Entrega</p>
                  <p className="font-medium text-text-primary">{formatDate(order.delivery_date)}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Fase Atual</p>
                  <p className="font-medium text-primary">{order.current_stage || '—'}</p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-4">
                  <p className="text-text-muted text-sm mb-1">Observações</p>
                  <p className="text-sm text-text-primary bg-gray-50 rounded-lg p-3">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fases da Produção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stages
                  .sort((a, b) => (a.production_stages?.position || 0) - (b.production_stages?.position || 0))
                  .map((stage) => (
                    <div key={stage.id} className="flex items-center gap-4 p-3 rounded-lg border border-border-light">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stage.status === 'concluida' ? 'bg-green-100 text-green-700' :
                        stage.status === 'em_andamento' ? 'bg-primary/10 text-primary' :
                        stage.status === 'pulada' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {stage.status === 'concluida' ? '✓' :
                         stage.status === 'em_andamento' ? '●' :
                         stage.status === 'pulada' ? '→' :
                         stage.production_stages?.position}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{stage.production_stages?.name}</p>
                        <p className="text-xs text-text-muted">
                          {stage.status === 'concluida' ? `Concluída em ${formatDate(stage.completed_at)}` :
                           stage.status === 'em_andamento' ? 'Em andamento' :
                           stage.status === 'pulada' ? 'Pulada' : 'Pendente'}
                        </p>
                      </div>
                      <StatusBadge status={stage.status} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((h) => (
                    <div key={h.id} className="flex gap-3">
                      <div className="mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary/50" />
                      </div>
                      <div>
                        <p className="text-sm text-text-primary">{h.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-text-muted">{formatDate(h.created_at)}</span>
                          {h.profiles?.name && (
                            <span className="text-xs text-text-muted">por {h.profiles.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-6">Nenhum registro</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
