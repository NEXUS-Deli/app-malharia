import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { clientsService } from '../services/clients'
import { productsService } from '../services/products'
import { ordersService } from '../services/orders'

export function OrderForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_id: '',
    product_id: '',
    quantity: 1,
    entry_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    priority: 'normal',
    notes: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p] = await Promise.all([clientsService.list(), productsService.list()])
        setClients(c)
        setProducts(p)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const getNextOrderNumber = async () => {
    const orders = await ordersService.list()
    const maxNum = orders.reduce((max, o) => {
      const num = parseInt(o.order_number)
      return num > max ? num : max
    }, 0)
    return String(maxNum + 1).padStart(4, '0')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderData = {
        ...form,
        order_number: await getNextOrderNumber(),
        current_stage: 'Desenho',
        status: 'aberta',
      }
      await ordersService.create(orderData)
      navigate('/orders')
    } catch (err) {
      console.error(err)
      alert('Erro ao criar OS. Verifique o console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Nova Ordem de Serviço</h1>
          <p className="text-sm text-text-muted mt-1">Preencha os dados do pedido</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Produto *</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade *</Label>
                <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Entrada</Label>
                <Input type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Prazo de Entrega *</Label>
                <Input type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/orders')}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                <Save size={16} />
                {loading ? 'Criando...' : 'Criar Ordem de Serviço'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
