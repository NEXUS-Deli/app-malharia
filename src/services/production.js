import { supabase } from '../lib/supabase'

export const productionService = {
  async getOrdersByStage() {
    const { data: stages } = await supabase
      .from('production_stages')
      .select('*')
      .order('position')

    if (!stages) return []

    const result = []
    for (const stage of stages) {
      const { data: orders } = await supabase
        .from('production_orders')
        .select('*, clients(name), products(name), production_order_stages(*, production_stages(*))')
        .eq('current_stage', stage.name)
        .in('status', ['aberta', 'em_producao', 'pausada'])
        .order('priority', { ascending: false })

      result.push({
        stage: stage,
        orders: orders || [],
      })
    }

    const { data: finishedOrders } = await supabase
      .from('production_orders')
      .select('*, clients(name), products(name), production_order_stages(*, production_stages(*))')
      .in('status', ['finalizada', 'entregue'])
      .order('updated_at', { ascending: false })

    result.push({
      stage: { id: 'finalized', name: 'Finalizado', position: 99 },
      orders: finishedOrders || [],
    })

    return result
  },

  async updateStageResponsible(stageId, responsibleId) {
    const { error } = await supabase
      .from('production_order_stages')
      .update({ responsible_id: responsibleId })
      .eq('id', stageId)
    if (error) throw error
  },

  async updateStageNotes(stageId, notes) {
    const { error } = await supabase
      .from('production_order_stages')
      .update({ notes })
      .eq('id', stageId)
    if (error) throw error
  },
}
