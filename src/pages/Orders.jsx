import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Filter } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'
import { StatusBadge, PriorityBadge } from '../components/ui/status-badge'
import { formatDate } from '../lib/utils'
import { ordersService } from '../services/orders'

export function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    try {
      const filters = {}
      if (statusFilter) filters.status = statusFilter
      const data = await ordersService.list(filters)
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = orders.filter(o =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.clients?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ordens de Serviço</h1>
          <p className="text-sm text-text-muted mt-1">Gerencie as ordens de produção</p>
        </div>
        <Button onClick={() => navigate('/orders/new')}><Plus size={16} /> Nova OS</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input className="pl-10" placeholder="Buscar por número ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="w-48">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="aberta">Aberta</option>
                <option value="em_producao">Em Produção</option>
                <option value="pausada">Pausada</option>
                <option value="finalizada">Finalizada</option>
                <option value="entregue">Entregue</option>
                <option value="cancelada">Cancelada</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-text-primary">#{order.order_number}</TableCell>
                    <TableCell>{order.clients?.name || '—'}</TableCell>
                    <TableCell>{order.products?.name || '—'}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{formatDate(order.delivery_date)}</TableCell>
                    <TableCell><PriorityBadge priority={order.priority} /></TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell>
                      <button onClick={() => navigate(`/orders/${order.id}`)} className="p-1 hover:text-primary transition-colors cursor-pointer"><Eye size={16} /></button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">Nenhuma OS encontrada</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
