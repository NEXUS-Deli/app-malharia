import { supabase } from '../lib/supabase'

export const ordersService = {
  async list(filters = {}) {
    let query = supabase
      .from('production_orders')
      .select('*, clients(name), products(name), production_order_stages(*)')

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.client_id) query = query.eq('client_id', filters.client_id)
    if (filters.priority) query = query.eq('priority', filters.priority)

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('production_orders')
      .select('*, clients(*), products(*), production_order_stages(*, production_stages(*))')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(order) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('production_orders')
      .insert({ ...order, created_by: user.id })
      .select()
      .single()
    if (error) throw error

    await ordersService.createStages(data.id)
    return data
  },

  async createStages(orderId) {
    const { data: stages } = await supabase
      .from('production_stages')
      .select('*')
      .order('position')

    if (stages) {
      const stageRecords = stages.map((stage, index) => ({
        order_id: orderId,
        stage_id: stage.id,
        status: index === 0 ? 'em_andamento' : 'pendente',
        position: stage.position,
      }))

      const { error } = await supabase
        .from('production_order_stages')
        .insert(stageRecords)
      if (error) throw error
    }
  },

  async update(id, data) {
    const { error } = await supabase
      .from('production_orders')
      .update(data)
      .eq('id', id)
    if (error) throw error
  },

  async finish(id) {
    const { error } = await supabase
      .from('production_orders')
      .update({ status: 'finalizada', current_stage: 'acabamento' })
      .eq('id', id)
    if (error) throw error
  },

  async cancel(id) {
    const { error } = await supabase
      .from('production_orders')
      .update({ status: 'cancelada' })
      .eq('id', id)
    if (error) throw error
  },

  async moveToNextStage(orderId) {
    const { data: order } = await supabase
      .from('production_orders')
      .select('*, production_order_stages(*, production_stages(*))')
      .eq('id', orderId)
      .single()

    if (!order) throw new Error('Ordem não encontrada')

    const stages = order.production_order_stages
      .filter(s => s.production_stages)
      .sort((a, b) => a.production_stages.position - b.production_stages.position)

    const currentIndex = stages.findIndex(s => s.status === 'em_andamento')
    if (currentIndex === -1) return

    const currentStage = stages[currentIndex]
    const nextStage = stages[currentIndex + 1]

    await supabase
      .from('production_order_stages')
      .update({ status: 'concluida', completed_at: new Date().toISOString() })
      .eq('id', currentStage.id)

    if (nextStage) {
      await supabase
        .from('production_order_stages')
        .update({ status: 'em_andamento', started_at: new Date().toISOString() })
        .eq('id', nextStage.id)

      await supabase
        .from('production_orders')
        .update({ current_stage: nextStage.production_stages?.name || null, status: 'em_producao' })
        .eq('id', orderId)
    } else {
      await supabase
        .from('production_orders')
        .update({ status: 'finalizada', current_stage: 'finalizado' })
        .eq('id', orderId)
    }

    await ordersService.addHistory(orderId, `Fase concluída: ${currentStage.production_stages?.name}`)
  },

  async addHistory(orderId, description) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('production_history')
      .insert({ order_id: orderId, user_id: user.id, action: 'movimentacao', description })
    if (error) throw error
  },

  async getHistory(orderId) {
    const { data, error } = await supabase
      .from('production_history')
      .select('*, profiles(name)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
}
